import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProducts, compareProducts } from "../api/products";
import { getCategories } from "../api/categories";
import { useAuth } from "../hooks/useAuth";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Comparison state
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [comparing, setComparing] = useState(false);

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

  function handleSelectForComparison(productId) {
    setSelectedForComparison((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }

  async function handleCompare() {
    if (selectedForComparison.length < 2) {
      alert("Seleziona almeno due prodotti per il confronto.");
      return;
    }

    setComparing(true);
    setError("");
    try {
      const result = await compareProducts(selectedForComparison);
      setComparisonResult(result);
      // Scroll to result
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Errore confronto AI:", err);
      setError("Errore durante il confronto AI. Riprova più tardi.");
    } finally {
      setComparing(false);
    }
  }

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ marginBottom: "10px" }}>Lista Prodotti</h1>
        <p style={{ color: "#555", marginBottom: "30px" }}>
          Catalogo prodotti ReviewSphere
        </p>

        {/* AI Comparison Results */}
        {comparisonResult && (
          <div
            style={{
              marginBottom: "40px",
              padding: "25px",
              backgroundColor: "#f0fdf4",
              border: "2px solid #22c55e",
              borderRadius: "16px",
              maxWidth: "1000px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h2 style={{ color: "#166534", margin: 0 }}>🤖 Risultato Confronto AI</h2>
              <button 
                onClick={() => setComparisonResult(null)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#166534" }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ fontSize: "16px", lineHeight: "1.6", color: "#111827" }}>
              <p style={{ whiteSpace: "pre-wrap" }}>{comparisonResult.comparison}</p>
              
              {comparisonResult.winner_recommendation && (
                <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #bbf7d0" }}>
                  <strong style={{ color: "#15803d", display: "block", marginBottom: "5px" }}>🏆 Raccomandazione AI:</strong>
                  {comparisonResult.winner_recommendation}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filter & Comparison Actions Bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginBottom: "30px",
            padding: "20px",
            backgroundColor: "#f3f4f6",
            borderRadius: "12px",
          }}
        >
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
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

          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: "15px", borderTop: "1px solid #ddd", paddingTop: "15px" }}>
              <span style={{ fontWeight: "bold", fontSize: "15px" }}>
                🎯 Selezionati per confronto: {selectedForComparison.length}
              </span>
              <button
                onClick={handleCompare}
                disabled={selectedForComparison.length < 2 || comparing}
                style={{
                  padding: "12px 20px",
                  backgroundColor: comparing ? "#9ca3af" : "#059669",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: selectedForComparison.length < 2 || comparing ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                }}
              >
                {comparing ? "Confronto in corso..." : "🚀 Confronta Prodotti (AI)"}
              </button>
              {selectedForComparison.length > 0 && (
                <button 
                  onClick={() => setSelectedForComparison([])}
                  style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", textDecoration: "underline" }}
                >
                  Svuota selezione
                </button>
              )}
            </div>
          )}
          {!user && selectedForComparison.length > 0 && (
              <p style={{ color: "#d97706", margin: 0, fontWeight: "bold" }}>
                ⚠️ Effettua il login per utilizzare il confronto AI.
              </p>
          )}
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
                  border: selectedForComparison.includes(product.id) ? "2px solid #059669" : "1px solid #ddd",
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
                  backgroundColor: "#fff",
                  transition: "all 0.2s ease",
                  position: "relative",
                  transform: selectedForComparison.includes(product.id) ? "scale(1.02)" : "scale(1)",
                }}
              >
                {/* Comparison Checkbox */}
                <div style={{ position: "absolute", top: "15px", right: "15px", zIndex: 10 }}>
                  <input
                    type="checkbox"
                    checked={selectedForComparison.includes(product.id)}
                    onChange={() => handleSelectForComparison(product.id)}
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                    title="Seleziona per il confronto"
                  />
                </div>

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