import Icon from "../components/Icon";

export default function About({ go }) {
    return (
        <div className="panel wide about-page">

            {/* Hero */}
            <section className="about-hero">

                <div className="about-icon">
                    <Icon n="pin" />
                </div>

                <div className="about-hero-text">
                    <span className="about-kicker">
                        ABOUT CIVICMIND AI
                    </span>

                    <h1 className="pt">
                        Building Smarter
                        <span> Communities with AI</span>
                    </h1>

                    <p className="sub">
                        CivicMind AI combines artificial intelligence,
                        citizen participation and smart technology to
                        make civic issue reporting faster and easier.
                    </p>
                </div>

            </section>


            {/* Introduction */}
            <section className="card about-section about-intro">

                <div className="section-heading">
                    <span className="section-number">01</span>

                    <div>
                        <h2>What is CivicMind AI?</h2>
                        <p className="section-caption">
                            Turning everyday civic problems into actionable reports.
                        </p>
                    </div>
                </div>

                <p>
                    CivicMind AI is an intelligent civic issue reporting
                    platform that helps citizens report problems in their
                    local communities quickly and easily.
                </p>

                <p>
                    Citizens can upload a photo of a civic issue such as
                    potholes, damaged roads, garbage or drainage problems.
                    Artificial intelligence analyzes the uploaded image
                    and helps identify the issue.
                </p>

                <p>
                    The report can then include its location and be submitted
                    for further action. Citizens can also track the progress
                    of their reports through the platform.
                </p>

            </section>


            {/* How It Works */}
            <section className="card about-section">

                <div className="section-heading">
                    <span className="section-number">02</span>

                    <div>
                        <h2>How CivicMind AI Works</h2>
                        <p className="section-caption">
                            A simple journey from identifying a problem to tracking its progress.
                        </p>
                    </div>
                </div>

                <div className="about-steps">

                    <div className="about-step">
                        <div className="about-step-icon">
                            <Icon n="plus" />
                        </div>

                        <div>
                            <h3>Report an Issue</h3>
                            <p>
                                Upload a photo and provide the necessary
                                information about the civic problem.
                            </p>
                        </div>
                    </div>


                    <div className="about-step">
                        <div className="about-step-icon">
                            <Icon n="spark" />
                        </div>

                        <div>
                            <h3>AI Analysis</h3>
                            <p>
                                AI analyzes the uploaded image and helps
                                identify the type and severity of the issue.
                            </p>
                        </div>
                    </div>


                    <div className="about-step">
                        <div className="about-step-icon">
                            <Icon n="map" />
                        </div>

                        <div>
                            <h3>Add Location</h3>
                            <p>
                                Add the location of the issue to help
                                identify where the problem exists.
                            </p>
                        </div>
                    </div>


                    <div className="about-step">
                        <div className="about-step-icon">
                            <Icon n="clock" />
                        </div>

                        <div>
                            <h3>Track the Report</h3>
                            <p>
                                Monitor the status of your submitted report
                                until the issue is resolved.
                            </p>
                        </div>
                    </div>

                </div>

            </section>


            {/* Features */}
            <section className="card about-section">

                <div className="section-heading">
                    <span className="section-number">03</span>

                    <div>
                        <h2>Key Features</h2>
                        <p className="section-caption">
                            Designed to make civic reporting smarter and more accessible.
                        </p>
                    </div>
                </div>

                <div className="about-features">

                    <div className="about-feature">
                        <Icon n="spark" />

                        <div>
                            <h3>AI-Powered Analysis</h3>
                            <p>
                                Automatically analyzes uploaded images
                                to identify civic issues.
                            </p>
                        </div>
                    </div>


                    <div className="about-feature">
                        <Icon n="plus" />

                        <div>
                            <h3>Easy Reporting</h3>
                            <p>
                                A simple interface makes reporting civic
                                problems quick and convenient.
                            </p>
                        </div>
                    </div>


                    <div className="about-feature">
                        <Icon n="map" />

                        <div>
                            <h3>Location-Based Reports</h3>
                            <p>
                                Reports can include geographical location
                                for better issue management.
                            </p>
                        </div>
                    </div>


                    <div className="about-feature">
                        <Icon n="clock" />

                        <div>
                            <h3>Real-Time Tracking</h3>
                            <p>
                                Citizens can monitor the current status
                                of their submitted reports.
                            </p>
                        </div>
                    </div>


                    <div className="about-feature">
                        <Icon n="admin" />

                        <div>
                            <h3>Admin Management</h3>
                            <p>
                                Administrators can review reports and
                                update their status.
                            </p>
                        </div>
                    </div>


                    <div className="about-feature">
                        <Icon n="people" />

                        <div>
                            <h3>Community Impact</h3>
                            <p>
                                Helps citizens and administrators work
                                together to improve public spaces.
                            </p>
                        </div>
                    </div>

                </div>

            </section>


            {/* Technology */}
            <section className="card about-section">

                <div className="section-heading">
                    <span className="section-number">04</span>

                    <div>
                        <h2>Technology Behind CivicMind AI</h2>
                        <p className="section-caption">
                            Modern technologies working together to power the platform.
                        </p>
                    </div>
                </div>

                <div className="tech-list">

                    <span>React</span>
                    <span>FastAPI</span>
                    <span>PostgreSQL</span>
                    <span>Google Gemini AI</span>
                    <span>Python</span>
                    <span>JavaScript</span>
                    <span>OpenStreetMap</span>

                </div>

            </section>


            {/* Mission */}
            <section className="about-mission">

                {/* Small icon */}
                <div className="mission-icon">
                    <Icon n="people" />
                </div>

                <span className="mission-label">
                    OUR MISSION
                </span>

                <h2>
                    Technology for Better Communities
                </h2>

                <p>
                    Our mission is to make civic issue reporting simple,
                    intelligent and accessible while helping communities
                    work together toward cleaner, safer and better
                    public spaces.
                </p>

            </section>


            {/* Back */}
            {go && (
                <button
                    className="btn about-back"
                    onClick={() => go("home")}
                >
                    ← Back to Home
                </button>
            )}

        </div>
    );
}