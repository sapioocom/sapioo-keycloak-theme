import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { WhiteLabelConfig, WhiteLabelState, CustomerPortalId } from "./types";
import { isUuid, sanitize } from "./api";

import {
    readCustomerPortalIdFromUrl,
    getCustomerPortalApiBase,
} from "../customerPortal/customerPortal";

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

export const WhiteLabelProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [state, setState] = useState<WhiteLabelState>({ status: "idle", config: null });

    const customerPortalId = useMemo(() => {
        if (typeof window === "undefined") return undefined;
        return readCustomerPortalIdFromUrl();
    }, []);

    useEffect(() => {
        setCssVars(null);

        if (!customerPortalId) {
            console.log("[CP] no customerPortalId in URL – using defaults");
            return;
        }
        if (!isUuid(customerPortalId)) {
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
