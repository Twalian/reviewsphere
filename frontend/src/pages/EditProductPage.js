import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProducts, updateProduct } from "../api/products";
import { getCategories } from "../api/categories";

function EditProductPage() {
  const { id } = useParams();
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

  useEffect(() => {
    async function init() {
      await Promise.all([loadProduct(), fetchCategories()]);
    }
    init();
  }, [id]);

  async function fetchCategories() {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Errore caricamento categorie:", error);
    }
  }

  async function loadProduct() {
    try {
      const products = await getProducts();
      const product = products.find((p) => String(p.id) === String(id));

      if (!product) {
        setMessage("Prodotto non trovato.");
        return;
      }

      setName(product.name || "");
      setDescription(product.description || "");
      setCategory(String(product.category || ""));
      setBrand(product.brand || "");
      setPrice(product.price || "");
      setImageUrl(product.image_url || "");
      setStatus(product.status || "AVAILABLE");
    } catch (error) {
      console.error("Errore caricamento prodotto", error);
      setMessage("Errore caricamento prodotto.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        category: Number(category),
        brand: brand.trim(),
        price: Number(price),
        image_url: imageUrl.trim(),
        status: status.trim(),
      };

      await updateProduct(id, payload);
      navigate("/admin/products");
    } catch (error) {
      console.error("Errore modifica prodotto", error);
      setMessage(error.message || "Errore durante la modifica del prodotto.");
    }
  }


  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto" }}>
        <button
          onClick={() => navigate("/admin/products")}
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
          ← Torna alla gestione prodotti
        </button>

        <h1>Modifica prodotto</h1>

        {message && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              border: "1px solid #fca5a5",
              padding: "12px 16px",
              borderRadius: "12px",
              marginBottom: "20px",
              fontWeight: "bold",
              maxWidth: "700px",
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
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
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
            <option value="AVAILABLE">Available</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
            <option value="DISCONTINUED">Discontinued</option>
          </select>


          <button
            type="submit"
            style={{
              width: "240px",
              padding: "12px",
              backgroundColor: "#1d4ed8",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Salva modifiche
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProductPage;