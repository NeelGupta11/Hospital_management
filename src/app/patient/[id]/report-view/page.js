"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ReportsPage() {
  const { id } = useParams(); // patient id
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen flex justify-center items-center bg-background">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Header */}
      <div className="relative w-full bg-gradient-dark py-16 px-6 text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-3xl mx-auto animate-scale-in">
          Reports for Patient 
        </h1>
        <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto animate-scale-in">
          View all uploaded medical reports for this patient.
        </p>

        {/* Floating Circles */}
        <div className="absolute top-8 left-8 w-16 h-16 border border-white/10 rounded-full animate-float" />
        <div
          className="absolute bottom-8 right-8 w-16 h-16 border border-white/10 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-16 h-16 border border-white/10 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Reports List */}
      <div className="w-full max-w-4xl px-6 grid gap-6">
        {reports.length === 0 ? (
          <div className="bg-gradient-white shadow-card rounded-xl p-6 text-center text-foreground animate-scale-in">
            No reports uploaded yet.
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report._id}
              className="bg-gradient-white shadow-card rounded-xl p-6 flex flex-col md:flex-row justify-between items-center animate-scale-in"
            >
              <div className="mb-4 md:mb-0 text-foreground">
                <p className="font-semibold text-lg">{report.title}</p>
                <p className="text-sm text-muted-foreground">
                  Uploaded: {new Date(report.uploadedAt).toLocaleString()}
                </p>
              </div>
              <a
                href={`/api/report/${report._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-800 hover:bg-blue-900 text-white py-2 px-4 rounded-lg font-semibold transition-all"
              >
                View PDF
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
