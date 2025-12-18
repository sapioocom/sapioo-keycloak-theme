import type { Meta, StoryObj } from "@storybook/react";
import { createKcPageStory } from "../KcPageStory";

const { KcPageStory } = createKcPageStory({ pageId: "login-reset-password.ftl" });

const meta = {
    title: "login/login-reset-password.ftl",
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

export const WithUsernameError: Story = {
    render: () => (
        <KcPageStory
            kcContext={
                {
                    url: {
                        loginAction: "/mock-login-action",
                        loginUrl: "/mock-login-url"
                    },
                    messagesPerField: {
                        existsError: (field: string) => field === "username",
                        getFirstError: () => "Invalid username or email"
                    },
                    auth: {
                        attemptedUsername: "invalid_user"
                    }
                } as any
            }
        />
    )
};
