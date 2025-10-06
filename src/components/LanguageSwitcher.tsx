import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ILanguageSwitcherProps {
    language: string;
    setLanguage: (language: string) => void;
}

export default function LanguageSwitcher({
    language,
    setLanguage
}: ILanguageSwitcherProps) {
    const { i18n } = useTranslation();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const locale = urlParams.get("ui_locales");
        if (locale) {
            setLanguage(locale);
            i18n.changeLanguage(locale);
        }
    }, [setLanguage, i18n]);

    const handleLanguageChange = (selectedLanguage: string) => {
        setLanguage(selectedLanguage);
        i18n.changeLanguage(selectedLanguage);
        // console.log(`Language changed to: ${selectedLanguage}`);

        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("ui_locales", selectedLanguage);
        window.history.pushState(
            {},
            "",
            `${window.location.pathname}?${urlParams.toString()}`
        );
    };

    return (
        <div
            style={{ marginLeft: "20px", display: "flex", gap: "10px", fontSize: "16px" }}
        >
            <span
                onClick={() => handleLanguageChange("en")}
                style={{
                    cursor: "pointer",
                    fontWeight: language === "en" ? 600 : "normal",
                    color: language === "en" ? "#333" : "gray"
                }}
            >
                EN
            </span>
            <span
                onClick={() => handleLanguageChange("ka")}
                style={{
                    cursor: "pointer",
                    fontWeight: language === "ka" ? 600 : "normal",
                    color: language === "ka" ? "#333" : "gray"
                }}
            >
                KA
            </span>
        </div>
    );
}
