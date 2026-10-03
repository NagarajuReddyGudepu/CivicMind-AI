const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Get logged-in user's JWT token
const authHeaders = () => {
    const token = localStorage.getItem("civicmind_token");

    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};

// JSON request helper
const json = (method, body, protectedRoute = false) => ({
    method,
    headers: {
        "Content-Type": "application/json",
        ...(protectedRoute ? authHeaders() : {}),
    },
    body: JSON.stringify(body),
});

// Image analysis
export const analyzeImage = (file) => {
    const d = new FormData();
    d.append("file", file);

    return fetch(BASE + "/analyze-image", {
        method: "POST",
        body: d,
    }).then((r) => r.json());
};
export const uploadReportImage = (file) => {
    const d = new FormData();
    d.append("file", file);

    return fetch(BASE + "/upload-report-image", {
        method: "POST",
        headers: {
            ...authHeaders(),
        },
        body: d,
    }).then((r) => r.json());
};
// Generate complaint
export const generateComplaint = (a) =>
    fetch(BASE + "/generate-complaint", json("POST", a))
        .then((r) => r.json());

// Submit report - LOGIN REQUIRED
export const submitReport = (r) =>
    fetch(BASE + "/submit-report", json("POST", r, true))
        .then((r) => r.json());

// Get reports - LOGIN REQUIRED
export const getReports = () =>
    fetch(BASE + "/reports", {
        headers: {
            ...authHeaders(),
        },
    }).then((r) => r.json());

// Update report status - ADMIN REQUIRED
export const updateStatus = (id, status) =>
    fetch(`${BASE}/reports/${id}/status`, {
        ...json("PATCH", { status }, true),
    }).then((r) => r.json());


// Login
export async function loginUser(email, password, role) {
    const response = await fetch(BASE + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
            role,
        }),
    });

    return await response.json();
}


// Citizen registration
export async function registerUser(name, email, password, role) {
    const response = await fetch(BASE + "/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            email,
            password,
            role,
        }),
    });

    return await response.json();
}