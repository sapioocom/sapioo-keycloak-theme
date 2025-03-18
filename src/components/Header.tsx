import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import SapiooLogo from "../images/sapiooLogo.png";

export default function Header({
    language,
    setLanguage
}: {
    language: string;
    setLanguage: (language: string) => void;
}) {
    const { t } = useTranslation();

    return (
        <div
            style={{
                borderBottom: "2px solid #ebebeb",
                padding: "25px 0",
                boxSizing: "border-box"
            }}
        >
            <div
                className="container m-auto flex items-center justify-between"
                style={{
                    width: "91%",
                    margin: "0 auto",
                    padding: "0 20px",
                    maxWidth: "1580px",
                    display: "flex",
                    alignItems: "center"
                }}
            >
                <div className="flex items-center text-black font-bold text-xl">
                    <a href="https://sapioo.com" rel="noopener noreferrer">
                        <img
                            src={SapiooLogo}
                            alt="Sapioo Logo"
                            className="object-contain cursor-pointer"
                            style={{ width: "162px", height: "auto" }}
                        />
                    </a>
                </div>
                <div
                    style={{
                        marginLeft: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                    }}
                >
                    <a
                        href="mailto:sapioo.info@gmail.com"
                        style={{
                            color: "black",
                            fontWeight: 500,
                            textDecoration: "none",
                            fontSize: 16
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
