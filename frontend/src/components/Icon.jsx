const P = {
    pin: "M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",

    dash: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z",

    plus: "M12 5v14M5 12h14",

    file: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",

    user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",

    out: "M9 4H5v16h4M16 8l4 4-4 4M20 12H9",

    up: "M12 16V5M7 10l5-5 5 5M5 19h14",

    check: "M5 12.5l4.5 4.5L19 7.5",

    bolt: "M13 2L4 14h7l-1 8 9-12h-7z",

    spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z",

    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",

    people: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 20a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 20a6 6 0 0 0-4-5.6",

    tag: "M3 12V4h8l10 10-8 8zM7.5 8.5h.01",

    gauge: "M4 16a8 8 0 1 1 16 0M12 16l4-5",

    alert: "M12 4l10 17H2zM12 10v5M12 18h.01",

    map: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14",

    users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 20a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 20a6 6 0 0 0-4-5.6",

    gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1-2-4-2 .5-1.5-1L15 4h-4l-.5 2.5-1.5 1L7 7l-2 4 2 1v2l-2 1 2 4 2-.5 1.5 1L11 20h4l.5-2.5 1.5-1 2 .5 2-4-2-1z",

    road: "M7 3L4 21M17 3l3 18M12 4v3M12 10v4M12 17v3",

    search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5",

    wrench: "M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.7 2.7-2.3-.7-.7-2.3z",

    eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",

    pot: "M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"
};

export default function Icon({ n, s = 2, size = 20 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={s}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                minWidth: `${size}px`,
                minHeight: `${size}px`,
                maxWidth: `${size}px`,
                maxHeight: `${size}px`,
                display: "inline-block",
                flexShrink: 0
            }}
        >
            <path d={P[n] || ""} />
        </svg>
    );
}