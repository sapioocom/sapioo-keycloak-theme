// src/i18n/config.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                signInTitle: "Sign in to your account",
                usernameOrEmail: "Email",
                password: "Password",
                rememberMe: "Remember me",
                forgotPassword: "Forgot Password?",
                signInButton: "SIGN IN",
                contact: "Contact",
                invalidCredentials: "Invalid username or password."
            }
        },
        ka: {
            translation: {
                signInTitle: "სისტემაში შესვლა",
                usernameOrEmail: "ელ-ფოსტა",
                password: "პაროლი",
                rememberMe: "დამახსოვრება",
                forgotPassword: "დაგავიწყდათ პაროლი?",
                signInButton: "სისტემაში შესვლა",
                contact: "კონტაქტი",
                invalidCredentials: "არასწორი მომხმარებლის სახელი ან პაროლი."
            }
        }
    },
    lng: "ka",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;
