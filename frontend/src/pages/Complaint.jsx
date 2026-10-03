import { useEffect, useState } from "react";
import LocationPicker from "../LocationPicker";
import {
    generateComplaint,
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
    const [busy, setBusy] = useState(!complaint);
    const [sub, setSub] = useState(false);
    const [err, setErr] = useState("");

    useEffect(() => {
        if (complaint || !a) return;

        generateComplaint(a)
            .then((r) => {
                if (r.error) throw new Error(r.error);

                setComplaint({
                    title: r.title,
                    description: r.description
                });
            })
            .catch((e) =>
                setErr(
                    e.message ||
                    "Could not generate the complaint."
                )
            )
            .finally(() => setBusy(false));
    }, []); // eslint-disable-line

    const submit = async () => {
        setSub(true);
        setErr("");

        try {
            /*
             * STEP 1:
             * Upload the original image to the backend.
             */
            let imagePath = null;

            if (file) {
                const imageResult = await uploadReportImage(file);

                if (!imageResult.success) {
                    throw new Error(
                        imageResult.error ||
                        "Could not upload the report image."
                    );
                }

                imagePath = imageResult.image_path;
            }

            /*
             * STEP 2:
             * Submit the complete report including image_path.
             */
            const r = await submitReport({
                ...complaint,
                issue: a.issue,
                category: a.category,
                severity: a.severity,
                latitude: location?.[0] ?? null,
                longitude: location?.[1] ?? null,
                image_path: imagePath
            });

            if (!r.success) {
                throw new Error(
                    r.error || "Submission failed."
                );
            }

            /*
             * STEP 3:
             * Send the saved report back to App.jsx.
             */
            setReport(r.report);

            /*
             * STEP 4:
             * Show success page.
             */
            go("success");

        } catch (e) {
            setErr(
                e.message ||
                "Something went wrong while submitting the report."
            );
        }

        setSub(false);
    };

    if (busy) {
        return (
            <div className="panel">
                <p className="sub">
                    <span
                        className="spin"
                        style={{
                            borderColor: "#2563eb55",
                            borderTopColor: "#2563eb"
                        }}
                    />
                    Writing your complaint…
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
                AI has created a detailed complaint based on
                the analysis. Please review it and make any
                changes if needed.
            </p>

            <div className="card form">

                {complaint && (
                    <>
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
                    </>
                )}

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
                        onClick={() => setEdit(!edit)}
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