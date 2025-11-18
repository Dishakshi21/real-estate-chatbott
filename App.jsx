import React, { useState } from "react";
import axios from "axios";
import TrendChart from "./TrendChart";

export default function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState(null);
  const [error, setError] = useState("");

  const fmt = (n) => {
    if (n === null || n === undefined || n === "") return "";
    try {
      return new Intl.NumberFormat("en-IN").format(Number(n));
    } catch {
      return n;
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResp(null);

    // make user input forgiving: strip "Analyze " if present
    const payloadQuery = query.replace(/^Analyze\s+/i, "").trim();

    try {
      const r = await axios.post("/api/analyze/", { query: payloadQuery });
      setResp(r.data);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
          "Request failed. Make sure backend is running and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = () => {
    const area = resp?.tableRows?.[0]?.area || query || "";
    // If query is like "Analyze Wakad" make sure to strip
    const areaClean = area.replace(/^Analyze\s+/i, "").trim();
    window.open(`/api/download/?area=${encodeURIComponent(areaClean)}`, "_blank");
  };

  return (
    <div className="container py-4">
      <h3>Real Estate Analysis Chatbot</h3>

      <form onSubmit={handleSubmit} className="mb-3">
        <div className="input-group">
          <input
            className="form-control"
            placeholder='Type: Wakad  (or "Analyze Wakad")'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading...
              </>
            ) : (
              "Ask"
            )}
          </button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {resp && (
        <>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="card mb-3 w-100">
              <div className="card-body">
                <strong>Summary:</strong>
                <p>{resp.summary}</p>
              </div>
            </div>

            <div style={{ marginLeft: 12 }}>
              <button className="btn btn-outline-secondary mb-2" onClick={downloadCsv}>
                Download CSV
              </button>
            </div>
          </div>

          <div className="mb-3">
            <TrendChart chartData={resp.chartData} />
          </div>

          <div>
            <h5>Table (first 200 rows)</h5>
            <div className="table-responsive">
              <table className="table table-sm table-striped">
                <thead>
                  <tr>
                    {resp.tableRows.length > 0 &&
                      Object.keys(resp.tableRows[0]).map((c) => <th key={c}>{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {resp.tableRows.map((row, i) => (
                    <tr key={i}>
                      {Object.keys(row).map((k) => (
                        <td key={k}>
                          {k.toLowerCase() === "price" ? fmt(row[k]) : row[k]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
