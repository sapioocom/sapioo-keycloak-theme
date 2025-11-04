import { useWhiteLabel } from "../login/whiteLabel/WhiteLabelProvider";

export default function Footer() {
    const { config } = useWhiteLabel();
    const year = new Date().getFullYear();
    const brand = (config?.companyName && config.companyName.trim()) || "Sapioo, Inc.";

    return (
        <div
            style={{
                backgroundColor: "var(--wl-secondary, #5257E1)",
                height: 72,
                width: "100%",
                position: "fixed",
                bottom: 0,
                left: 0,
                zIndex: 1000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                className="container m-auto flex items-center justify-between"
                style={{
                    width: "91%",
                    margin: "0 auto",
                    padding: "0 20px",
                    maxWidth: 1580,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <div style={{ marginLeft: "auto" }}>
                    <p
                        style={{
                            color: "white",
                            fontSize: 16,
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontWeight: 500,
                        }}
                        aria-label="footer-copyright"
                    >
                        © {year} {brand}
                    </p>
                </div>
            </div>
        </div>
    );
}
