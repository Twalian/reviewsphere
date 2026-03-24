import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getReviewReports, resolveReviewReport } from "../api/reviews";

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const data = await getReviewReports();
      setReports(data || []);
    } catch (error) {
      console.error("Errore caricamento segnalazioni:", error);
      setMessage("Errore caricamento segnalazioni.");
    }
  }

  async function handleResolve(reportId, action) {
    try {
      await resolveReviewReport(reportId, action);

      setReports((prev) => prev.filter((report) => report.id !== reportId));
      setMessage(
        action === "hide"
          ? "Segnalazione risolta: recensione nascosta."
          : "Segnalazione risolta: recensione mantenuta visibile."
      );
    } catch (error) {
      console.error("Errore risoluzione segnalazione:", error);
      setMessage(error.message || "Errore durante la risoluzione.");
    }
  }

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
        <h1>Gestione segnalazioni</h1>

        {message && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              borderRadius: "10px",
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              fontWeight: "bold",
              maxWidth: "900px",
            }}
          >
            {message}
          </div>
        )}

        {reports.length === 0 ? (
          <p>Non ci sono segnalazioni pendenti.</p>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "14px",
                maxWidth: "900px",
                backgroundColor: "white",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0" }}>
                Segnalazione #{report.id}
              </h3>

              <p style={{ margin: "0 0 8px 0" }}>
                <strong>Motivo:</strong> {report.reason}
              </p>

              {report.review_id && (
                <p style={{ margin: "0 0 8px 0" }}>
                  <strong>ID recensione:</strong> {report.review_id}
                </p>
              )}

              {report.review_title && (
                <p style={{ margin: "0 0 8px 0" }}>
                  <strong>Titolo recensione:</strong> {report.review_title}
                </p>
              )}

              {report.reported_by && (
                <p style={{ margin: "0 0 8px 0" }}>
                  <strong>Segnalata da:</strong> {report.reported_by}
                </p>
              )}

              {report.review_author && (
                <p style={{ margin: "0 0 8px 0" }}>
                  <strong>Autore recensione:</strong> {report.review_author}
                </p>
              )}

              {report.review_description && (
                <p style={{ margin: "10px 0 12px 0", color: "#374151" }}>
                  {report.review_description}
                </p>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                <button
                  onClick={() => handleResolve(report.id, "hide")}
                  style={{
                    padding: "10px 14px",
                    backgroundColor: "#b91c1c",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Nascondi recensione
                </button>

                <button
                  onClick={() => handleResolve(report.id, "keep")}
                  style={{
                    padding: "10px 14px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Mantieni visibile
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReportsPage;