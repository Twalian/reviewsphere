import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createProduct } from "../api/products";

function AdminAddProductPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("1");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("available");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

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

      console.log("CREATE PRODUCT PAYLOAD:", productPayload);

      await createProduct(productPayload);

      setMessage("Prodotto creato con successo.");
      setMessageType("success");

      setTimeout(() => {
        navigate("/products");
      }, 800);
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      const backendError =
        error.message || "Errore durante la creazione del prodotto.";

      setMessage(backendError);
      setMessageType("error");
    }
  }

  function getMessageStyle() {
    if (messageType === "success") {
      return {
        backgroundColor: "#dcfce7",
        color: "#166534",
        border: "1px solid #86efac",
      };
    }

    return {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fca5a5",
    };
  }

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            marginBottom: "20px",
            padding: "10px 16px",
            backgroundColor: "#e5e7eb",
            color: "#111827",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← Torna indietro
        </button>

        <h1>Aggiungi nuovo prodotto</h1>

        <p style={{ color: "#4b5563", marginBottom: "24px" }}>
          Pagina admin per la creazione di un nuovo prodotto.
        </p>

        {message && (
          <div
            style={{
              ...getMessageStyle(),
              padding: "12px 16px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontWeight: "bold",
              maxWidth: "700px",
              whiteSpace: "pre-wrap",
            }}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: "700px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <input
            type="text"
            placeholder="Nome prodotto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
            }}
          />

          <textarea
            placeholder="Descrizione prodotto"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              width: "220px",
            }}
          >
            <option value="1">Smartphone</option>
            <option value="2">Computer</option>
            <option value="3">Tablet</option>
            <option value="4">Accessori</option>
          </select>

          <input
            type="text"
            placeholder="Marca"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
            }}
          />

          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Prezzo"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              width: "220px",
            }}
          />

          <input
            type="text"
            placeholder="URL immagine"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
            }}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              width: "220px",
            }}
          >
            <option value="available">Available</option>
            <option value="inactive">Inactive</option>
            <option value="out_of_order">Out of Order</option>
          </select>

          <button
            type="submit"
            style={{
              width: "240px",
              padding: "12px",
              backgroundColor: "#065f46",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Crea prodotto
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminAddProductPage;