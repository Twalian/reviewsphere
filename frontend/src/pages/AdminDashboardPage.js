import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getDashboardStats } from "../api/dashboard";

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Errore caricamento dashboard:", error);
      setMessage("Errore caricamento dashboard.");
    }
  }

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
        <h1>Admin Dashboard</h1>

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

        {!stats ? (
          <p>Caricamento dashboard...</p>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                marginBottom: "30px",
              }}
            >
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "20px",
                  minWidth: "220px",
                  backgroundColor: "white",
                }}
              >
                <h3 style={{ marginTop: 0 }}>Totale prodotti</h3>
                <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>
                  {stats.summary?.total_products ?? 0}
                </p>
              </div>

              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "20px",
                  minWidth: "220px",
                  backgroundColor: "white",
                }}
              >
                <h3 style={{ marginTop: 0 }}>Totale recensioni</h3>
                <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>
                  {stats.summary?.total_reviews ?? 0}
                </p>
              </div>

              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "20px",
                  minWidth: "220px",
                  backgroundColor: "white",
                }}
              >
                <h3 style={{ marginTop: 0 }}>Totale utenti</h3>
                <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>
                  {stats.summary?.total_users ?? 0}
                </p>
              </div>
            </div>

            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "30px",
                backgroundColor: "white",
                maxWidth: "900px",
              }}
            >
              <h2 style={{ marginTop: 0 }}>Prodotti con alert</h2>

              {!stats.alerts || stats.alerts.length === 0 ? (
                <p>Nessun alert presente.</p>
              ) : (
                stats.alerts.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: "10px 0",
                    }}
                  >
                    <strong>{item.product_name || item.name}</strong>{" "}
                    {item.average_rating !== undefined &&
                      `- Rating medio: ${item.average_rating}`}
                  </div>
                ))
              )}
            </div>

            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "30px",
                backgroundColor: "white",
                maxWidth: "900px",
              }}
            >
              <h2 style={{ marginTop: 0 }}>Top categorie</h2>

              {!stats.top_categories || stats.top_categories.length === 0 ? (
                <p>Nessuna categoria disponibile.</p>
              ) : (
                stats.top_categories.map((category, index) => (
                  <div
                    key={index}
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: "10px 0",
                    }}
                  >
                    <strong>{category.category_name || category.name}</strong>{" "}
                    {category.review_count !== undefined &&
                      `- Recensioni: ${category.review_count}`}
                  </div>
                ))
              )}
            </div>

            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "white",
                maxWidth: "900px",
              }}
            >
              <h2 style={{ marginTop: 0 }}>Trend recensioni</h2>

              {!stats.trend || stats.trend.length === 0 ? (
                <p>Nessun dato trend disponibile.</p>
              ) : (
                stats.trend.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      borderBottom: "1px solid #eee",
                      padding: "10px 0",
                    }}
                  >
                    <strong>{item.month || item.label}</strong>{" "}
                    {item.count !== undefined && `- ${item.count} recensioni`}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;