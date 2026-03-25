import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getReviewReports, resolveReviewReport } from "../api/reviews";

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [filterStatus, setFilterStatus] = useState("PENDING");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, [filterStatus]);

  async function loadReports() {
    setLoading(true);
    try {
      const data = await getReviewReports(filterStatus);
      setReports(data || []);
    } catch (error) {
      console.error("Errore caricamento segnalazioni:", error);
      setMessage("Errore caricamento segnalazioni.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResolve(reportId, action) {
    try {
      await resolveReviewReport(reportId, action);

      // If we are in PENDING view, remove the resolved item
      if (filterStatus === "PENDING") {
        setReports((prev) => prev.filter((report) => report.id !== reportId));
      } else {
        // If we are in RESOLVED (history), just reload or update state if needed
        loadReports();
      }
      
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

      <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", backgroundColor: "#f9fafb", minHeight: "100vh", maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "10px" }}>Monitoraggio Segnalazioni</h1>
        <p style={{ color: "#6b7280", marginBottom: "30px" }}>Gestisci le segnalazioni degli utenti sulle recensioni.</p>

        {message && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              borderRadius: "10px",
              backgroundColor: message.includes("Errore") ? "#fee2e2" : "#dcfce7",
              color: message.includes("Errore") ? "#991b1b" : "#166534",
              fontWeight: "bold",
              maxWidth: "900px",
            }}
          >
            {message}
          </div>
        )}

        {/* Status Toggle */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
          <button
            onClick={() => setFilterStatus("PENDING")}
            style={{
              padding: "10px 20px",
              backgroundColor: filterStatus === "PENDING" ? "#1e3a8a" : "#fff",
              color: filterStatus === "PENDING" ? "#fff" : "#1e3a8a",
              border: "1px solid #1e3a8a",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Sospese (Pendenti)
          </button>
          <button
            onClick={() => setFilterStatus("RESOLVED")}
            style={{
              padding: "10px 20px",
              backgroundColor: filterStatus === "RESOLVED" ? "#1e3a8a" : "#fff",
              color: filterStatus === "RESOLVED" ? "#fff" : "#1e3a8a",
              border: "1px solid #1e3a8a",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Storico (Risolte)
          </button>
        </div>

        {loading ? (
          <p>Caricamento...</p>
        ) : reports.length === 0 ? (
          <p style={{ color: "#6b7280" }}>Nessuna segnalazione trovata in questo stato.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {reports.map((report) => (
              <div
                key={report.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "24px",
                  maxWidth: "900px",
                  backgroundColor: "white",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                  <h3 style={{ margin: 0, color: "#111827" }}>
                    Segnalazione #{report.id}
                  </h3>
                  {report.status === "RESOLVED" && (
                    <span style={{ 
                      backgroundColor: "#dcfce7", 
                      color: "#166534", 
                      padding: "4px 12px", 
                      borderRadius: "20px", 
                      fontSize: "12px", 
                      fontWeight: "bold",
                      textTransform: "uppercase"
                    }}>
                      Risolta
                    </span>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                  <div>
                    <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                      <strong style={{ color: "#4b5563" }}>Motivo:</strong> {report.reason}
                    </p>
                    <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                      <strong style={{ color: "#4b5563" }}>Segnalata da:</strong> {report.reported_by || "Utente"}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                      <strong style={{ color: "#4b5563" }}>Prodotto:</strong> {report.product_name || "N/A"}
                    </p>
                    <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                      <strong style={{ color: "#4b5563" }}>Autore recensione:</strong> {report.review_author || "N/A"}
                    </p>
                  </div>
                </div>

                <div style={{ 
                  backgroundColor: "#f9fafb", 
                  padding: "15px", 
                  borderRadius: "10px", 
                  border: "1px solid #f3f4f6",
                  marginBottom: "20px"
                }}>
                  <strong style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "5px" }}>Contenuto recensione:</strong>
                  <p style={{ margin: 0, color: "#111827", fontStyle: "italic" }}>
                    "{report.review_description || "Nessuna descrizione"}"
                  </p>
                </div>

                {report.status === "PENDING" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleResolve(report.id, "hide")}
                      style={{
                        padding: "10px 18px",
                        backgroundColor: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Nascondi Recensione
                    </button>
                    <button
                      onClick={() => handleResolve(report.id, "keep")}
                      style={{
                        padding: "10px 18px",
                        backgroundColor: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Mantieni Visibile
                    </button>
                  </div>
                ) : (
                  <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "15px", marginTop: "10px", color: "#6b7280", fontSize: "14px" }}>
                    <p style={{ margin: 0 }}>
                      <strong>Azione intrapresa:</strong> {report.action === "hide" ? "Nascosta" : "Mantenuta"}
                    </p>
                    <p style={{ margin: "5px 0 0 0" }}>
                      <strong>Risolta il:</strong> {new Date(report.resolved_at).toLocaleString("it-IT")}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;