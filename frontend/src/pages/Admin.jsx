
import { useState } from "react";
import Icon from "../components/Icon";
import { ReportTable, Empty } from "./MyReports";

export default function Admin({ reports, loading, error, open, full }) {

    const n = (status) =>
        reports.filter((r) => r.status === status).length;

    const S = [
        ["Total Reports", reports.length, "file", "#2563eb"],
        ["In Review", n("Under Review"), "eye", "#f59e0b"],
        ["In Progress", n("In Progress"), "wrench", "#2563eb"],
        ["Resolved", n("Resolved"), "check", "#16a34a"],
    ];

    const [q, setQ] = useState("");

    const base = full
        ? reports.filter((r) =>
              (r.report_id + r.issue + r.category)
                  .toLowerCase()
                  .includes(q.toLowerCase())
          )
        : reports.slice(0, 6);

    return (
        <div className="panel wide">

            {/* ADMIN HEADER */}
            <div className="admin-heading">
                <div>
                    <h1 className="pt">
                        {full ? "All Reports" : "Admin Dashboard"}
                    </h1>

                    <p className="sub">
                        {full
                            ? "View, search and manage all citizen reports"
                            : "Monitor and manage civic issues reported by citizens"}
                    </p>
                </div>

                {!full && (
                    <div className="admin-badge">
                        <Icon n="admin" />
                        Administrator
                    </div>
                )}
            </div>

            {/* STATISTICS */}
            {!full && (
                <div className="stats">

                    {S.map(([label, value, icon, color]) => (
                        <div
                            className="card stat"
                            key={label}
                        >
                            <div>
                                <small>{label}</small>
                                <strong>{value}</strong>
                            </div>

                            <span
                                className="sico"
                                style={{
                                    background: color + "1f",
                                    color: color
                                }}
                            >
                                <Icon n={icon} />
                            </span>
                        </div>
                    ))}

                </div>
            )}

            {/* REPORT MANAGEMENT */}
            <div className="card flush">

                <div className="row-h pad">

                    <div>
                        <h2>
                            {full
                                ? "Reports Management"
                                : "Recent Citizen Reports"}
                        </h2>

                        {!full && (
                            <p className="admin-section-text">
                                Review the latest civic issues submitted by citizens.
                            </p>
                        )}
                    </div>

                    {full && (
                        <label className="search">
                            <Icon n="search" />

                            <input
                                placeholder="Search reports..."
                                value={q}
                                onChange={(e) =>
                                    setQ(e.target.value)
                                }
                                aria-label="Search reports"
                            />
                        </label>
                    )}

                </div>

                {/* REPORT TABLE */}
                {loading ? (
                    <Empty text="Loading reports…" />
                ) : error ? (
                    <Empty text={error} />
                ) : base.length ? (
                    <ReportTable
                        rows={base}
                        open={open}
                        severity
                    />
                ) : (
                    <Empty text="No reports yet. New citizen reports appear here." />
                )}

            </div>

        </div>
    );
}

