import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createProduct } from "../api/products";
import { getCategories } from "../api/categories";

function AdminAddProductPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data || []);
        if (data && data.length > 0) {
          setCategory(String(data[0].id));
        }
      } catch (error) {
        console.error("Errore caricamento categorie:", error);
      }
    }
    fetchCategories();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setMessageType("");

      const productPayload = {
        name: name.trim(),
        description: description.trim(),
        category: Number(category),
        brand: brand.trim(),
        price: Number(price),
        image_url: imageUrl.trim(),
        status: status.trim(),
      };

      await createProduct(productPayload);

      setMessage("Prodotto creato con successo.");
      setMessageType("success");

      setTimeout(() => {
        navigate("/admin/products");
      }, 800);
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);
      const backendError = error.message || "Errore durante la creazione del prodotto.";
      setMessage(backendError);
      setMessageType("error");
    }
  }

  return (
    <div style={{ backgroundColor: "#f9fafb", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <Navbar />

      <div style={{ padding: "40px 5%", maxWidth: "800px", margin: "0 auto" }}>
        <button
          onClick={() => navigate("/admin/products")}
          style={{
            marginBottom: "24px",
            padding: "10px 16px",
            backgroundColor: "white",
            color: "#374151",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          ← Torna ai Prodotti
        </button>

        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ margin: "0 0 10px 0", color: "#111827" }}>Aggiungi Prodotto</h1>
          <p style={{ margin: 0, color: "#6b7280" }}>Compila il form per inserire un nuovo prodotto a catalogo.</p>
        </div>

        {message && (
          <div
            style={{
              padding: "16px 20px",
              borderRadius: "12px",
              marginBottom: "24px",
              fontWeight: "bold",
              backgroundColor: messageType === "success" ? "#dcfce7" : "#fee2e2",
              color: messageType === "success" ? "#166534" : "#991b1b",
              border: `1px solid ${messageType === "success" ? "#bbf7d0" : "#fca5a5"}`,
            }}
          >
            {message}
          </div>
        )}

        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
        }}>
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#374151" }}>Nome Prodotto *</label>
              <input
                type="text"
                placeholder="Es. Smartphone Plus"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #d1d5db", boxSizing: "border-box", backgroundColor: "#f9fafb" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#374151" }}>Marca *</label>
              <input
                type="text"
                placeholder="Es. Samsung"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
                style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #d1d5db", boxSizing: "border-box", backgroundColor: "#f9fafb" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#374151" }}>Prezzo (€) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #d1d5db", boxSizing: "border-box", backgroundColor: "#f9fafb" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#374151" }}>Categoria *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #d1d5db", boxSizing: "border-box", backgroundColor: "#f9fafb" }}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#374151" }}>Stato *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #d1d5db", boxSizing: "border-box", backgroundColor: "#f9fafb" }}
              >
                <option value="AVAILABLE">Available</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
                <option value="DISCONTINUED">Discontinued</option>
              </select>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#374151" }}>URL Immagine</label>
              <input
                type="text"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #d1d5db", boxSizing: "border-box", backgroundColor: "#f9fafb" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#374151" }}>Descrizione *</label>
              <textarea
                placeholder="Inserisci i dettagli del prodotto..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="4"
                style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #d1d5db", resize: "vertical", boxSizing: "border-box", backgroundColor: "#f9fafb" }}
              />
            </div>

            <div style={{ gridColumn: "1 / -1", marginTop: "10px" }}>
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                  boxShadow: "0 4px 6px rgba(37, 99, 235, 0.2)"
                }}
              >
                Salva Nuovo Prodotto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminAddProductPage;