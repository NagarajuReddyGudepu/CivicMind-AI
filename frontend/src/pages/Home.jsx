import { useState } from "react";
import Icon from "../components/Icon";

const F = [
    ["spark", "AI Powered Analysis"],
    ["bolt", "Quick & Easy Reporting"],
    ["clock", "Real-Time Tracking"],
    ["people", "Better Communities"]
];

export default function Home({ go, user }) {
    const [m, setM] = useState(false);

    // =====================================================
    // CITIZEN DASHBOARD
    // =====================================================
    if (user && user.role === "citizen") {
        return (
            <div className="hero">

                {/* Navigation */}
                <div className="nav">

                    <span className="logo">
                        <Icon n="pin" />
                        CivicMind AI
                    </span>

                    <nav>

                        <button onClick={() => go("home")}>
                            Dashboard
                        </button>

                        <button
                            onClick={() =>
                                go("report", "citizen")
                            }
                        >
                            Report Issue
                        </button>

                        <button
                            onClick={() =>
                                go("reports", "citizen")
                            }
                        >
                            My Reports
                        </button>

                        <button
                            onClick={() =>
                                go("profile", "citizen")
                            }
                        >
                            Profile
                        </button>

                        <button
                            className="btn"
                            onClick={() => go("home")}
                        >
                            Citizen
                        </button>

                    </nav>

                </div>

                {/* Dashboard Content */}
                <div className="hero-body">

                    <h1>
                        Welcome, {user.name || "Citizen"} 👋
                    </h1>

                    <p className="lead">
                        Your CivicMind AI Dashboard
                    </p>

                    <p className="s">
                        Report civic issues, track your complaints,
                        and help make your community better.
                    </p>

                    {/* Dashboard Actions */}
                    <div className="cta">

                        <button
                            className="btn"
                            onClick={() =>
                                go("report", "citizen")
                            }
                        >
                            <Icon n="plus" />
                            Report an Issue
                        </button>

                        <button
                            className="btn light"
                            onClick={() =>
                                go("reports", "citizen")
                            }
                        >
                            <Icon n="file" />
                            My Reports
                        </button>

                    </div>

                </div>

                {/* Citizen Features */}
                <div className="feat">

                    <div>
                        <Icon n="spark" s={1.6} />
                        AI Issue Analysis
                    </div>

                    <div>
                        <Icon n="plus" s={1.6} />
                        Easy Reporting
                    </div>

                    <div>
                        <Icon n="clock" s={1.6} />
                        Track Your Reports
                    </div>

                    <div>
                        <Icon n="people" s={1.6} />
                        Better Communities
                    </div>

                </div>

            </div>
        );
    }

    // =====================================================
    // PUBLIC HOME PAGE
    // =====================================================

    return (
        <div className="hero">

            {/* Navigation */}
            <div className="nav">

                <span className="logo">
                    <Icon n="pin" />
                    CivicMind AI
                </span>

                <nav>

                    <button
                        onClick={() =>
                            go("home")
                        }
                    >
                        Home
                    </button>

                    {/* Public Report Issue → Login Selection */}
                    <button
                        onClick={() => go("login")}
                    >
                        Report Issue
                    </button>

                    {/* Public Track Report → Login Selection */}
                    <button
                        onClick={() => go("login")}
                    >
                        Track Report
                    </button>

                    <button
                        onClick={() =>
                            go("about")
                        }
                    >
                        About
                    </button>

                    <span className="lg">

                        <button
                            onClick={() =>
                                setM(!m)
                            }
                        >
                            Login
                        </button>

                        {m && (
                            <div className="menu">

                                <button
                                    onClick={() =>
                                        go("login")
                                    }
                                >
                                    Login as Citizen
                                </button>

                                <button
                                    onClick={() =>
                                        go("adminLogin")
                                    }
                                >
                                    Login as Admin
                                </button>

                            </div>
                        )}

                    </span>

                </nav>

            </div>

            {/* Hero */}
            <div className="hero-body">

                <h1>
                    Smarter Communities Through AI
                </h1>

                <p className="lead">
                    See a problem. Report it. Make a difference.
                </p>

                <p className="s">
                    CivicMind AI helps citizens report civic
                    issues using the power of artificial
                    intelligence.
                </p>

                <div className="cta">

                    {/* Report Issue → Login Selection */}
                    <button
                        className="btn"
                        onClick={() => go("login")}
                    >
                        Report an Issue
                    </button>

                    {/* Track Report → Login Selection */}
                    <button
                        className="btn light"
                        onClick={() => go("login")}
                    >
                        Track a Report
                    </button>

                </div>

            </div>

            {/* Features */}
            <div className="feat">

                {F.map(([i, t]) => (
                    <div key={t}>
                        <Icon
                            n={i}
                            s={1.6}
                        />
                        {t}
                    </div>
                ))}

            </div>

        </div>
    );
}