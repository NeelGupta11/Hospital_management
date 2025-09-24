"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function UploadReport() {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [fetching, setFetching] = useState(true);

  // Fetch reports list
  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch(`/api/patient/${id}/report`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch reports");
        setReports(data.reports);
      } catch (err) {
        alert(err.message);
      } finally {
        setFetching(false);
      }
    }
    fetchReports();
  }, [id]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && f.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }
    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) return alert("Fill title and choose a PDF");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);

      const res = await fetch(`/api/patient/${id}/report`, {
        method: "PATCH",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");
      alert(data.message || "Uploaded");

      setTitle("");
      setFile(null);

      // Refresh reports list after upload
      const reportsRes = await fetch(`/api/patient/${id}/report`);
      const reportsData = await reportsRes.json();
      setReports(reportsData.reports);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container w-screen h-screen">
      <div className="upload-card">
        <div className="upload-header">
          <div>
            <div className="upload-title">Upload Report</div>
            <div className="upload-subtitle">
              Attach PDF reports to this patient
            </div>
          </div>
          <div className="small">Patient ID: {id}</div>
        </div>

        <form className="upload-form" onSubmit={handleSubmit}>
          <input
            className="upload-input"
            type="text"
            placeholder="Report title (e.g., Chest X-Ray)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ color: "black" }}
          />
          <div className="file-wrap">
            <label className="file-label">
              Choose PDF
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ color: "red" }}
              />
            </label>
            <div className="preview-name">
              {file ? file.name : <span className="small">No file chosen</span>}
            </div>
          </div>

          <div className="upload-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setTitle("");
                setFile(null);
              }}
              disabled={loading}
            >
              Reset
            </button>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Uploading..." : "Upload Report"}
            </button>
          </div>
        </form>

        {/* Reports List */}
        <div className="reports-list">
          {fetching ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : reports.length === 0 ? (
            <div className="no-reports">No reports uploaded yet.</div>
          ) : (
            reports.map((report) => (
              <div key={report._id} className="report-item">
                <div className="report-info">
                  <div className="report-title">{report.title}</div>
                  <div className="report-meta">
                    Uploaded:{" "}
                    {new Date(report.uploadedAt).toLocaleDateString()} • PDF
                  </div>
                </div>
                <a
                  href={`/api/report/${report._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="patient-btn patient-btn-green-outline"
                >
                  View PDF
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
