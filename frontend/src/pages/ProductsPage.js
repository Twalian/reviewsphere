import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProducts } from "../api/products";
import { getCategories } from "../api/categories";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    async function initData() {
      try {
        const catData = await getCategories();
        setCategories(catData || []);
      } catch (err) {
        console.error("Errore caricamento categorie:", err);
      }
    }
    initData();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const filters = {
          category: selectedCategory,
          brand: selectedBrand,
          status: selectedStatus,
        };
        const data = await getProducts(filters);
        setProducts(data);
      } catch (err) {
        setError("Errore nel caricamento dei prodotti");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [selectedCategory, selectedBrand, selectedStatus]);

  function getCategoryName(id) {
    const cat = categories.find((c) => String(c.id) === String(id));
    return cat ? cat.name : "N/D";
  }

  const brands = [...new Set(products.map((p) => p.brand))].filter(Boolean);

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ marginBottom: "10px" }}>Lista Prodotti</h1>
        <p style={{ color: "#555", marginBottom: "30px" }}>
          Catalogo prodotti ReviewSphere
        </p>

        {/* Filter Bar */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "30px",
            padding: "20px",
            backgroundColor: "#f3f4f6",
            borderRadius: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "14px", fontWeight: "bold" }}>Categoria</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }}
            >
              <option value="">Tutte le categorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "14px", fontWeight: "bold" }}>Marca</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              style={{ padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }}
            >
              <option value="">Tutte le marche</option>
              {/* Note: In a real app, brands might come from a dedicated API or unique values from products */}
              <option value="Apple">Apple</option>
              <option value="Samsung">Samsung</option>
              <option value="Sony">Sony</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Google">Google</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "14px", fontWeight: "bold" }}>Stato</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ padding: "8px", borderRadius: "8px", border: "1px solid #ccc" }}
            >
              <option value="">Tutti gli stati</option>
              <option value="AVAILABLE">Disponibile</option>
              <option value="OUT_OF_STOCK">Non disponibile</option>
              <option value="DISCONTINUED">Fuori produzione</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSelectedCategory("");
              setSelectedBrand("");
              setSelectedStatus("");
            }}
            style={{
              marginTop: "20px",
              padding: "10px 15px",
              backgroundColor: "#e5e7eb",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Reset Filtri
          </button>
        </div>

        {loading && <p>Caricamento prodotti...</p>}

        {!loading && error && (
          <p style={{ color: "red", marginBottom: "20px" }}>{error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <p>Nessun prodotto disponibile con questi filtri.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "25px",
          }}
        >
          {!loading &&
            !error &&
            products.map((product) => (
              <div
                key={product.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
                  backgroundColor: "#fff",
                  transition: "transform 0.2s",
                }}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "16px",
                      marginBottom: "16px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: "180px",
                      backgroundColor: "#f3f4f6",
                      borderRadius: "16px",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#9ca3af",
                      fontSize: "14px",
                    }}
                  >
                    Immagine non disponibile
                  </div>
                )}

                <h3 style={{ margin: "0 0 12px 0", fontSize: "1.25rem" }}>{product.name}</h3>

                <p style={{ margin: "6px 0", color: "#4b5563" }}>
                  <strong>Marca:</strong> {product.brand}
                </p>

                <p style={{ margin: "6px 0", color: "#4b5563" }}>
                  <strong>Categoria:</strong> {getCategoryName(product.category)}
                </p>

                <p style={{ margin: "6px 0 20px 0", color: "#111827", fontSize: "1.1rem" }}>
                  <strong>Prezzo:</strong> {product.price} €
                </p>

                <button
                  onClick={() => navigate(`/products/${product.id}`)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    backgroundColor: "#1e3a8a",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  Vedi dettagli
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;