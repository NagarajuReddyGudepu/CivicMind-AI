
import { useState } from "react";
import LocationPicker from "../LocationPicker";
import {
    submitReport,
    uploadReportImage
} from "../api";

export default function Complaint({
    a,
    complaint,
    setComplaint,
    location,
    setLocation,
    setReport,
    file,
    go
}) {
    const [edit, setEdit] = useState(false);
    const [sub, setSub] = useState(false);
    const [err, setErr] = useState("");

    /*
     * Generate the complaint instantly from the AI analysis.
     * No second Gemini API call is required.
     */
    const createComplaint = () => {
        if (!a) {
            return {
                title: "Civic Issue Report",
                description:
                    "A civic issue has been identified and requires attention."
            };
        }

        const issue = a.issue || "Civic issue";
        const category = a.category || "Other";
        const severity = a.severity || "Medium";

        let action = "Please inspect and take the necessary action to resolve this issue.";

        if (category === "Road / Infrastructure") {
            action =
                "Please inspect and repair the affected road or infrastructure to ensure public safety.";
        } else if (category === "Garbage / Waste") {
            action =
                "Please arrange for the waste to be collected and the affected area to be cleaned.";
        } else if (category === "Streetlight") {
            action =
                "Please inspect and repair the streetlight or electrical infrastructure.";
        } else if (category === "Water Leakage") {
            action =
                "Please inspect the affected water pipeline and repair the leakage.";
        } else if (category === "Public Infrastructure") {
            action =
                "Please inspect and repair the damaged public infrastructure.";
        } else if (category === "Fallen Tree") {
            action =
                "Please arrange for the fallen tree to be safely removed and restore normal public access.";
        } else if (category === "Drainage") {
            action =
                "Please inspect and clear the affected drainage system to prevent further problems.";
        }

        return {
            title: `${ issue.charAt(0).toUpperCase() }${ issue.slice(1) } `,
            description:
                `A ${ category.toLowerCase() } issue has been identified: ${ issue }.` +
                `The reported severity is ${ severity }.` +
                `${ action } `
        };
    };

    /*
     * Generate complaint immediately.
     */
    if (!complaint && a) {
        const generated = createComplaint();

        setComplaint(generated);
    }

    const submit = async () => {
        setSub(true);
        setErr("");

        try {
            /*
             * STEP 1:
             * Upload the original image.
             */
            let imagePath = null;

            if (file) {
                const imageResult =
                    await uploadReportImage(file);

                if (!imageResult.success) {
                    throw new Error(
                        imageResult.error ||
                        "Could not upload the report image."
                    );
                }

                imagePath =
                    imageResult.image_path;
            }

            /*
             * STEP 2:
             * Submit the complete report.
             */
            const r = await submitReport({
                ...complaint,
                issue: a.issue,
                category: a.category,
                severity: a.severity,
                latitude:
                    location?.[0] ?? null,
                longitude:
                    location?.[1] ?? null,
                image_path: imagePath
            });

            if (!r.success) {
                throw new Error(
                    r.error ||
                    "Submission failed."
                );
            }

            setReport(r.report);

            go("success");

        } catch (e) {
            setErr(
                e.message ||
                "Something went wrong while submitting the report."
            );
        } finally {
            setSub(false);
        }
    };

    if (!complaint) {
        return (
            <div className="panel">
                <p className="sub">
                    Preparing your complaint…
                </p>
            </div>
        );
    }

    return (
        <div className="panel">

            <h1 className="pt">
                Generated Complaint
            </h1>

            <p className="sub">
                AI has analyzed the issue and prepared
                a complaint. Please review it and make
                any changes if needed.
            </p>

            <div className="card form">

                <label
                    htmlFor="t"
                    style={{ marginTop: 0 }}
                >
                    Title
                </label>

                <input
                    id="t"
                    disabled={!edit}
                    value={complaint.title}
                    onChange={(e) =>
                        setComplaint({
                            ...complaint,
                            title: e.target.value
                        })
                    }
                />

                <label htmlFor="d">
                    Description
                </label>

                <textarea
                    id="d"
                    disabled={!edit}
                    value={complaint.description}
                    onChange={(e) =>
                        setComplaint({
                            ...complaint,
                            description: e.target.value
                        })
                    }
                />

                <div className="meta">

                    <div>
                        <span>Issue</span>
                        <b>{a.issue}</b>
                    </div>

                    <div>
                        <span>Category</span>
                        <b>{a.category}</b>
                    </div>

                    <div>
                        <span>Severity</span>
                        <b className={a.severity}>
                            {a.severity}
                        </b>
                    </div>

                </div>

                <LocationPicker
                    selectedLocation={location}
                    setSelectedLocation={setLocation}
                />

                {err && (
                    <p
                        className="err"
                        role="alert"
                    >
                        {err}
                    </p>
                )}

                <div className="actions">

                    <button
                        className="btn ghost"
                        onClick={() =>
                            setEdit(!edit)
                        }
                        disabled={sub}
                    >
                        {edit ? "Done" : "Edit"}
                    </button>

                    <button
                        className="btn"
                        disabled={!complaint || sub}
                        onClick={submit}
                    >
                        {sub ? (
                            <>
                                <span className="spin" />
                                {file
                                    ? "Uploading & Submitting…"
                                    : "Submitting…"}
                            </>
                        ) : (
                            "Submit Report"
                        )}
                    </button>

                </div>

            </div>
        </div>
    );
}

