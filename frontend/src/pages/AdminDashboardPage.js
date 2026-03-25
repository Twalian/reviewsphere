import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getDashboardStats } from "../api/dashboard";
import { getTopRatedProducts, getWorstRatedProducts } from "../api/products";

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [topRated, setTopRated] = useState([]);
  const [worstRated, setWorstRated] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [statsData, topData, avoidData] = await Promise.all([
        getDashboardStats(),
        getTopRatedProducts(),
        getWorstRatedProducts(),
      ]);
      setStats(statsData);
      setTopRated(topData || []);
      setWorstRated(avoidData || []);
    } catch (error) {
      console.error("Errore caricamento dashboard:", error);
      setMessage("Errore caricamento dashboard.");
    } finally {
      setLoading(false);
    }
  }

  const maxTrend = stats?.trend ? Math.max(...stats.trend.map(t => t.count), 1) : 1;

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px 5%", fontFamily: "Arial, sans-serif", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1 style={{ marginBottom: "10px" }}>Admin Dashboard</h1>
          <p style={{ color: "#6b7280", marginBottom: "30px" }}>Statistiche e insights globali della piattaforma.</p>
        </div>

        {message && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              borderRadius: "12px",
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              fontWeight: "bold",
              maxWidth: "1000px",
              border: "1px solid #fecaca"
            }}
          >
            {message}
          </div>
        )}

        {loading ? (
          <p>Caricamento dashboard...</p>
        ) : (
          <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
            {/* Summary Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
                marginBottom: "40px",
              }}
            >
              {[
                { label: "Totale prodotti", value: stats?.summary?.total_products, color: "#3b82f6" },
                { label: "Totale recensioni", value: stats?.summary?.total_reviews, color: "#10b981" },
                { label: "Totale utenti", value: stats?.summary?.total_users, color: "#f59e0b" },
              ].map((card, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: "16px",
                    padding: "24px",
                    backgroundColor: "white",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    borderLeft: `6px solid ${card.color}`,
                  }}
                >
                  <h3 style={{ marginTop: 0, color: "#6b7280", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{card.label}</h3>
                  <p style={{ fontSize: "32px", fontWeight: "bold", margin: 0, color: "#111827" }}>
                    {card.value ?? 0}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "30px" }}>
              
              {/* Trend Chart (CSS based) */}
              <div
                style={{
                  borderRadius: "16px",
                  padding: "24px",
                  backgroundColor: "white",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h2 style={{ marginTop: 0, borderBottom: "1px solid #f3f4f6", paddingBottom: "15px", marginBottom: "20px" }}>Trend Recensioni Mensile</h2>
                {!stats?.trend || stats.trend.length === 0 ? (
                  <p>Nessun dato trend disponibile.</p>
                ) : (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "200px", paddingTop: "20px" }}>
                    {stats.trend.map((item, index) => (
                      <div key={index} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <div 
                          title={`${item.count} recensioni`}
                          style={{ 
                            width: "100%", 
                            backgroundColor: "#3b82f6", 
                            height: `${(item.count / maxTrend) * 100}%`,
                            borderRadius: "4px 4px 0 0",
                            minHeight: item.count > 0 ? "4px" : "0"
                          }} 
                        />
                        <span style={{ fontSize: "12px", color: "#6b7280", transform: "rotate(-45deg)", whiteSpace: "nowrap", marginTop: "10px" }}>
                          {item.month 
                            ? new Date(item.month).toLocaleString("it-IT", { month: "short", year: "numeric" }) 
                            : item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Alerts Section */}
              <div
                style={{
                  borderRadius: "16px",
                  padding: "24px",
                  backgroundColor: "white",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h2 style={{ marginTop: 0, color: "#dc2626", borderBottom: "1px solid #f3f4f6", paddingBottom: "15px", marginBottom: "20px" }}>⚠️ Prodotti Critici (Rating &lt; 2.5)</h2>
                {!stats?.alerts || stats.alerts.length === 0 ? (
                  <p>Nessun alert importante.</p>
                ) : (
                  stats.alerts.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "12px 0",
                        borderBottom: "1px solid #f3f4f6",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{item.product_name || item.name}</span>
                      <strong style={{ color: "#dc2626" }}>★ {item.average_rating?.toFixed(1)}</strong>
                    </div>
                  ))
                )}
              </div>

              {/* Side by side wrapper for Top 10 lists */}
              <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "30px" }}>
                {/* Top Rated Products */}
                <div
                  style={{
                    borderRadius: "16px",
                    padding: "24px",
                    backgroundColor: "white",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <h2 style={{ marginTop: 0, color: "#166534", borderBottom: "1px solid #f3f4f6", paddingBottom: "15px", marginBottom: "20px" }}>🏆 Top 10 Apprezzati</h2>
                  {topRated.length === 0 ? (
                    <p>Dati non disponibili.</p>
                  ) : (
                    topRated.map((prod, index) => (
                      <div
                        key={prod.id}
                        style={{
                          padding: "12px 0",
                          borderBottom: "1px solid #f3f4f6",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>{index + 1}. {prod.name}</span>
                        <strong style={{ color: "#16a34a" }}>★ {Number(prod.average_rating).toFixed(1)}</strong>
                      </div>
                    ))
                  )}
                </div>

                {/* Worst Rated Products */}
                <div
                  style={{
                    borderRadius: "16px",
                    padding: "24px",
                    backgroundColor: "white",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <h2 style={{ marginTop: 0, color: "#991b1b", borderBottom: "1px solid #f3f4f6", paddingBottom: "15px", marginBottom: "20px" }}>📉 Top 10 Meno Apprezzati</h2>
                  {worstRated.length === 0 ? (
                    <p>Dati non disponibili.</p>
                  ) : (
                    worstRated.map((prod, index) => (
                      <div
                        key={prod.id}
                        style={{
                          padding: "12px 0",
                          borderBottom: "1px solid #f3f4f6",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>{index + 1}. {prod.name}</span>
                        <strong style={{ color: "#dc2626" }}>★ {Number(prod.average_rating).toFixed(1)}</strong>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;