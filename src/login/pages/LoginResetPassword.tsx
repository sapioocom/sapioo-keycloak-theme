import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";

import i18n from "../config";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useWhiteLabel } from "../whiteLabel/WhiteLabelProvider";

export default function LoginResetPassword(
    props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>
) {
    const { kcContext, i18n: i18nProps, doUseDefaultCss, Template, classes } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { url, messagesPerField } = kcContext;

    const { t } = useTranslation();
    const [language, setLanguage] = useState(i18n.language || "en");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    const { config } = useWhiteLabel();

    useEffect(() => {
        document.title = t("resetPasswordPageTitle");
    }, [t]);

    const headerNode = config?.introductionText ? (
        <span dangerouslySetInnerHTML={{ __html: kcSanitize(config.introductionText) }} />
    ) : (
        <span style={{ fontWeight: 500, fontSize: 30 }}>{t("forgotPassword")}</span>
    );

    const hasUsernameError = messagesPerField.existsError("username");

    return (
        <>
            <Header language={language} setLanguage={setLanguage} />

            <div style={{ boxShadow: "none", marginTop: 10 }}>
                <Template
                    kcContext={kcContext}
                    i18n={i18nProps}
                    doUseDefaultCss={doUseDefaultCss}
                    classes={classes}
                    headerNode={headerNode}
                    displayInfo={false}
                    displayMessage={!hasUsernameError}
                >
                    <div id="kc-form" style={{ display: "flex", justifyContent: "center" }}>
                        <div id="kc-form-wrapper" style={{ width: "100%", maxWidth: 600, padding: "0 20px" }}>
                            <form
                                id="kc-reset-password-form"
                                action={url.loginAction}
                                method="post"
                                onSubmit={() => {
                                    setIsSubmitDisabled(true);
                                    return true;
                                }}
                                style={{ display: "flex", flexDirection: "column", gap: 16 }}
                            >
                                <div className={kcClsx("kcFormGroupClass")}>
                                    <span style={{ fontSize: 20 }}>{t("usernameOrEmail")}</span>

                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <TextField
                                            sx={{
                                                width: "clamp(300px, 60vw, 600px)",
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 25,
                                                    height: 45
                                                }
                                            }}
                                            label=""
                                            variant="outlined"
                                            name="username"
                                            autoFocus
                                            autoComplete="username"
                                            error={hasUsernameError}
                                            helperText={
                                                hasUsernameError ? (
                                                    <span
                                                        style={{ color: "#d32f2f" }}
                                                        aria-live="polite"
                                                        dangerouslySetInnerHTML={{
                                                            __html: kcSanitize(messagesPerField.getFirstError("username"))
                                                        }}
                                                    />
                                                ) : (
                                                    <span style={{ opacity: 0.7 }}>
                            {t("resetPasswordHint")}
                          </span>
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div
                                    className={kcClsx("kcFormGroupClass")}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 16
                                    }}
                                >
                                    <Link sx={{ fontWeight: 600 }} href={url.loginUrl}>
                                        &laquo; {t("backToLogin")}
                                    </Link>
                                </div>

                                <div
                                    id="kc-form-buttons"
                                    className={kcClsx("kcFormGroupClass")}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        disabled={isSubmitDisabled}
                                        sx={{
                                            width: language === "ka" ? "205px" : "160px",
                                            backgroundColor: "var(--wl-secondary, #ffbd30)",
                                            boxShadow: "none",
                                            padding: "16px 32px",
                                            borderRadius: "15px",
                                            fontWeight: 700,
                                            "&:hover": { filter: "brightness(0.95)", boxShadow: "none" }
                                        }}
                                    >
                                        {t("submitButton")}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Template>
            </div>

            <Footer />
        </>
    );
}
