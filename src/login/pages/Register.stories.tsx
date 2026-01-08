import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "register.ftl" });

const meta = {
    title: "login/register.ftl",
    component: KcPageStory,
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

const STANDARD_PROFILE_ATTRIBUTES = [
    { name: "firstName", required: true, displayName: "First name" },
    { name: "lastName", required: true, displayName: "Last name" },
    { name: "password", required: true, displayName: "Password" },
    { name: "password-confirm", required: true, displayName: "Confirm password" },
    { name: "email", required: true, displayName: "Email" },
];

export const Default: Story = {
    render: () => (
        <KcPageStory
            kcContext={
                {
                    profile: { attributes: STANDARD_PROFILE_ATTRIBUTES },
                } as any
            }
        />
    ),
};

export const WithEmailAsUsername: Story = {
    render: () => (
        <KcPageStory
            kcContext={
                {
                    realm: {
                        loginWithEmailAllowed: true,
                        registrationEmailAsUsername: true,
                    },
                    profile: { attributes: STANDARD_PROFILE_ATTRIBUTES },
                } as any
            }
        />
    ),
};

export const WithFieldErrors: Story = {
    render: () => (
        <KcPageStory
            kcContext={
                {
                    url: {
                        registrationAction: "/mock-registration-action",
                        loginUrl: "/mock-login-url",
                    },
                    realm: { registrationEmailAsUsername: false },
                    profile: { attributes: STANDARD_PROFILE_ATTRIBUTES },
                    messagesPerField: {
                        existsError: (field: string) =>
                            ["firstName", "lastName", "email", "password", "password-confirm"].includes(field),
                        getFirstError: (field: string) => {
                            switch (field) {
                                case "firstName":
                                    return "First name is required";
                                case "lastName":
                                    return "Last name is required";
                                case "email":
                                    return "Invalid email format";
                                case "password":
                                    return "Password must be at least 8 characters";
                                case "password-confirm":
                                    return "Passwords do not match";
                                default:
                                    return "Invalid field";
                            }
                        },
                    },
                } as any
            }
        />
    ),
};
