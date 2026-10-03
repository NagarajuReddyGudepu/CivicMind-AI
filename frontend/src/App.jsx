import { useState, useEffect, useCallback } from "react";

import Shell from "./components/Shell";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";
import Analysis from "./pages/Analysis";
import Complaint from "./pages/Complaint";
import Success from "./pages/Success";
import MyReports from "./pages/MyReports";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CitizenLogin from "./pages/CitizenLogin";
import AdminLogin from "./pages/AdminLogin";
import Detail from "./pages/Detail";
import Resolved from "./pages/Resolved";
import MapView from "./pages/MapView";
import Users from "./pages/Users";
import About from "./pages/About";

import { getReports } from "./api";


/* =====================================================
   PAGES THAT REQUIRE REPORT LIST DATA
   ===================================================== */

const LISTS = [
    "reports",
    "admin",
    "adminReports",
    "map"
];


/* =====================================================
   CITIZEN PAGES
   ===================================================== */

const CITIZEN_PAGES = [
    "dashboard",
    "report",
    "analysis",
    "complaint",
    "reports",
    "resolved",
    "profile"
];


/* =====================================================
   ADMIN PAGES
   ===================================================== */

const ADMIN_PAGES = [
    "admin",
    "adminReports",
    "map",
    "users",
    "settings"
];


/* =====================================================
   SHARED PAGES
   ===================================================== */

const SHARED_PAGES = [
    "detail"
];


