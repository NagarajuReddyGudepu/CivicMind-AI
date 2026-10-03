import Icon from "../components/Icon";

export default function Dashboard({ user, go }) {
    return (
        <div className="dashboard-page">

            {/* Dashboard Header */}
            <div className="dashboard-header">

                <div>
                    <span className="dashboard-kicker">
                        CITIZEN DASHBOARD
                    </span>

                    <h1>
                        Welcome, {user?.name || "Citizen"} 👋
                    </h1>

                    <p>
                        Manage your civic reports and help improve
                        your community.
                    </p>
                </div>

                <button
                    className="dashboard-home-btn"
                    onClick={() => go("home")}
                >
                    <Icon n="home" />
                    Home
                </button>

            </div>


            {/* Dashboard Cards */}
            <div className="dashboard-grid">

                {/* Report Issue */}
                <button
                    className="dashboard-card"
                    onClick={() => go("report", "citizen")}
                >
                    <div className="dashboard-card-icon">
                        <Icon n="plus" />
                    </div>

                    <div>
                        <h2>Report an Issue</h2>

                        <p>
                            Report potholes, garbage, drainage
                            problems and other civic issues.
                        </p>
                    </div>

                    <span className="dashboard-arrow">
                        →
                    </span>
                </button>


                {/* My Reports */}
                <button
                    className="dashboard-card"
                    onClick={() => go("reports", "citizen")}
                >
                    <div className="dashboard-card-icon">
                        <Icon n="file" />
                    </div>

                    <div>
                        <h2>My Reports</h2>

                        <p>
                            View and track the status of your
                            submitted civic reports.
                        </p>
                    </div>

                    <span className="dashboard-arrow">
                        →
                    </span>
                </button>


                {/* Profile */}
                <button
                    className="dashboard-card"
                    onClick={() => go("profile", "citizen")}
                >
                    <div className="dashboard-card-icon">
                        <Icon n="user" />
                    </div>

                    <div>
                        <h2>My Profile</h2>

                        <p>
                            View your account information and
                            citizen profile.
                        </p>
                    </div>

                    <span className="dashboard-arrow">
                        →
                    </span>
                </button>


                {/* About */}
                <button
                    className="dashboard-card"
                    onClick={() => go("about")}
                >
                    <div className="dashboard-card-icon">
                        <Icon n="spark" />
                    </div>

                    <div>
                        <h2>About CivicMind AI</h2>

                        <p>
                            Learn how CivicMind AI uses technology
                            to improve civic reporting.
                        </p>
                    </div>

                    <span className="dashboard-arrow">
                        →
                    </span>
                </button>

            </div>


            {/* Bottom Information */}
            <div className="dashboard-info">

                <div className="dashboard-info-icon">
                    <Icon n="people" />
                </div>

                <div>
                    <h3>
                        Make Your Community Better
                    </h3>

                    <p>
                        Every report helps identify civic problems
                        and supports better public services.
                    </p>
                </div>

            </div>

        </div>
    );
}