import Icon from "../components/Icon";

export default function Profile({ user, go }) {
    return (
        <div className="panel" style={{ maxWidth: 700 }}>
            <div className="row-h">
                <div>
                    <h1 className="pt">My Profile</h1>
                    <p className="sub">
                        View your CivicMind AI account details.
                    </p>
                </div>
            </div>

            <div className="card profile-card">
                <div className="profile-top">
                    <div className="profile-avatar">
                        <Icon n="user" />
                    </div>

                    <div>
                        <h2>{user?.name || "Citizen"}</h2>
                        <p>Citizen Account</p>
                    </div>
                </div>

                <div className="profile-info">
                    <div className="profile-item">
                        <span className="profile-label">Full Name</span>
                        <strong>{user?.name || "Not available"}</strong>
                    </div>

                    <div className="profile-item">
                        <span className="profile-label">Email Address</span>
                        <strong>{user?.email || "Not available"}</strong>
                    </div>

                    <div className="profile-item">
                        <span className="profile-label">Account Role</span>
                        <strong>Citizen</strong>
                    </div>
                </div>

                <button
                    className="btn"
                    style={{ marginTop: 24 }}
                    onClick={() => go("home")}
                >
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    );
}