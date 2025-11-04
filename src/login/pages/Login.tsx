import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormHelperText from "@mui/material/FormHelperText";
import Link from "@mui/material/Link";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import i18n from "../config";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useWhiteLabel } from "../whiteLabel/WhiteLabelProvider";

export default function Login(
    props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>
) {
    const { kcContext, i18n: i18nProps, doUseDefaultCss, Template, classes } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { social, realm, url, usernameHidden, login, auth, messagesPerField } = kcContext;

    const { t } = useTranslation();
    const [language, setLanguage] = useState(i18n.language || "en");
    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { config } = useWhiteLabel();

    useEffect(() => {
        document.title = "Sapioo - Sign In";
    }, []);

    const headerNode = config?.introductionText ? (
        <span dangerouslySetInnerHTML={{ __html: kcSanitize(config.introductionText) }} />
    ) : (
        <span style={{ fontWeight: 500, fontSize: 30 }}>{t("signInTitle")}</span>
    );

    return (
        <>
            <Header language={language} setLanguage={setLanguage} />

            <div style={{ boxShadow: "none", marginTop: 10 }}>
                <Template
                    kcContext={kcContext}
                    i18n={i18nProps}
                    doUseDefaultCss={doUseDefaultCss}
                    classes={classes}
                    displayMessage={!messagesPerField.existsError("username", "password")}
                    headerNode={headerNode}
                    displayInfo={false}
                    socialProvidersNode={
                        <>
                            {realm.password && social?.providers && social.providers.length !== 0 && (
                                <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
                                    <hr />
                                    <h2>{t("identity-provider-login-label")}</h2>
                                    <ul
                                        className={kcClsx(
                                            "kcFormSocialAccountListClass",
                                            social.providers.length > 3 && "kcFormSocialAccountListGridClass"
                                        )}
                                    >
                                        {social.providers.map((...[p, , providers]) => (
                                            <li key={p.alias}>
                                                <a
                                                    id={`social-${p.alias}`}
                                                    className={kcClsx("kcFormSocialAccountListButtonClass", providers.length > 3 && "kcFormSocialAccountGridItem")}
                                                    type="button"
                                                    href={p.loginUrl}
                                                >
                                                    {p.iconClasses && <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true"></i>}
                                                    <span
                                                        className={clsx(kcClsx("kcFormSocialAccountNameClass"), p.iconClasses && "kc-social-icon-text")}
                                                        dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                                                    />
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    }
                >
                    <div id="kc-form" style={{ display: "flex", justifyContent: "center" }}>
                        <div id="kc-form-wrapper" style={{ width: "100%", maxWidth: 600, padding: "0 20px" }}>
                            {realm.password && (
                                <form
                                    id="kc-form-login"
                                    onSubmit={() => {
                                        setIsLoginButtonDisabled(true);
                                        return true;
                                    }}
                                    action={url.loginAction}
                                    method="post"
                                    style={{ display: "flex", flexDirection: "column", gap: 16 }}
                                >
                                    {!usernameHidden && (
                                        <div className={kcClsx("kcFormGroupClass")}>
                      <span style={{ fontSize: 20 }}>
                        {!realm.loginWithEmailAllowed ? t("username") : !realm.registrationEmailAsUsername ? t("usernameOrEmail") : t("email")}
                      </span>
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                <TextField
                                                    sx={{
                                                        width: "clamp(300px, 60vw, 600px)",
                                                        "& .MuiOutlinedInput-root": { borderRadius: 25, height: 45 },
                                                    }}
                                                    label=""
                                                    variant="outlined"
                                                    tabIndex={2}
                                                    name="username"
                                                    defaultValue={login.username ?? ""}
                                                    autoFocus
                                                    autoComplete="username"
                                                    error={messagesPerField.existsError("username", "password")}
                                                    helperText={
                                                        messagesPerField.existsError("username", "password") && (
                                                            <span
                                                                style={{ color: "#d32f2f" }}
                                                                aria-live="polite"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: kcSanitize(messagesPerField.getFirstError("username", "password")),
                                                                }}
                                                            />
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className={kcClsx("kcFormGroupClass")}>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <FormControl
                                                sx={{ width: "clamp(300px, 60vw, 600px)", "& .MuiOutlinedInput-root": { borderRadius: 25, height: 45 } }}
                                                variant="outlined"
                                                error={messagesPerField.existsError("username", "password")}
                                            >
                                                <span style={{ fontSize: 20 }}>{t("password")}</span>
                                                <InputLabel htmlFor="outlined-adornment-password" />
                                                <OutlinedInput
                                                    tabIndex={3}
                                                    name="password"
                                                    autoComplete="current-password"
                                                    id="outlined-adornment-password"
                                                    type={showPassword ? "text" : "password"}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label={showPassword ? "hide the password" : "display the password"}
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                onMouseDown={(e) => e.preventDefault()}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    label=""
                                                />
                                                {usernameHidden && messagesPerField.existsError("username", "password") && (
                                                    <FormHelperText>
                            <span
                                style={{ color: "#d32f2f" }}
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.getFirstError("username", "password")),
                                }}
                            />
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                        </div>
                                    </div>

                                    <div className={kcClsx("kcFormGroupClass", "kcFormSettingClass")}>
                                        <div id="kc-form-options">
                                            {realm.rememberMe && !usernameHidden && (
                                                <FormControlLabel control={<Checkbox defaultChecked={!!login.rememberMe} name="rememberMe" tabIndex={5} />} label={t("rememberMe")} />
                                            )}
                                        </div>
                                        <div className={kcClsx("kcFormOptionsWrapperClass")}>
                                            {realm.resetPasswordAllowed && (
                                                <span>
                          <Link sx={{ display: "inline-block", position: "relative", top: 14, fontWeight: 600 }} tabIndex={6} href={url.loginResetCredentialsUrl}>
                            {t("forgotPassword")}
                          </Link>
                        </span>
                                            )}
                                        </div>
                                    </div>

                                    <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            disabled={isLoginButtonDisabled}
                                            name="login"
                                            sx={{
                                                width: language === "ka" ? "205px" : "120px",
                                                backgroundColor: "var(--wl-secondary, #ffbd30)",
                                                boxShadow: "none",
                                                padding: "16px 32px",
                                                borderRadius: "15px",
                                                fontWeight: 700,
                                                "&:hover": { filter: "brightness(0.95)", boxShadow: "none" },
                                            }}
                                        >
                                            {t("signInButton")}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </Template>
            </div>

            <Footer />
        </>
    );
}
