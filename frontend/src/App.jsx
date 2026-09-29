import { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setResult(null);
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/analyze-image",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        error: "Could not connect to the backend.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>CivicMind AI</h1>

      <h2>Report a Community Issue</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <br />
      <br />

      <button onClick={analyzeImage} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Issue"}
      </button>

      {result && (
        <div>
          <h2>AI Analysis</h2>

          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <>
              <p>
                <strong>Issue:</strong> {result.issue}
              </p>

              <p>
                <strong>Category:</strong> {result.category}
              </p>

              <p>
                <strong>Confidence:</strong>{" "}
                {(result.confidence * 100).toFixed(0)}%
              </p>

              <p>
                <strong>Severity:</strong> {result.severity}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;