import { useState } from "react";
import { loginUser } from "../api";

export default function AdminLogin({ go, onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const result = await loginUser(
                email.trim().toLowerCase(),
                password,
                "admin"
            );

            if (!result.success) {
                setError(
                    result.error || "Invalid admin email or password."
                );
                return;
            }

            // Store authentication details
            localStorage.setItem(
                "civicmind_token",
                result.access_token
            );

            localStorage.setItem(
                "civicmind_user",
                JSON.stringify(result.user)
            );

            // Send logged-in admin to App.jsx
            onLogin(result.user);

        } catch (err) {
            console.error("Admin login error:", err);

            setError(
                "Could not connect to the backend. Make sure the backend is running."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-icon admin-auth-icon">
                    🛡️
                </div>

                <h1>Admin Login</h1>

                <p>
                    Login to manage and resolve civic reports
                </p>

                <form onSubmit={handleLogin}>

                    <label>Admin Email</label>

                    <input
                        type="email"
                        placeholder="Enter admin email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-button admin-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login as Admin"}
                    </button>

                </form>

                <button
                    type="button"
                    className="auth-back"
                    onClick={() => go("login")}
                    disabled={loading}
                >
                    ← Back to Login Options
                </button>

            </div>
        </div>
    );
}