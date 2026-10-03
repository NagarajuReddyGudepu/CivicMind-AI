import { useState } from "react";
import { loginUser } from "../api";

export default function CitizenLogin({ go, onLogin }) {
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
                email,
                password,
                "citizen"
            );

            if (!result.success) {
                setError(result.error || "Login failed.");
                return;
            }

            localStorage.setItem(
                "civicmind_token",
                result.access_token
            );

            localStorage.setItem(
                "civicmind_user",
                JSON.stringify(result.user)
            );

            onLogin(result.user);
        } catch (err) {
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

                <div className="auth-icon">
                    👤
                </div>

                <h1>Citizen Login</h1>

                <p>
                    Login to report and track civic issues
                </p>

                <form onSubmit={handleLogin}>

                    <label>
                        Email Address
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login as Citizen"}
                    </button>

                </form>

                <button
                    className="auth-back"
                    onClick={() => go("login")}
                >
                    ← Back to Login Options
                </button>

            </div>
        </div>
    );
}