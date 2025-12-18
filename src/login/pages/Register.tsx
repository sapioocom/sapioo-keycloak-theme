import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import i18n from "../config";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useWhiteLabel } from "../whiteLabel/WhiteLabelProvider";

type ProfileAttr = {
    name: string;
    displayName?: string;
    required?: boolean;
    value?: string;
    readOnly?: boolean;
};

export default function Register(
    props: PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n>
) {
    const { kcContext, i18n: i18nProps, doUseDefaultCss, Template, classes } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    // NOTE: Keycloakify/KC versions differ; keep it resilient.
    const { url, messagesPerField } = kcContext as any;
    const profile = (kcContext as any).profile;

    const { t } = useTranslation();

    const [language, setLanguage] = useState(i18n.language || "en");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const { config } = useWhiteLabel();

    useEffect(() => {
        document.title = "Sapioo - Create Account";
    }, []);

    const headerNode = config?.introductionText ? (
        <span dangerouslySetInnerHTML={{ __html: kcSanitize(config.introductionText) }} />
    ) : (
        <span style={{ fontWeight: 500, fontSize: 30 }}>{t("createAccountTitle")}</span>
    );

    const formAction = (url as any).registrationAction ?? url.loginAction;

    const attributes: ProfileAttr[] = useMemo(() => {
        const attrs = (profile?.attributes ?? []) as ProfileAttr[];

        // Fallback if profile.attributes is missing
        if (!Array.isArray(attrs) || attrs.length === 0) {
            return [
                { name: "username", required: true },
                { name: "password", required: true },
                { name: "password-confirm", required: true },
                { name: "email", required: true },
                { name: "firstName", required: true },
                { name: "lastName", required: true }
            ];
        }

        return attrs;
    }, [profile]);

    const isPasswordField = (name: string) => name === "password";
    const isPasswordConfirmField = (name: string) =>
        name === "password-confirm" || name === "passwordConfirm" || name === "confirmPassword";

    const getLabelKeyByAttrName = (name: string) => {
        switch (name) {
            case "username":
                return "registerUsername";
            case "password":
                return "registerPassword";
            case "password-confirm":
            case "passwordConfirm":
            case "confirmPassword":
                return "registerConfirmPassword";
            case "email":
                return "registerEmail";
            case "firstName":
                return "registerFirstName";
            case "lastName":
                return "registerLastName";
            default:
                // fallback: show KC provided label if exists, otherwise raw name
                return "";
        }
    };

    const getFieldLabel = (a: ProfileAttr) => {
        const key = getLabelKeyByAttrName(a.name);
        const base = key ? t(key) : (a.displayName ?? a.name);
        return a.required ? `${base} *` : base;
    };

    const renderHelperError = (name: string) => {
        const hasErr = messagesPerField?.existsError?.(name);
        if (!hasErr) return null;

        return (
            <span
                style={{ color: "#d32f2f" }}
                aria-live="polite"
                dangerouslySetInnerHTML={{
                    __html: kcSanitize(messagesPerField.getFirstError(name))
                }}
            />
        );
    };

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
                    displayMessage={true}
                >
                    <div id="kc-form" style={{ display: "flex", justifyContent: "center" }}>
                        <div
                            id="kc-form-wrapper"
                            style={{ width: "100%", maxWidth: 600, padding: "0 20px" }}
                        >
                            <form
                                id="kc-register-form"
                                action={formAction}
                                method="post"
                                onSubmit={() => {
                                    setIsSubmitDisabled(true);
                                    return true;
                                }}
                                style={{ display: "flex", flexDirection: "column", gap: 16 }}
                            >
                                {attributes.map((a) => {
                                    const name = a.name;
                                    const label = getFieldLabel(a);

                                    // Password
                                    if (isPasswordField(name)) {
                                        const hasErr = messagesPerField?.existsError?.(name);

                                        return (
                                            <div key={name} className={kcClsx("kcFormGroupClass")}>
                                                <span style={{ fontSize: 20 }}>{label}</span>

                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                    <FormControl
                                                        sx={{
                                                            width: "clamp(300px, 60vw, 600px)",
                                                            "& .MuiOutlinedInput-root": {
                                                                borderRadius: 25,
                                                                height: 45
                                                            }
                                                        }}
                                                        variant="outlined"
                                                        error={!!hasErr}
                                                    >
                                                        <OutlinedInput
                                                            name={name}
                                                            type={showPassword ? "text" : "password"}
                                                            endAdornment={
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        aria-label={
                                                                            showPassword
                                                                                ? t("hidePasswordAria")
                                                                                : t("showPasswordAria")
                                                                        }
                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                        onMouseDown={(e) => e.preventDefault()}
                                                                        edge="end"
                                                                    >
                                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            }
                                                        />
                                                        {hasErr && (
                                                            <FormHelperText>{renderHelperError(name)}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Confirm password
                                    if (isPasswordConfirmField(name)) {
                                        const hasErr = messagesPerField?.existsError?.(name);

                                        return (
                                            <div key={name} className={kcClsx("kcFormGroupClass")}>
                                                <span style={{ fontSize: 20 }}>{label}</span>

                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                    <FormControl
                                                        sx={{
                                                            width: "clamp(300px, 60vw, 600px)",
                                                            "& .MuiOutlinedInput-root": {
                                                                borderRadius: 25,
                                                                height: 45
                                                            }
                                                        }}
                                                        variant="outlined"
                                                        error={!!hasErr}
                                                    >
                                                        <OutlinedInput
                                                            name={name}
                                                            type={showPasswordConfirm ? "text" : "password"}
                                                            endAdornment={
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        aria-label={
                                                                            showPasswordConfirm
                                                                                ? t("hidePasswordAria")
                                                                                : t("showPasswordAria")
                                                                        }
                                                                        onClick={() =>
                                                                            setShowPasswordConfirm(!showPasswordConfirm)
                                                                        }
                                                                        onMouseDown={(e) => e.preventDefault()}
                                                                        edge="end"
                                                                    >
                                                                        {showPasswordConfirm ? (
                                                                            <VisibilityOff />
                                                                        ) : (
                                                                            <Visibility />
                                                                        )}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            }
                                                        />
                                                        {hasErr && (
                                                            <FormHelperText>{renderHelperError(name)}</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                </div>
                                            </div>
                                        );
                                    }

                                    // Regular text fields
                                    const hasErr = messagesPerField?.existsError?.(name);
                                    const defaultValue = (a as any).value ?? "";

                                    return (
                                        <div key={name} className={kcClsx("kcFormGroupClass")}>
                                            <span style={{ fontSize: 20 }}>{label}</span>

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
                                                    name={name}
                                                    defaultValue={defaultValue}
                                                    autoComplete={name}
                                                    disabled={(a as any).readOnly}
                                                    error={!!hasErr}
                                                    helperText={hasErr ? renderHelperError(name) : undefined}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}

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
                                            "&:hover": {
                                                filter: "brightness(0.95)",
                                                boxShadow: "none"
                                            }
                                        }}
                                    >
                                        {t("registerButton")}
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
