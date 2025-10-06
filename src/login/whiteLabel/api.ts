import type { WhiteLabelConfig, WhiteLabelId } from "./types";

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(v: string | null | undefined): v is WhiteLabelId {
    return !!v && UUID_RE.test(v);
}

function isHexColor(v: unknown): v is string {
    return typeof v === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v);
}

export function sanitize(cfg: any): WhiteLabelConfig {
    const out: WhiteLabelConfig = {
        whiteLabelId: String(cfg.whiteLabelId ?? cfg.id ?? ""),
        logoUrl: typeof cfg.logoUrl === "string" ? cfg.logoUrl : undefined,
        introductionText:
            typeof cfg.introductionText === "string"
                ? cfg.introductionText
                : typeof cfg.text === "string"
                    ? cfg.text
                    : undefined,
        primaryColor: isHexColor(cfg.primaryColor) ? cfg.primaryColor : undefined,
        secondaryColor: isHexColor(cfg.secondaryColor) ? cfg.secondaryColor : undefined,
        color: isHexColor(cfg.color) ? cfg.color : undefined,
    };
    return out;
}

const CACHE_NS = "wl-cache:";

/** GET config by id with sessionStorage cache & hard fallback */
export async function fetchWhiteLabelConfig(
    id: WhiteLabelId
): Promise<WhiteLabelConfig> {
    const cacheKey = `${CACHE_NS}${id}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
        console.debug("[WL] using cached config for", id);
        return JSON.parse(cached) as WhiteLabelConfig;
    }

    const base =
        // eslint-disable-next-line no-restricted-globals
        (self as any).__WL_API_BASE__ ??
        import.meta.env.VITE_WHITELABEL_API_BASE ??
        "/api/whitelabel";

    const url =
        base.endsWith("/")
            ? `${base}${id}`
            : `${base}/` + id;

    // console.log("[WL] fetching", url);

    const res = await fetch(url, { credentials: "include" }).catch((e) => {
        throw new Error("network_error:" + e);
    });

    if (!res.ok) {
        throw new Error(`http_${res.status}`);
    }

    const json = await res.json().catch(() => {
        throw new Error("invalid_json");
    });

    const cfg = sanitize({ ...json, whiteLabelId: id });

    if (!cfg.whiteLabelId) throw new Error("missing_id_in_response");

    sessionStorage.setItem(cacheKey, JSON.stringify(cfg));
    return cfg;
}
