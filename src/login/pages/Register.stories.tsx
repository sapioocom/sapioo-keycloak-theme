import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "register.ftl" });

const meta = {
    title: "login/register.ftl",
    component: KcPageStory
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <KcPageStory />
};

export const WithEmailAsUsername: Story = {
    render: () => (
        <KcPageStory
            // Storybook-only: our custom Register page reads these via `kcContext as any`,
            // but the official KcContext type might not include them -> cast to any.
            kcContext={
                {
                    realm: {
                        loginWithEmailAllowed: true,
                        registrationEmailAsUsername: true
                    }
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
                    realm: {
                        registrationEmailAsUsername: false
                    },
                    profile: {
                        attributes: [
                            { name: "username", required: true, displayName: "Username" },
                            { name: "password", required: true, displayName: "Password" },
                            { name: "password-confirm", required: true, displayName: "Confirm password" },
                            { name: "email", required: true, displayName: "Email" },
                            { name: "firstName", required: true, displayName: "First name" },
                            { name: "lastName", required: true, displayName: "Last name" }
                        ]
                    },
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
