import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getProducts, deleteProduct } from "../api/products";
import { useNavigate } from "react-router-dom";

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null, productName: "" });
  const [toast, setToast] = useState({ message: "", type: "" });

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

  function confirmDelete(id, name) {
    setDeleteModal({ isOpen: true, productId: id, productName: name });
  }

  async function handleDelete() {
    try {
      await deleteProduct(deleteModal.productId);
      setToast({ message: "Prodotto eliminato con successo!", type: "success" });
      setDeleteModal({ isOpen: false, productId: null, productName: "" });
      loadProducts();
    } catch (error) {
      console.error("Errore eliminazione prodotto", error);
      setToast({ message: "Errore durante l'eliminazione del prodotto.", type: "error" });
    }
  }

  function closeDeleteModal() {
    setDeleteModal({ isOpen: false, productId: null, productName: "" });
  }

  return (
    <div style={{ backgroundColor: "#f9fafb", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <Navbar />

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={closeDeleteModal}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "30px",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 16px 0", fontSize: "20px", color: "#111827", fontWeight: "900" }}>
              Conferma eliminazione
            </h3>
            <p style={{ color: "#374151", margin: "0 0 24px 0" }}>
              Sei sicuro di voler eliminare il prodotto <strong>"{deleteModal.productName}"</strong>? L'azione non può essere annullata.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={closeDeleteModal}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  backgroundColor: "white",
                  color: "#4b5563",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "14px"
                }}
              >
                Annulla
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#dc2626",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "14px"
                }}
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.message && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "16px 20px",
            borderRadius: "12px",
            backgroundColor: toast.type === "success" ? "#dcfce7" : "#fee2e2",
            color: toast.type === "success" ? "#166534" : "#991b1b",
            fontWeight: "bold",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            border: `1px solid ${toast.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            zIndex: 1100,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            minWidth: "300px"
          }}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast({ message: "", type: "" })}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
              color: toast.type === "success" ? "#166534" : "#991b1b"
            }}
          >
            ×
          </button>
        </div>
      )}

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
                  onClick={() => confirmDelete(p.id, p.name)}
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