import { useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { useStyles } from "tss-react/mui";
import Alert from "@mui/material/Alert";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children,
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { msg, msgStr } = i18n;
    const { auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, []);

    useSetClassName({ qualifiedName: "html", className: kcClsx("kcHtmlClass") });
    useSetClassName({ qualifiedName: "body", className: bodyClassName ?? kcClsx("kcBodyClass") });

    const { css, cx } = useStyles();
    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });
    if (!isReadyToRender) return null;

    return (
        <div
            className={cx(
                kcClsx("kcLoginClass"),
                css({
                    height: "65vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                })
            )}
        >
            <div>
                <header className={kcClsx("kcFormHeaderClass")}>
                    {(() => {
                        const node =
                            !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                                <h1 id="kc-page-title" style={{ paddingBottom: 30 }}>
                                    {headerNode}
                                </h1>
                            ) : (
                                <div id="kc-username" className={kcClsx("kcFormGroupClass")}>
                                    <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                                    <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                                        <div className="kc-login-tooltip">
                                            <i className={kcClsx("kcResetFlowIcon")}></i>
                                            <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                                        </div>
                                    </a>
                                </div>
                            );

                        if (displayRequiredFields) {
                            return (
                                <div className={kcClsx("kcContentWrapperClass")}>
                                    <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                    <span className="subtitle">
                      <span className="required">*</span>
                        {msg("requiredFields")}
                    </span>
                                    </div>
                                    <div className="col-md-10">{node}</div>
                                </div>
                            );
                        }

                        return node;
                    })()}
                </header>

                <div id="kc-content">
                    <div id="kc-content-wrapper">
                        {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                            <Alert severity={message.type} sx={{ mb: 3, mt: 3 }}>
                                <span className={kcClsx("kcAlertTitleClass")} dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                            </Alert>
                        )}

                        {children}

                        {socialProvidersNode}

                        {displayInfo && infoNode && (
                            <div
                                className={css({
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: 20,
                                })}
                            >
                                {infoNode}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
