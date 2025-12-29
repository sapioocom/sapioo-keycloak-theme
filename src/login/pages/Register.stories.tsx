import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "register.ftl" });

const meta = {
    title: "login/register.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

const FULL_PROFILE_ATTRIBUTES = [
    { name: "username", required: true, displayName: "Username" },
    { name: "password", required: true, displayName: "Password" },
    { name: "password-confirm", required: true, displayName: "Confirm password" },
    { name: "email", required: true, displayName: "Email" },
    { name: "firstName", required: true, displayName: "First name" },
    { name: "lastName", required: true, displayName: "Last name" },
    { name: "sapioo_account_id", required: false, displayName: "sapioo_account_id" },
    { name: "sapioo_domain", required: false, displayName: "sapioo_domain" },
    { name: "sapioo_role", required: false, displayName: "sapioo_role" },
    { name: "sapioo_role_id", required: false, displayName: "sapioo_role_id" },
    { name: "sapioo_timezone", required: false, displayName: "sapioo_timezone" }
];

export const Default: Story = {
    render: () => (
        <KcPageStory
            kcContext={
                {
                    profile: { attributes: FULL_PROFILE_ATTRIBUTES }
                } as any
            }
        />
    )
};

export const WithEmailAsUsername: Story = {
    render: () => (
        <KcPageStory
            kcContext={
                {
                    realm: {
                        loginWithEmailAllowed: true,
                        registrationEmailAsUsername: true
                    },
                    profile: { attributes: FULL_PROFILE_ATTRIBUTES }
                } as any
            }
        />
    )
};

export const WithFieldErrors: Story = {
    render: () => (
        <KcPageStory
            kcContext={
                {
                    url: {
                        registrationAction: "/mock-registration-action",
                        loginUrl: "/mock-login-url"
                    },
                    realm: { registrationEmailAsUsername: false },
                    profile: { attributes: FULL_PROFILE_ATTRIBUTES },
                    messagesPerField: {
                        existsError: (field: string) =>
                            ["username", "email", "password", "password-confirm"].includes(field),
                        getFirstError: (field: string) => {
                            switch (field) {
                                case "username":
                                    return "Username is already taken";
                                case "email":
                                    return "Invalid email format";
                                case "password":
                                    return "Password must be at least 8 characters";
                                case "password-confirm":
                                    return "Passwords do not match";
                                default:
                                    return "Invalid field";
                            }
                        }
                    }
                } as any
            }
        />
    )
};
