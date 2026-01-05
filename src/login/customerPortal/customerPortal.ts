function normalizeKey(v: unknown): string {
    return String(v ?? "").trim();
}

export function getCustomerPortalApiBase(): string | undefined {
    const base = import.meta.env.VITE_CUSTOMER_PORTAL_API_BASE as string | undefined;
    if (!base) return undefined;
    return base.replace(/\/+$/, "");
}

/**
 * Reads customerPortalId from URL (query/hash/redirect_uri)
 * Includes legacy fallbacks (whiteLabelId) only for backwards compatibility.
 */
export function readCustomerPortalIdFromUrl(): string | undefined {
    const candidates = [
        "customerPortalId",
        "customer_portal_id",
        "cp",
        // legacy fallback (old links)
        "whiteLabelId",
        "whitelabelId",
        "white_label_id",
        "wl",
    ];

    const topParams = new URLSearchParams(window.location.search);
    for (const k of candidates) {
        const v = topParams.get(k);
        if (v) return v;
    }

    const redirectRaw = topParams.get("redirect_uri");
    if (redirectRaw) {
        try {
            const decoded = decodeURIComponent(redirectRaw);
            const redirectUrl = new URL(decoded);

            const innerParams = new URLSearchParams(redirectUrl.search);
            for (const k of candidates) {
                const v = innerParams.get(k);
                if (v) return v;
            }

            if (redirectUrl.hash) {
                const hashParams = new URLSearchParams(redirectUrl.hash.slice(1));
                for (const k of candidates) {
                    const v = hashParams.get(k);
                    if (v) return v;
                }
            }
        } catch {
            /* ignore malformed redirect_uri */
        }
    }

    if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        for (const k of candidates) {
            const v = hashParams.get(k);
            if (v) return v;
        }
    }

    return undefined;
}

export function withCustomerPortalId(urlLike: string, customerPortalId?: string): string {
    if (!customerPortalId) return urlLike;
    try {
        const u = new URL(urlLike, window.location.origin);
        // standard param
        if (!u.searchParams.get("customerPortalId")) {
            u.searchParams.set("customerPortalId", customerPortalId);
        }
        return u.toString();
    } catch {
        // If it's not a valid URL, keep as-is
        return urlLike;
    }
}

/**
 * Safe registration-completed detector:
 * - only when message.type === "success"
 * - and message key matches known keys (string keys)
 *
 * NOTE: In some Keycloak setups message.summary is NOT a key but a rendered text.
 * We keep strict key match here (as you want), but we also add OPTIONAL fallback
 * based on common text fragments. You can disable fallback if you prefer.
 */
const REGISTRATION_SUCCESS_KEYS = new Set<string>([
    "accountCreatedMessage",
    "accountCreated",
    "registerSuccess",
    "registrationSuccessful",
]);

function extractMessageKey(kcContext: any): string {
    const msg = kcContext?.message;
    const summary = normalizeKey(msg?.summary);
    const message = normalizeKey(msg?.message);
    return summary || message;
}

export function isRegistrationCompleted(kcContext: any): { ok: boolean; key: string } {
    const msg = kcContext?.message;
    const type = normalizeKey(msg?.type);
    const key = extractMessageKey(kcContext);

    if (type !== "success") return { ok: false, key };
    if (!key) return { ok: false, key: "" };

    // Strict mode: only whitelisted keys
    if (REGISTRATION_SUCCESS_KEYS.has(key)) return { ok: true, key };

    // OPTIONAL fallback: some installations return final rendered string, not key.
    // Keep this ON if you want it to work across envs.
    const lowered = key.toLowerCase();
    const looksLikeCreated =
        lowered.includes("account has been created") ||
        lowered.includes("your account has been created") ||
        lowered.includes("ანგარიში შექმნილია") ||
        lowered.includes("რეგისტრაცია წარმატებულია");

    return { ok: looksLikeCreated, key };
}

export async function sendRegistrationCompletedEvent(customerPortalId: string): Promise<void> {
    const apiBase = getCustomerPortalApiBase();
    if (!apiBase) {
        console.warn("[CP] missing VITE_CUSTOMER_PORTAL_API_BASE – cannot send registration-completed");
        return;
    }

    const endpoint = `${apiBase}/${customerPortalId}/events/registration-completed`;

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
            keepalive: true,
        });

        if (!res.ok) {
            const txt = await res.text().catch(() => "");
            console.warn("[CP] registration-completed failed:", res.status, txt);
            return;
        }

        console.log("[CP] registration-completed sent successfully");
    } catch (err) {
        console.warn("[CP] registration-completed request error:", err);
    }
}
