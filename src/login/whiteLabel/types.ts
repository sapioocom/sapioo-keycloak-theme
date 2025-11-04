export type WhiteLabelId = string;

export type WhiteLabelConfig = {
    whiteLabelId: WhiteLabelId;
    logoUrl?: string;
    introductionText?: string;
    primaryColor?: string;
    secondaryColor?: string;
    color?: string;
    companyName?: string;
};

export type WhiteLabelState =
    | { status: "idle"; config: null }
    | { status: "loading"; config: null; whiteLabelId: WhiteLabelId }
    | { status: "ready"; config: WhiteLabelConfig }
    | { status: "error"; config: null; error: string; whiteLabelId?: WhiteLabelId };
