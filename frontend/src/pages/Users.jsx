import { useMemo, useState } from "react";
import Icon from "../components/Icon";

export default function Users({ currentUser }) {
    const [search, setSearch] = useState("");

    /*
     * Currently we only have the logged-in user available
     * on the frontend.
     *
     * Once a backend /users API is added, this list can be
     * replaced with the complete database user list.
     */
    const users = useMemo(() => {
        if (!currentUser) return [];

        return [
            {
                id: currentUser.user_id || currentUser.id || 1,
                name: currentUser.name || "Administrator",
                email: currentUser.email || "admin@civicmind.ai",
                role: currentUser.role || "admin",
                status: "Active"
            }
        ];
    }, [currentUser]);

    const filteredUsers = users.filter((u) =>
        `${u.name} ${u.email} ${u.role}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const citizenCount = users.filter(
        (u) => u.role === "citizen"
    ).length;

    const adminCount = users.filter(
        (u) => u.role === "admin"
    ).length;

    return (
        <div className="panel wide">

            {/* HEADER */}
            <div className="admin-heading">
                <div>
                    <h1 className="pt">
                        Users
                    </h1>

                    <p className="sub">
                        Manage and view users registered with CivicMind AI.
                    </p>
                </div>

                <div className="admin-badge">
                    <Icon n="users" />
                    User Management
                </div>
            </div>


            {/* STATISTICS */}
            <div className="stats">

                <div className="card stat">
                    <div>
                        <small>Total Users</small>
                        <strong>{users.length}</strong>
                    </div>

                    <span className="sico users-stat">
                        <Icon n="users" />
                    </span>
                </div>


                <div className="card stat">
                    <div>
                        <small>Citizens</small>
                        <strong>{citizenCount}</strong>
                    </div>

                    <span className="sico citizen-stat">
                        <Icon n="user" />
                    </span>
                </div>


                <div className="card stat">
                    <div>
                        <small>Administrators</small>
                        <strong>{adminCount}</strong>
                    </div>

                    <span className="sico admin-stat">
                        <Icon n="admin" />
                    </span>
                </div>


                <div className="card stat">
                    <div>
                        <small>Active Users</small>
                        <strong>
                            {users.filter(
                                (u) => u.status === "Active"
                            ).length}
                        </strong>
                    </div>

                    <span className="sico active-stat">
                        <Icon n="check" />
                    </span>
                </div>

            </div>


            {/* USER TABLE */}
            <div className="card flush">

                <div className="row-h pad">

                    <div>
                        <h2>
                            Registered Users
                        </h2>

                        <p className="admin-section-text">
                            View accounts and their roles in the system.
                        </p>
                    </div>


                    <label className="search">

                        <Icon n="search" />

                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            aria-label="Search users"
                        />

                    </label>

                </div>


                {filteredUsers.length > 0 ? (

                    <div className="users-table">

                        <div className="users-table-head">
                            <span>User</span>
                            <span>Email</span>
                            <span>Role</span>
                            <span>Status</span>
                        </div>


                        {filteredUsers.map((u) => (

                            <div
                                className="users-table-row"
                                key={u.id}
                            >

                                <div className="user-cell">

                                    <span className="user-avatar">
                                        <Icon n="user" />
                                    </span>

                                    <div>
                                        <strong>
                                            {u.name}
                                        </strong>

                                        <small>
                                            User ID: {u.id}
                                        </small>
                                    </div>

                                </div>


                                <div className="user-email">
                                    {u.email}
                                </div>


                                <div>

                                    <span
                                        className={
                                            "user-role " +
                                            u.role
                                        }
                                    >
                                        {u.role === "admin"
                                            ? "Administrator"
                                            : "Citizen"}
                                    </span>

                                </div>


                                <div>

                                    <span className="user-status">
                                        <span className="status-dot"></span>
                                        {u.status}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="users-empty">

                        <span className="users-empty-icon">
                            <Icon n="users" />
                        </span>

                        <h3>
                            No users found
                        </h3>

                        <p>
                            Try searching with a different name or email.
                        </p>

                    </div>

                )}

            </div>


            {/* INFORMATION */}
            <div className="users-info">

                <span className="users-info-icon">
                    <Icon n="spark" />
                </span>

                <div>
                    <strong>
                        User Management
                    </strong>

                    <p>
                        Administrators can monitor registered
                        CivicMind AI accounts and their roles.
                    </p>
                </div>

            </div>

        </div>
    );
}
