export type CustomerPortalId = string;

export type WhiteLabelConfig = {
    customerPortalId: CustomerPortalId;
    whiteLabelId?: string;
    logoUrl?: string;
    introductionText?: string;
    primaryColor?: string;
    secondaryColor?: string;
    color?: string;
    companyName?: string;
};

export type WhiteLabelState =
    | { status: "idle"; config: null }
    | { status: "loading"; config: null; customerPortalId: CustomerPortalId }
    | { status: "ready"; config: WhiteLabelConfig }
    | { status: "error"; config: null; error: string; customerPortalId?: CustomerPortalId };
