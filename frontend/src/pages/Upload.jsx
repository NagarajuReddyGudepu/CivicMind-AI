import { useRef, useState } from "react";

import Icon from "../components/Icon";

import { analyzeImage } from "../api";

export default function Upload({
    file,
    preview,
    setImage,
    setAnalysis,
    go
}) {
    const ref = useRef();

    const [over, setOver] = useState(false);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");

    const pick = (f) => {
        setErr("");

        if (!f) return;

        if (!/^image\/(jpe?g|png)$/.test(f.type)) {
            return setErr(
                "Please choose a JPG, JPEG or PNG image."
            );
        }

        if (f.size > 10 * 1024 * 1024) {
            return setErr(
                "The image is larger than 10MB. Choose a smaller one."
            );
        }

        setImage(f);
    };

    /*
     * Compress image only for AI analysis.
     *
     * The original file remains unchanged and will still
     * be used later for permanent report storage.
     */
    const prepareImageForAI = (originalFile) => {
        return new Promise((resolve, reject) => {
            const img = new Image();

            const url = URL.createObjectURL(originalFile);

            img.onload = () => {
                URL.revokeObjectURL(url);

                const MAX_SIZE = 1280;

                let width = img.width;
                let height = img.height;

                if (width > MAX_SIZE || height > MAX_SIZE) {
                    if (width > height) {
                        height =
                            Math.round(
                                (height / width) *
                                MAX_SIZE
                            );

                        width = MAX_SIZE;
                    } else {
                        width =
                            Math.round(
                                (width / height) *
                                MAX_SIZE
                            );

                        height = MAX_SIZE;
                    }
                }

                const canvas =
                    document.createElement("canvas");

                canvas.width = width;
                canvas.height = height;

                const ctx =
                    canvas.getContext("2d");

                ctx.drawImage(
                    img,
                    0,
                    0,
                    width,
                    height
                );

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(
                                new Error(
                                    "Could not prepare image."
                                )
                            );
                            return;
                        }

                        const compressedFile =
                            new File(
                                [blob],
                                "ai-analysis.jpg",
                                {
                                    type: "image/jpeg"
                                }
                            );

                        resolve(compressedFile);
                    },
                    "image/jpeg",
                    0.75
                );
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);

                reject(
                    new Error(
                        "Could not read the selected image."
                    )
                );
            };

            img.src = url;
        });
    };

    const run = async () => {
        setBusy(true);
        setErr("");

        try {
            /*
             * Create a smaller copy for Gemini.
             */
            const aiFile =
                await prepareImageForAI(file);

            /*
             * Send only the compressed copy to Gemini.
             */
            const r =
                await analyzeImage(aiFile);

            if (r.error) {
                throw new Error(r.error);
            }

            setAnalysis(r);

            go("analysis");

        } catch (e) {
            setErr(
                e.message ||
                "Analysis failed. Check that the backend is running."
            );
        }

        setBusy(false);
    };

    return (
        <div className="panel">

            <h1 className="pt">
                Report a Civic Issue
            </h1>

            <p className="sub">
                Upload a photo of the problem and let AI do the rest.
            </p>

            <div
                className={
                    "drop card" +
                    (over ? " over" : "")
                }
                role="button"
                tabIndex={0}
                onClick={() =>
                    ref.current.click()
                }
                onKeyDown={(e) =>
                    e.key === "Enter" &&
                    ref.current.click()
                }
                onDragOver={(e) => {
                    e.preventDefault();
                    setOver(true);
                }}
                onDragLeave={() =>
                    setOver(false)
                }
                onDrop={(e) => {
                    e.preventDefault();
                    setOver(false);
                    pick(
                        e.dataTransfer.files[0]
                    );
                }}
            >

                {preview ? (
                    <img
                        src={preview}
                        alt="Selected issue"
                    />
                ) : (
                    <>
                        <Icon n="up" />

                        <strong>
                            Upload Image
                        </strong>

                        <small>
                            Browse or drag and drop
                        </small>

                        <small>
                            JPG, JPEG, PNG • Max 10MB
                        </small>
                    </>
                )}

                <input
                    ref={ref}
                    type="file"
                    accept="image/png,image/jpeg"
                    hidden
                    onChange={(e) =>
                        pick(e.target.files[0])
                    }
                />

            </div>

            {err && (
                <p
                    className="err"
                    role="alert"
                >
                    {err}
                </p>
            )}

            <button
                className="btn block"
                style={{ marginTop: 18 }}
                disabled={!file || busy}
                onClick={run}
            >
                {busy ? (
                    <>
                        <span className="spin" />
                        Preparing & Analyzing…
                    </>
                ) : (
                    "Analyze Image"
                )}
            </button>

        </div>
    );
}