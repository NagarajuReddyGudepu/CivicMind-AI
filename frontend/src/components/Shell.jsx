import Icon from "./Icon";

const CIT = [
    ["dashboard", "Dashboard", "dash"],
    ["report", "Report Issue", "plus"],
    ["reports", "My Reports", "file"],
    ["profile", "Profile", "user"]
];

const ADM = [
    ["admin", "Dashboard", "dash"],
    ["adminReports", "Reports", "file"],
    ["map", "Map View", "map"],
    ["users", "Users", "users"],
    ["settings", "Settings", "gear"]
];

const group = {
    report: ["report", "analysis", "complaint"],
    reports: ["reports", "detail"],
    adminReports: ["adminReports", "detail"]
};

export default function Shell({
    page,
    go,
    role,
    user,
    onLogout,
    children
}) {
    const admin = role === "admin";
    const items = admin ? ADM : CIT;

    return (
        <div className={"shell" + (admin ? " admin" : "")}>

            {/* TOP HEADER */}
            <header
                className="top"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    minHeight: "78px",
                    boxSizing: "border-box"
                }}
            >

                {/* LOGO */}
                <button
                    className="logo"
                    onClick={() =>
                        go(admin ? "admin" : "home")
                    }
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexShrink: 0
                    }}
                >
                    <Icon n="pin" />
                    CivicMind AI
                </button>


                {/* RIGHT SIDE */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "18px",
                        marginLeft: "auto",
                        flexShrink: 0
                    }}
                >

                    {/* USER */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "9px",
                            color: "#ffffff",
                            fontWeight: "700",
                            whiteSpace: "nowrap"
                        }}
                    >

                        <span
                            style={{
                                width: "36px",
                                height: "36px",
                                minWidth: "36px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgba(255,255,255,0.18)",
                                color: "#ffffff",
                                fontWeight: "800"
                            }}
                        >
                            {admin
                                ? "A"
                                : (
                                    user?.name
                                        ?.charAt(0)
                                        ?.toUpperCase() || "C"
                                )}
                        </span>

                        <span>
                            {admin
                                ? "Admin"
                                : user?.name || "Citizen"}
                        </span>

                    </div>


                    {/* LOGOUT */}
                    <button
                        type="button"
                        onClick={onLogout}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "7px",
                            padding: "9px 16px",
                            minWidth: "90px",
                            height: "40px",
                            border: "1px solid rgba(255,255,255,0.4)",
                            borderRadius: "8px",
                            background: "#ffffff",
                            color: "#4f46e5",
                            fontSize: "13px",
                            fontWeight: "800",
                            cursor: "pointer",
                            visibility: "visible",
                            opacity: 1,
                            position: "relative",
                            zIndex: 100
                        }}
                    >
                        <Icon n="out" />
                        Logout
                    </button>

                </div>

            </header>


            {/* SIDEBAR */}
            <nav className="side" aria-label="Main">

                {items.map(([key, label, icon]) => (
                    <button
                        key={key}
                        className={
                            page === key ||
                                (group[key] || []).includes(page)
                                ? "on"
                                : ""
                        }
                        onClick={() => go(key)}
                    >
                        <Icon n={icon} />
                        <span>{label}</span>
                    </button>
                ))}


                {/* SIDEBAR LOGOUT */}
                <button
                    className="out"
                    onClick={onLogout}
                >
                    <Icon n="out" />
                    <span>Logout</span>
                </button>

            </nav>


            {/* CONTENT */}
            <main className="main">
                {children}
            </main>

        </div>
    );
}