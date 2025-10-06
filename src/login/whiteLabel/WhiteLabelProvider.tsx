import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isUuid, sanitize } from "./api";
import type { WhiteLabelConfig, WhiteLabelState } from "./types";

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
    const sp = new URLSearchParams(window.location.search);
    const id = sp.get("whiteLabelId") || sp.get("white_label_id") || sp.get("wl");
    if (!id) return;
    return id;
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
            .then(res=>res.json())
            .then(data=>{
                const formatedData = sanitize(data)
                setCssVars(formatedData);
                setState({ status: "ready", config: formatedData });
            })
            .catch((err)=>{
                console.error(err)
            })
    }, [whiteLabelId]);

    const value: Ctx = {
        state,
        config: state.status === "ready" ? state.config : null,
        whiteLabelId,
    };

    return <WhiteLabelCtx.Provider value={value}>{children}</WhiteLabelCtx.Provider>;
};
