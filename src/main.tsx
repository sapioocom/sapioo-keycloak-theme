import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { KcPage } from "./kc.gen";
import i18n from "./login/config";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { WhiteLabelProvider } from "./login/whiteLabel/WhiteLabelProvider";

import { getKcContextMock } from "./login/KcPageStory";

import type { KcContext } from "./login/KcContext";
declare global {
    interface Window {
        kcContext?: KcContext;
    }
}

if (import.meta.env.DEV && !window.kcContext) {
    window.kcContext = getKcContextMock({
        pageId: "login.ftl",
        overrides: {},
    });
}

function NoKcFallback() {
    const [language, setLanguage] = useState(i18n.language || "en");
    const onSetLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setLanguage(lng);
    };

    return (
        <>
            <Header language={language} setLanguage={onSetLanguage} />
            <div
                style={{
                    minHeight: "calc(100vh - 72px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "24px 16px",
                    textAlign: "center",
                }}
            >
                <h1 style={{ color: "var(--wl-secondary, #1f3765)" }}>No Keycloak Context</h1>
            </div>
            <Footer />
        </>
    );
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <WhiteLabelProvider>
            {window.kcContext ? <KcPage kcContext={window.kcContext} /> : <NoKcFallback />}
        </WhiteLabelProvider>
    </StrictMode>
);
