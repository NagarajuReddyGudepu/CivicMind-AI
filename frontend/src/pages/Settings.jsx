export default function Settings() {
    return (
        <div className="panel wide">
            <h1 className="pt">System Settings</h1>

            <p className="sub">
                View CivicMind AI system configuration.
            </p>

            <div className="card settings-card">

                <div className="setting-row">
                    <strong>Application Name</strong>
                    <p>CivicMind AI</p>
                </div>

                <div className="setting-row">
                    <strong>Account Type</strong>
                    <p>Administrator</p>
                </div>

                <div className="setting-row">
                    <strong>Authentication</strong>
                    <p>JWT Authentication Enabled</p>
                </div>

                <div className="setting-row">
                    <strong>AI Service</strong>
                    <p>Google Gemini AI</p>
                </div>

                <div className="setting-row">
                    <strong>Database</strong>
                    <p>PostgreSQL</p>
                </div>

                <div className="setting-row">
                    <strong>Map Service</strong>
                    <p>OpenStreetMap</p>
                </div>

            </div>
        </div>
    );
}