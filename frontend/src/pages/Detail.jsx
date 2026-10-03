import { useState } from "react";
import Icon from "../components/Icon";
import { Severity, Status } from "../components/Badge";
import { updateStatus } from "../api";
import { STATUSES, setResolved } from "../util";

const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Detail({
    r,
    admin,
    img,
    onUpdated,
    go
}) {
    const [val, setVal] = useState(r?.status);
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    if (!r) return null;

    const hasLoc =
        r.latitude != null &&
        r.longitude != null;

    /*
     * Use the temporary preview if available.
     * Otherwise use the permanent image saved by the backend.
     */
    const imageUrl = img
        ? img
        : r.image_path
            ? r.image_path.startsWith("http")
                ? r.image_path
                : `${API_BASE}${r.image_path}`
            : null;

    const save = async () => {
        setBusy(true);
        setErr("");
        setMsg("");

        try {
            const d = await updateStatus(
                r.report_id,
                val
            );

            if (!d.success) {
                throw new Error(
                    d.error || "Update failed."
                );
            }

            if (val === "Resolved") {
                setResolved(r.report_id);
            }

            onUpdated(d.report);

            if (val === "Resolved") {
                go("resolved");
            } else {
                setMsg(
                    "Status updated to " +
                    val +
                    "."
                );
            }

        } catch (e) {
            setErr(e.message);
        }

        setBusy(false);
    };

    return (
        <div
            className="panel"
            style={{ maxWidth: 640 }}
        >

            <button
                className="lnk back"
                onClick={() =>
                    go(
                        admin
                            ? "adminReports"
                            : "reports"
                    )
                }
            >
                ← Back to reports
            </button>

            <h1 className="pt">
                {admin
                    ? "Update Report Status"
                    : "Report Details"}
            </h1>

            <div className="card detail">

                {/* Report image */}
                <div className="d-head">

                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Reported issue"
                            className="report-detail-image"
                        />
                    ) : (
                        <span className="thumb">
                            <Icon n="road" />
                        </span>
                    )}

                    <div>
                        <strong className="rid-s">
                            {r.report_id}
                        </strong>

                        <div>
                            {r.issue}
                        </div>

                        <small>
                            <Icon n="road" />{" "}
                            {r.category}
                        </small>
                    </div>

                    <Severity
                        v={r.severity}
                    />

                </div>

                {/* Location */}
                <h3>Location</h3>

                <p>
                    {hasLoc ? (
                        <>
                            {Number(r.latitude).toFixed(4)},{" "}
                            {Number(r.longitude).toFixed(4)}{" "}

                            <a
                                className="lnk"
                                target="_blank"
                                rel="noreferrer"
                                href={`https://www.openstreetmap.org/?mlat=${r.latitude}&mlon=${r.longitude}#map=17/${r.latitude}/${r.longitude}`}
                            >
                                View on Map
                            </a>
                        </>
                    ) : (
                        "No location was added to this report."
                    )}
                </p>

                {/* Description */}
                <h3>Description</h3>

                <p className="desc">
                    {r.description}
                </p>

                {/* Status */}
                <h3>Current Status</h3>

                <p>
                    <Status v={r.status} />
                </p>

                {/* Admin status update */}
                {admin && (
                    <>
                        <h3>
                            Update Status
                        </h3>

                        <div className="upd">

                            <select
                                value={val}
                                onChange={(e) =>
                                    setVal(
                                        e.target.value
                                    )
                                }
                                aria-label="New status"
                            >
                                {STATUSES.map(
                                    (s) => (
                                        <option
                                            key={s}
                                        >
                                            {s}
                                        </option>
                                    )
                                )}
                            </select>

                            <button
                                className="btn"
                                disabled={
                                    busy ||
                                    val === r.status
                                }
                                onClick={save}
                            >
                                {busy
                                    ? "Updating…"
                                    : "Update"}
                            </button>

                        </div>
                    </>
                )}

                {msg && (
                    <p
                        className="okmsg"
                        role="status"
                    >
                        {msg}
                    </p>
                )}

                {err && (
                    <p
                        className="err"
                        role="alert"
                    >
                        {err}
                    </p>
                )}

                {!admin &&
                    r.status === "Resolved" && (
                        <button
                            className="btn ghost"
                            style={{ marginTop: 14 }}
                            onClick={() =>
                                go("resolved")
                            }
                        >
                            See resolution
                        </button>
                    )}

            </div>
        </div>
    );
}