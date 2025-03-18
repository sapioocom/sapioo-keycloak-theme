export default function Footer() {
    return (
        <div
            style={{
                backgroundColor: "#5257E1",
                height: 72,
                width: "100%",
                position: "fixed",
                bottom: 0,
                left: 0,
                zIndex: 1000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <div
                className="container m-auto flex items-center justify-between"
                style={{
                    width: "91%",
                    margin: "0 auto",
                    padding: "0 20px",
                    maxWidth: "1580px",
                    display: "flex",
                    alignItems: "center"
                }}
            >
                <div style={{ marginLeft: "auto" }}>
                    <p
                        style={{
                            color: "white",
                            fontSize: "16px",
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontWeight: 500
                        }}
                    >
                        © 2025 Sapioo, Inc.
                    </p>
                </div>
            </div>
        </div>
    );
}
