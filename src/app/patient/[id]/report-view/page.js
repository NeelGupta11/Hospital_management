"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ReportsPage() {
  const { id } = useParams(); // patient id
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile,setProfile] = useState({});
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
        setLoading(false);
      }
    }
    fetchReports();
  }, [id]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <h1 className="reports-header">
        Reports for Patient <span className="highlight">{id}</span>
      </h1>

      {reports.length === 0 ? (
        <div className="no-reports">No reports uploaded yet.</div>
      ) : (
        <div className="reports-list">
          {reports.map((report) => (
            <div key={report._id} className="report-card">
              <div>
                <p className="report-title">{report.title}</p>
                <p className="report-date">
                  Uploaded: {new Date(report.uploadedAt).toLocaleString()}
                </p>
              </div>
              <a
                href={`/api/report/${report._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-view"
              >
                View PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
