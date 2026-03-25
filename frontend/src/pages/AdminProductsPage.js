import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getProducts, deleteProduct } from "../api/products";
import { useNavigate } from "react-router-dom";

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Errore caricamento prodotti", error);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Vuoi eliminare questo prodotto?")) return;

    try {
      await deleteProduct(id);
      loadProducts();
    } catch (error) {
      console.error("Errore eliminazione prodotto", error);
    }
  }

  return (
    <div style={{ backgroundColor: "#f9fafb", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <Navbar />

      <div style={{ padding: "40px 5%", maxWidth: "1000px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1 style={{ margin: "0 0 10px 0", color: "#111827" }}>Gestione Prodotti</h1>
            <p style={{ margin: 0, color: "#6b7280" }}>Amministra il catalogo prodotti della piattaforma.</p>
          </div>
          <button
            onClick={() => navigate("/admin/add-product")}
            style={{
              padding: "12px 20px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)"
            }}
          >
            + Nuovo Prodotto
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "20px"
              }}
            >
              <div style={{ flex: 1, minWidth: "300px" }}>
                <h3 style={{ margin: "0 0 8px 0", color: "#111827", fontSize: "18px" }}>{p.name}</h3>
                <div style={{ display: "flex", gap: "15px", color: "#6b7280", fontSize: "14px", flexWrap: "wrap" }}>
                  <span><strong style={{color: "#374151"}}>Brand:</strong> {p.brand}</span>
                  <span><strong style={{color: "#374151"}}>Prezzo:</strong> {p.price} €</span>
                  <span>
                    <strong style={{color: "#374151"}}>Stato:</strong>{" "}
                    <span style={{ 
                      color: p.status === "AVAILABLE" ? "#16a34a" : p.status === "OUT_OF_STOCK" ? "#d97706" : "#dc2626",
                      fontWeight: "bold",
                      backgroundColor: p.status === "AVAILABLE" ? "#dcfce7" : p.status === "OUT_OF_STOCK" ? "#fef3c7" : "#fee2e2",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px"
                    }}>
                      {p.status}
                    </span>
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#f3f4f6",
                    color: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Modifica
                </button>
                <button 
                  onClick={() => handleDelete(p.id)}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#fee2e2",
                    color: "#991b1b",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Elimina
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280", backgroundColor: "white", borderRadius: "16px" }}>
              Nessun prodotto trovato.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default AdminProductsPage;