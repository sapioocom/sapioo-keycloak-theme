import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { WhiteLabelConfig, WhiteLabelState } from "./types";
import { isUuid, sanitize } from "./api";

type Ctx = {
    state: WhiteLabelState;
    config: WhiteLabelConfig | null;
    whiteLabelId?: string;
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

function readWhiteLabelIdFromUrl(): string | undefined {
    const candidates = ["whiteLabelId", "whitelabelId", "white_label_id", "wl"];

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

export const WhiteLabelProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [state, setState] = useState<WhiteLabelState>({ status: "idle", config: null });
    const whiteLabelId = useMemo(readWhiteLabelIdFromUrl, []);

    useEffect(() => {
        setCssVars(null);

        if (!whiteLabelId) {
            console.log("[WL] no whiteLabelId in URL – using defaults");
            return;
        }
        if (!isUuid(whiteLabelId)) {
            console.warn("[WL] invalid whiteLabelId format:", whiteLabelId);
            return;
        }
        setState({ status: "loading", config: null, whiteLabelId });

        fetch(`${import.meta.env.VITE_WHITELABEL_API_BASE}/${whiteLabelId}`)
            .then((res) => res.json())
            .then((data) => {
                const formatted = sanitize(data);
                setCssVars(formatted);
                setState({ status: "ready", config: formatted });
            })
            .catch((err) => {
                console.error("[WL] fetch error", err);
                setState({
                    status: "error",
                    config: null,
                    error: err?.message || "WhiteLabel fetch failed",
                    whiteLabelId,
                });
            });
    }, [whiteLabelId]);

    const value: Ctx = {
        state,
        config: state.status === "ready" ? state.config : null,
        whiteLabelId,
    };

    return <WhiteLabelCtx.Provider value={value}>{children}</WhiteLabelCtx.Provider>;
};
