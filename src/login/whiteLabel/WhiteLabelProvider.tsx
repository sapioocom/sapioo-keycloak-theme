import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { WhiteLabelConfig, WhiteLabelState, CustomerPortalId } from "./types";
import { isUuid, sanitize } from "./api";

type Ctx = {
    state: WhiteLabelState;
    config: WhiteLabelConfig | null;
    customerPortalId?: string;
};

const WhiteLabelCtx = createContext<Ctx>({ state: { status: "idle", config: null }, config: null });

export const useWhiteLabel = () => useContext(WhiteLabelCtx);

function setCssVars(cfg?: WhiteLabelConfig | null) {
    const root = document.documentElement.style;
    root.removeProperty("--wl-primary");
    root.removeProperty("--wl-secondary");
    if (!cfg) return;
    if (cfg.primaryColor) root.setProperty("--wl-primary", cfg.primaryColor);
    if (cfg.secondaryColor) root.setProperty("--wl-secondary", cfg.secondaryColor);
}

function getCustomerPortalApiBase(): string | undefined {
    const base = import.meta.env.VITE_CUSTOMER_PORTAL_API_BASE as string | undefined;
    if (!base) return undefined;
    return base.replace(/\/+$/, "");
}

function isCustomerPortalId(value: string): boolean {
    if (isUuid(value)) return true;
    return /^[a-f0-9]{24}$/i.test(value);
}

function base64UrlDecodeToString(input: string): string | null {
    try {
        const pad = "=".repeat((4 - (input.length % 4)) % 4);
        const b64 = (input + pad).replace(/-/g, "+").replace(/_/g, "/");
        const decoded = atob(b64);

        // handle utf-8
        try {
            return decodeURIComponent(
                decoded
                    .split("")
                    .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
                    .join("")
            );
        } catch {
            return decoded;
        }
    } catch {
        return null;
    }
}

function extractIdFromUrlString(urlStr: string): string | undefined {
    const candidates = [
        "customerPortalId",
        "customer_portal_id",
        "cp",
        // legacy fallbacks:
        "whiteLabelId",
        "whitelabelId",
        "white_label_id",
        "wl",
    ];

    try {
        const u = new URL(urlStr);

        const qp = new URLSearchParams(u.search);
        for (const k of candidates) {
            const v = qp.get(k);
            if (v) return v;
        }

        if (u.hash) {
            const hp = new URLSearchParams(u.hash.slice(1));
            for (const k of candidates) {
                const v = hp.get(k);
                if (v) return v;
            }
        }
    } catch {
        // ignore
    }

    return undefined;
}

function readCustomerPortalIdFromUrl(): string | undefined {
    const candidates = [
        "customerPortalId",
        "customer_portal_id",
        "cp",
        // legacy fallbacks:
        "whiteLabelId",
        "whitelabelId",
        "white_label_id",
        "wl",
    ];

    const topParams = new URLSearchParams(window.location.search);

    // 1) direct params
    for (const k of candidates) {
        const v = topParams.get(k);
        if (v) return v;
    }

    // 2) redirect_uri param (login page has it)
    const redirectRaw = topParams.get("redirect_uri");
    if (redirectRaw) {
        try {
            const decoded = decodeURIComponent(redirectRaw);
            const fromRedirect = extractIdFromUrlString(decoded);
            if (fromRedirect) return fromRedirect;
        } catch {
            /* ignore */
        }
    }

    // 3) client_data param (registration page has it)
    const clientDataRaw = topParams.get("client_data");
    if (clientDataRaw) {
        const jsonStr = base64UrlDecodeToString(clientDataRaw);
        if (jsonStr) {
            try {
                const obj = JSON.parse(jsonStr) as any;

                // Keycloak puts redirect uri inside `ru` (your sample confirms this)
                const ru = String(obj?.ru ?? "").trim();
                if (ru) {
                    const fromRu = extractIdFromUrlString(ru);
                    if (fromRu) return fromRu;
                }

                // extra fallback (just in case)
                for (const k of candidates) {
                    const v = obj?.[k];
                    if (typeof v === "string" && v.trim()) return v.trim();
                }
            } catch {
                /* ignore */
            }
        }
    }

    // 4) hash params
    if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        for (const k of candidates) {
            const v = hashParams.get(k);
            if (v) return v;
        }
    }

    return undefined;
}

export const WhiteLabelProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [state, setState] = useState<WhiteLabelState>({ status: "idle", config: null });
    const customerPortalId = useMemo(readCustomerPortalIdFromUrl, []);

    useEffect(() => {
        setCssVars(null);

        if (!customerPortalId) {
            console.log("[CP] no customerPortalId in URL – using defaults");
            return;
        }

        if (!isCustomerPortalId(customerPortalId)) {
            console.warn("[CP] invalid customerPortalId format:", customerPortalId);
            return;
        }

        const apiBase = getCustomerPortalApiBase();
        if (!apiBase) {
            console.warn("[CP] missing VITE_CUSTOMER_PORTAL_API_BASE – using defaults");
            return;
        }

        setState({ status: "loading", config: null, customerPortalId });

        fetch(`${apiBase}/${customerPortalId}/whitelabel`)
            .then(async (res) => {
                if (!res.ok) {
                    const txt = await res.text().catch(() => "");
                    throw new Error(`HTTP ${res.status} ${res.statusText}${txt ? ` - ${txt}` : ""}`);
                }
                return res.json();
            })
            .then((data) => {
                const formatted = sanitize(data, customerPortalId as CustomerPortalId);
                setCssVars(formatted);
                setState({ status: "ready", config: formatted });
            })
            .catch((err) => {
                console.error("[CP] whitelabel fetch error", err);
                setState({
                    status: "error",
                    config: null,
                    error: err?.message || "WhiteLabel fetch failed",
                    customerPortalId,
                });
            });
    }, [customerPortalId]);

    const value: Ctx = {
        state,
        config: state.status === "ready" ? state.config : null,
        customerPortalId,
    };

    return <WhiteLabelCtx.Provider value={value}>{children}</WhiteLabelCtx.Provider>;
};
