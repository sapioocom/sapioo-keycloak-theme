import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import SapiooLogo from "../images/sapiooLogo.png";
import { useWhiteLabel } from "../login/whiteLabel/WhiteLabelProvider";

function resolveSapiooPortalUrl(): string {
    let host = "";
    if (typeof window !== "undefined" && window.location) {
        host = window.location.hostname.toLowerCase();
    }
    const isDev = host.startsWith("panda1") || host === "localhost";
    return isDev ? "https://panda1-openid.sapioo.com/" : "https://portal.sapioo.com/";
}

export default function Header({
                                   language,
                                   setLanguage,
                               }: {
    language: string;
    setLanguage: (language: string) => void;
}) {
    const { t } = useTranslation();
    const portalUrl = resolveSapiooPortalUrl();
    const { config } = useWhiteLabel();

    const logoSrc = config?.logoUrl ?? SapiooLogo;
    const isCustomLogo = !!config?.logoUrl;

    return (
        <div
            style={{
                borderBottom: "2px solid #ebebeb",
                padding: "25px 0",
                boxSizing: "border-box",
            }}
        >
            <div
                className="container m-auto flex items-center justify-between"
                style={{
                    width: "91%",
                    margin: "0 auto",
                    padding: "0 20px",
                    maxWidth: 1580,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <div className="flex items-center text-black font-bold text-xl">
                    <a href={portalUrl} rel="noopener noreferrer">
                        <img
                            src={logoSrc}
                            alt="Logo"
                            className="object-contain cursor-pointer"
                            style={{
                                width: isCustomLogo ? 95 : 162,
                                maxHeight: isCustomLogo ? 48 : "none",
                            }}
                            onError={(e) =>
                                ((e.currentTarget as HTMLImageElement).src = SapiooLogo)
                            }
                        />
                    </a>
                </div>

                <div
                    style={{
                        marginLeft: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                    }}
                >
                    <a
                        href="mailto:sapioo.info@gmail.com"
                        style={{
                            color: "black",
                            fontWeight: 500,
                            textDecoration: "none",
                            fontSize: 16,
                        }}
                    >
                        {t("contact")}
                    </a>
                    <LanguageSwitcher language={language} setLanguage={setLanguage} />
                </div>
            </div>
        </div>
    );
}
