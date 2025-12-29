import type { WhiteLabelConfig, CustomerPortalId } from "./types";

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(v: string | null | undefined): v is CustomerPortalId {
    return !!v && UUID_RE.test(v);
}

function isHexColor(v: unknown): v is string {
    return typeof v === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v);
}

export function sanitize(cfg: any, customerPortalId: CustomerPortalId): WhiteLabelConfig {
    const out: WhiteLabelConfig = {
        customerPortalId,
        // optional debug fields
        whiteLabelId: typeof cfg?.whiteLabelId === "string" ? cfg.whiteLabelId : typeof cfg?.id === "string" ? cfg.id : undefined,

        logoUrl: typeof cfg?.logoUrl === "string" ? cfg.logoUrl : undefined,
        introductionText:
            typeof cfg?.introductionText === "string"
                ? cfg.introductionText
                : typeof cfg?.text === "string"
                    ? cfg.text
                    : undefined,
        primaryColor: isHexColor(cfg?.primaryColor) ? cfg.primaryColor : undefined,
        secondaryColor: isHexColor(cfg?.secondaryColor) ? cfg.secondaryColor : undefined,
        color: isHexColor(cfg?.color) ? cfg.color : undefined,
        companyName: typeof cfg?.companyName === "string" ? cfg.companyName.trim() : undefined,
    };

    return out;
}
