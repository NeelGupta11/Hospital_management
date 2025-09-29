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
        setReports(data.reports || []);
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

      // Refresh reports list
      const reportsRes = await fetch(`/api/patient/${id}/report`);
      const reportsData = await reportsRes.json();
      setReports(reportsData.reports || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-3xl space-y-6">
        {/* Upload Card */}
        <div className="bg-gradient-white rounded-xl shadow-card p-6 space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Upload Report</h2>
          <p className="text-sm text-muted-foreground">Attach PDF reports for this patient (ID: {id})</p>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Report title (e.g., Chest X-Ray)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border p-2 rounded-lg text-foreground"
            />

            <div className="flex items-center gap-4">
              <label className="text-gray cursor-pointer px-4 py-2 bg-gradient-primary text-white rounded-lg shadow hover:scale-105 transition transform">
                Choose PDF
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-muted-foreground">
                {file ? file.name : "No file chosen"}
              </span>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                className="bg-gradient-gray text-foreground px-4 py-2 rounded-lg shadow hover:scale-105 transition transform"
                onClick={() => {
                  setTitle("");
                  setFile(null);
                }}
                disabled={loading}
              >
                Reset
              </button>
              <button
                type="submit"
                className="bg-gradient-dark text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition transform"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Report"}
              </button>
            </div>
          </form>
        </div>

        {/* Reports List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fetching ? (
            <div className="text-center text-muted-foreground">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="text-center text-muted-foreground">No reports uploaded yet.</div>
          ) : (
            reports.map((report) => (
              <a
                key={report._id}
                href={`/api/report/${report._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-xl cursor-pointer 
                           p-4 flex flex-col justify-between bg-gradient-white shadow-card
                           hover:shadow-card-hover transition transform hover:scale-105"
              >
                <div className="flex flex-col gap-2">
                  <div className="font-semibold text-lg text-foreground">{report.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Uploaded: {new Date(report.uploadedAt).toLocaleDateString()} • PDF
                  </div>
                </div>
                <div className="mt-2 text-sm font-semibold text-primary group-hover:text-accent transition">
                  View PDF
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