export default function App() {

    /* =================================================
       USER
       ================================================= */

    const [user, setUser] = useState(() => {

        const savedUser =
            localStorage.getItem("civicmind_user");

        if (savedUser) {

            try {
                return JSON.parse(savedUser);
            } catch {
                return null;
            }

        }

        return null;
    });


    /* =================================================
       ROLE
       ================================================= */

    const [role, setRole] = useState(() => {

        const savedUser =
            localStorage.getItem("civicmind_user");

        if (savedUser) {

            try {
                return (
                    JSON.parse(savedUser).role ||
                    "citizen"
                );
            } catch {
                return "citizen";
            }

        }

        return "citizen";
    });


    /* =================================================
       CURRENT PAGE
       ================================================= */

    const [page, setPage] = useState(() => {

        const savedUser =
            localStorage.getItem("civicmind_user");

        if (savedUser) {

            try {

                const loggedUser =
                    JSON.parse(savedUser);

                /*
                 * IMPORTANT:
                 * Citizen opens Dashboard first.
                 * Admin opens Admin Dashboard.
                 */

                return loggedUser.role === "admin"
                    ? "admin"
                    : "dashboard";

            } catch {

                return "home";

            }

        }

        return "home";
    });


    /* =================================================
       REPORT / AI STATES
       ================================================= */

    const [file, setFile] = useState(null);

    const [preview, setPreview] = useState(null);

    const [analysis, setAnalysis] = useState(null);

    const [complaint, setComplaint] = useState(null);

    const [location, setLocation] = useState(null);

    const [report, setReport] = useState(null);

    const [reports, setReports] = useState([]);


    /* =================================================
       UI STATES
       ================================================= */

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [sel, setSel] = useState(null);

    const [imgs, setImgs] = useState({});


    /* =================================================
       NAVIGATION
       ================================================= */

    const go = (p, r) => {

        if (r) {
            setRole(r);
        }

        window.scrollTo(0, 0);

        setPage(p);
    };


    /* =================================================
       LOGIN
       ================================================= */

    const handleLogin = (loggedUser) => {

        setUser(loggedUser);

        setRole(loggedUser.role);

        localStorage.setItem(
            "civicmind_user",
            JSON.stringify(loggedUser)
        );


        /*
         * ADMIN
         * → Admin Dashboard
         *
         * CITIZEN
         * → Citizen Dashboard
         */

        if (loggedUser.role === "admin") {

            setPage("admin");

        } else {

            setPage("dashboard");

        }

        window.scrollTo(0, 0);
    };


    /* =================================================
       LOGOUT
       ================================================= */

    const handleLogout = () => {

        localStorage.removeItem(
            "civicmind_token"
        );

        localStorage.removeItem(
            "civicmind_user"
        );

        setUser(null);

        setRole("citizen");

        setPage("home");

        window.scrollTo(0, 0);
    };


    /* =================================================
       LOAD REPORTS
       ================================================= */

    const load = useCallback(() => {

        setLoading(true);

        setError("");

        getReports()

            .then((d) => {

                if (!d.success) {
                    throw new Error(d.error);
                }

                setReports(d.reports);

            })

            .catch(() => {

                setError(
                    "Could not load reports. Check that the backend is running."
                );

            })

            .finally(() => {

                setLoading(false);

            });

    }, []);


    /* =================================================
       LOAD REPORTS WHEN REQUIRED
       ================================================= */

    useEffect(() => {

        if (LISTS.includes(page)) {

            load();

        }

    }, [page, load]);


    /* =================================================
       ANALYSIS / COMPLAINT PROTECTION
       ================================================= */

    useEffect(() => {

        if (
            (page === "analysis" ||
                page === "complaint") &&
            !analysis
        ) {

            setPage("report");

        }

    }, [page, analysis]);


    /* =================================================
       AUTHORIZATION / PAGE PROTECTION
       ================================================= */

    useEffect(() => {

        /*
         * User is NOT logged in
         * but tries to access protected pages
         */

        if (
            !user &&
            (
                CITIZEN_PAGES.includes(page) ||
                ADMIN_PAGES.includes(page) ||
                SHARED_PAGES.includes(page)
            )
        ) {

            setPage("login");

            return;
        }


        /*
         * Citizen tries to access Admin page
         *
         * Send citizen to Dashboard,
         * NOT Home.
         */

        if (
            user &&
            role === "citizen" &&
            ADMIN_PAGES.includes(page)
        ) {

            setPage("dashboard");

            return;
        }


        /*
         * Admin tries to access Citizen page
         *
         * Send admin to Admin Dashboard.
         */

        if (
            user &&
            role === "admin" &&
            CITIZEN_PAGES.includes(page)
        ) {

            setPage("admin");

            return;
        }

    }, [page, user, role]);


    /* =================================================
       SET IMAGE
       ================================================= */

    const setImage = (f) => {

        setFile(f);

        setAnalysis(null);

        setComplaint(null);

        setLocation(null);


        setPreview((p) => {

            if (p) {
                URL.revokeObjectURL(p);
            }

            return URL.createObjectURL(f);

        });

    };


    /* =================================================
       REPORT SUBMITTED
       ================================================= */

    const onSubmitted = (r) => {

        setReport(r);

        setImgs((m) => ({
            ...m,
            [r.report_id]: preview
        }));

        setFile(null);

        setPreview(null);

        setAnalysis(null);

        setComplaint(null);

        setLocation(null);

    };


    /* =================================================
       OPEN REPORT
       ================================================= */

    const open = (r) => {

        setSel(r);


        /*
         * Citizen + resolved report
         * → Resolved page
         *
         * Admin or active report
         * → Detail page
         */

        go(
            r.status === "Resolved" &&
                role !== "admin"
                ? "resolved"
                : "detail"
        );

    };


    /* =================================================
       REPORT UPDATED BY ADMIN
       ================================================= */

    const onUpdated = (r) => {

        setSel(r);

        setReports((list) =>
            list.map((x) =>
                x.report_id === r.report_id
                    ? r
                    : x
            )
        );

    };


    /* =================================================
       ADMIN CHECK
       ================================================= */

    const admin = role === "admin";


    /* =================================================
       HOME PAGE
       =================================================

       IMPORTANT:

       HOME and DASHBOARD are separate pages.

       Home:
       - Public Home page
       - Logged-in citizen can also visit it
       - Top-right Citizen controls remain there

       Dashboard:
       - Separate citizen dashboard
       - First page after citizen login
       ================================================= */

    if (page === "home") {

        return (
            <Home
                go={go}
                user={user}
            />
        );

    }


    /* =================================================
       SUCCESS PAGE
       ================================================= */

    if (page === "success") {

        return report
            ? (
                <Success
                    r={report}
                    go={go}
                />
            )
            : null;

    }


    /* =================================================
       RESOLVED PAGE
       ================================================= */

    if (page === "resolved") {

        return sel
            ? (
                <Resolved
                    r={sel}
                    admin={admin}
                    go={go}
                />
            )
            : null;

    }


    /* =================================================
       MAIN APPLICATION SHELL
       ================================================= */

    return (

        <Shell
            page={page}
            go={go}
            role={role}
            user={user}
            onLogout={handleLogout}
        >


            {/* =========================================
                CITIZEN DASHBOARD
            ========================================= */}

            {page === "dashboard" && (

                <Dashboard
                    user={user}
                    go={go}
                />

            )}


            {/* =========================================
                LOGIN SELECTION
            ========================================= */}

            {page === "login" && (

                <Login
                    go={go}
                />

            )}


            {/* =========================================
                REGISTER
            ========================================= */}

            {page === "register" && (

                <Register
                    go={go}
                />

            )}


            {/* =========================================
                CITIZEN LOGIN
            ========================================= */}

            {page === "citizenLogin" && (

                <CitizenLogin
                    go={go}
                    onLogin={handleLogin}
                />

            )}


            {/* =========================================
                ADMIN LOGIN
            ========================================= */}

            {page === "adminLogin" && (

                <AdminLogin
                    go={go}
                    onLogin={handleLogin}
                />

            )}


            {/* =========================================
                ABOUT
            ========================================= */}

            {page === "about" && (

                <About
                    go={go}
                />

            )}


            {/* =========================================
                REPORT ISSUE
            ========================================= */}

            {page === "report" && (

                <Upload
                    file={file}
                    preview={preview}
                    setImage={setImage}
                    setAnalysis={setAnalysis}
                    go={go}
                />

            )}


            {/* =========================================
                AI ANALYSIS
            ========================================= */}

            {page === "analysis" && (

                <Analysis
                    a={analysis}
                    preview={preview}
                    go={go}
                />

            )}


            {/* =========================================
    COMPLAINT
========================================= */}

            {page === "complaint" && (

                <Complaint
                    a={analysis}
                    complaint={complaint}
                    setComplaint={setComplaint}
                    location={location}
                    setLocation={setLocation}
                    setReport={onSubmitted}
                    file={file}
                    go={go}
                />

            )}


            {/* =========================================
                CITIZEN MY REPORTS
            ========================================= */}

            {page === "reports" && (

                <MyReports
                    reports={reports}
                    loading={loading}
                    error={error}
                    open={open}
                    go={go}
                />

            )}


            {/* =========================================
                ADMIN DASHBOARD
            ========================================= */}

            {page === "admin" && (

                <Admin
                    reports={reports}
                    loading={loading}
                    error={error}
                    open={open}
                />

            )}


            {/* =========================================
                ADMIN REPORTS
            ========================================= */}

            {page === "adminReports" && (

                <Admin
                    full
                    reports={reports}
                    loading={loading}
                    error={error}
                    open={open}
                />

            )}


            {/* =========================================
                REPORT DETAIL
            ========================================= */}

            {page === "detail" && (

                <Detail
                    key={sel?.report_id}
                    r={sel}
                    admin={admin}
                    img={imgs[sel?.report_id]}
                    onUpdated={onUpdated}
                    go={go}
                />

            )}


            {/* =========================================
                MAP VIEW
            ========================================= */}

            {page === "map" && (

                <MapView
                    reports={reports}
                    open={open}
                />

            )}


            {/* =========================================
                PROFILE
            ========================================= */}

            {page === "profile" && (

                <Profile
                    user={user}
                    go={go}
                />

            )}


            {/* =========================================
                USERS
            ========================================= */}

            {page === "users" && (

                <Users
                    currentUser={user}
                />

            )}


            {/* =========================================
                SETTINGS
            ========================================= */}

            {page === "settings" && (

                <Settings />

            )}

        </Shell>

    );
}