
import { useState } from "react";
import { registerUser } from "../api";

export default function Register({ go }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // -----------------------------
        // Validate name
        // -----------------------------
        if (!name.trim()) {
            setError("Please enter your full name.");
            return;
        }

        // -----------------------------
        // Validate email
        // -----------------------------
        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        // -----------------------------
        // Validate password
        // -----------------------------
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        // -----------------------------
        // Confirm password
        // -----------------------------
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            // Public registration is ALWAYS Citizen
            const result = await registerUser(
                name.trim(),
                email.trim().toLowerCase(),
                password,
                "citizen"
            );

            // -----------------------------
            // Backend error
            // -----------------------------
            if (!result.success) {
                setError(
                    result.error ||
                    "Registration failed. Please try again."
                );
                return;
            }

            // -----------------------------
            // Registration successful
            // -----------------------------
            setSuccess(
                "Registration successful! Redirecting to Citizen Login..."
            );

            // Go to Citizen Login
            setTimeout(() => {
                go("citizenLogin");
            }, 1200);

        } catch (err) {
            console.error("Registration error:", err);

            setError(
                "Could not connect to the backend. Make sure the backend is running."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card register-card">

                {/* Icon */}
                <div className="auth-icon">
                    ✦
                </div>

                {/* Heading */}
                <h1>Create Citizen Account</h1>

                <p>
                    Register to report and track civic issues
                    using CivicMind AI.
                </p>

                <form onSubmit={handleRegister}>

                    {/* Full Name */}
                    <label>
                        Full Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        required
                        disabled={loading}
                    />

                    {/* Email */}
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
                        disabled={loading}
                    />

                    {/* Password */}
                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        minLength={6}
                        required
                        disabled={loading}
                    />

                    {/* Confirm Password */}
                    <label>
                        Confirm Password
                    </label>

                    <input
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        minLength={6}
                        required
                        disabled={loading}
                    />

                    {/* Error */}
                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="auth-success">
                            {success}
                        </div>
                    )}

                    {/* Register Button */}
                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Citizen Account"}
                    </button>

                </form>

                {/* Back to Login */}
                <button
                    type="button"
                    className="auth-back"
                    onClick={() => go("login")}
                    disabled={loading}
                >
                    ← Back to Login
                </button>

            </div>

        </div>
    );
}

