export default function Login({ go }) {
    return (
        <div className="login-page">

            <div className="login-container">

                {/* Header */}
                <div className="login-header">
                    <div className="login-logo">
                        <span>✦</span>
                    </div>

                    <h1>Welcome to CivicMind AI</h1>

                    <p>
                        Choose how you want to access the CivicMind AI platform
                    </p>
                </div>

                {/* Login Options */}
                <div className="login-options">

                    {/* Citizen */}
                    <button
                        className="login-card citizen-card"
                        onClick={() => go("citizenLogin")}
                    >
                        <div className="login-card-icon citizen-icon">
                            👤
                        </div>

                        <div className="login-card-content">
                            <h2>Login as Citizen</h2>

                            <p>
                                Report civic issues, track your complaints,
                                and stay updated on their status.
                            </p>

                            <span className="login-card-action">
                                Continue as Citizen →
                            </span>
                        </div>
                    </button>

                    {/* Admin */}
                    <button
                        className="login-card admin-card"
                        onClick={() => go("adminLogin")}
                    >
                        <div className="login-card-icon admin-icon">
                            🛡️
                        </div>

                        <div className="login-card-content">
                            <h2>Login as Admin</h2>

                            <p>
                                Manage civic reports, monitor issues,
                                and update complaint status.
                            </p>

                            <span className="login-card-action">
                                Continue as Admin →
                            </span>
                        </div>
                    </button>

                </div>

                {/* Back */}
                <button
                    className="login-back"
                    onClick={() => go("home")}
                >
                    ← Back to Home
                </button>
                <div className="register-link">
                    <span>Don't have an account?</span>

                    <button onClick={() => go("register")}>
                        Register
                    </button>
                </div>

            </div>

        </div>
    );
}