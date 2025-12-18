import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                // LOGIN
                signInTitle: "Sign in to your account",
                usernameOrEmail: "Email",
                password: "Password",
                rememberMe: "Remember me",
                forgotPassword: "Forgot Password?",
                signInButton: "SIGN IN",
                contact: "Contact",
                invalidCredentials: "Invalid username or password.",
                createAccount: "Create an account",

                // REGISTER
                createAccountTitle: "Create an account",
                registerUsername: "Username",
                registerPassword: "Password",
                registerConfirmPassword: "Confirm password",
                registerEmail: "Email",
                registerFirstName: "First name",
                registerLastName: "Last name",
                registerButton: "REGISTER",

                // FORGOT / RESET PASSWORD
                resetPasswordPageTitle: "Sapioo - Reset Password",
                resetPasswordHint:
                    "Enter your username or email and we’ll send you instructions to reset your password.",
                submitButton: "SUBMIT",

                // COMMON
                backToLogin: "Back to Login",

                // ARIA / ACCESSIBILITY
                showPasswordAria: "Show password",
                hidePasswordAria: "Hide password"
            }
        },
        ka: {
            translation: {
                // LOGIN
                signInTitle: "სისტემაში შესვლა",
                usernameOrEmail: "ელ-ფოსტა",
                password: "პაროლი",
                rememberMe: "დამახსოვრება",
                forgotPassword: "დაგავიწყდათ პაროლი?",
                signInButton: "სისტემაში შესვლა",
                contact: "კონტაქტი",
                invalidCredentials: "არასწორი მომხმარებლის სახელი ან პაროლი.",
                createAccount: "ანგარიშის შექმნა",

                // REGISTER
                createAccountTitle: "რეგისტრაცია",
                registerUsername: "მომხმარებლის სახელი",
                registerPassword: "პაროლი",
                registerConfirmPassword: "გაიმეორეთ პაროლი",
                registerEmail: "ელ. ფოსტა",
                registerFirstName: "სახელი",
                registerLastName: "გვარი",
                registerButton: "რეგისტრაცია",

                // FORGOT / RESET PASSWORD
                resetPasswordPageTitle: "Sapioo - პაროლის აღდგენა",
                resetPasswordHint:
                    "შეიყვანეთ მომხმარებლის სახელი ან ელ-ფოსტა და გამოგიგზავნით ინსტრუქციას პაროლის აღსადგენად.",
                submitButton: "გაგზავნა",

                // COMMON
                backToLogin: "უკან შესვლაზე",

                // ARIA / ACCESSIBILITY
                showPasswordAria: "პაროლის ჩვენება",
                hidePasswordAria: "პაროლის დამალვა"
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
