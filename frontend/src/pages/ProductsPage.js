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
    <div style={{ backgroundColor: "#f9fafb", minHeight: "100vh", fontFamily: "'Inter', Arial, sans-serif" }}>
      <Navbar />

      <div style={{ padding: "40px 5%", margin: "0 auto" }}>
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
          <h1 style={{ margin: "0 0 10px 0", color: "#111827", fontSize: "32px", fontWeight: "800" }}>Esplora il Catalogo</h1>
          <p style={{ color: "#6b7280", margin: 0, fontSize: "16px" }}>
            Scopri i migliori prodotti, leggi le recensioni e confrontali con l'AI.
          </p>
        </div>

        {/* AI Comparison Results */}
        {comparisonResult && (
          <div
            style={{
              marginBottom: "40px",
              padding: "30px",
              backgroundColor: "white",
              border: "2px solid #10b981",
              borderRadius: "20px",
              boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.15)",
              maxWidth: "1000px",
              margin: "0 auto 40px auto"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ color: "#065f46", margin: 0, display: "flex", alignItems: "center", gap: "10px", fontSize: "24px" }}>
                <span>🤖</span> Risultato Confronto AI
              </h2>
              <button 
                onClick={() => setComparisonResult(null)}
                style={{ background: "#f3f4f6", border: "none", cursor: "pointer", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#4b5563", fontWeight: "bold" }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ fontSize: "16px", lineHeight: "1.7", color: "#374151" }}>
              <p style={{ whiteSpace: "pre-wrap", margin: "0 0 20px 0" }}>{comparisonResult.comparison}</p>
              
              {comparisonResult.winner_recommendation && (
                <div style={{ padding: "20px", backgroundColor: "#ecfdf5", borderRadius: "12px", border: "1px solid #a7f3d0", display: "flex", gap: "15px", alignItems: "flex-start" }}>
                  <div style={{ fontSize: "28px", marginTop: "-4px" }}>🏆</div>
                  <div>
                    <strong style={{ color: "#047857", display: "block", marginBottom: "8px", fontSize: "18px" }}>Raccomandazione Definitiva:</strong>
                    <span style={{ color: "#065f46", lineHeight: "1.5" }}>{comparisonResult.winner_recommendation}</span>
                  </div>
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
            marginBottom: "40px",
            padding: "24px",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: "1", minWidth: "150px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold", color: "#374151" }}>Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ padding: "12px", borderRadius: "10px", border: "1px solid #d1d5db", backgroundColor: "#f9fafb", color: "#111827", outline: "none", cursor: "pointer" }}
              >
                <option value="">Tutte</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: "1", minWidth: "150px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold", color: "#374151" }}>Marca</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                style={{ padding: "12px", borderRadius: "10px", border: "1px solid #d1d5db", backgroundColor: "#f9fafb", color: "#111827", outline: "none", cursor: "pointer" }}
              >
                <option value="">Tutte</option>
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Sony">Sony</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Google">Google</option>
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: "1", minWidth: "150px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold", color: "#374151" }}>Stato</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ padding: "12px", borderRadius: "10px", border: "1px solid #d1d5db", backgroundColor: "#f9fafb", color: "#111827", outline: "none", cursor: "pointer" }}
              >
                <option value="">Tutti</option>
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
                padding: "12px 20px",
                backgroundColor: "#f3f4f6",
                color: "#4b5563",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
                height: "45px"
              }}
            >
              Reset Filtri
            </button>
          </div>

          {(user || selectedForComparison.length > 0) && (
            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "20px", marginTop: "4px" }}>
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#eff6ff", padding: "10px 16px", borderRadius: "10px", color: "#1e3a8a", fontWeight: "bold" }}>
                    <span>🎯</span> Prodotti selezionati: {selectedForComparison.length}
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    {selectedForComparison.length > 0 && (
                      <button 
                        onClick={() => setSelectedForComparison([])}
                        style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontWeight: "bold" }}
                      >
                        Svuota selezione
                      </button>
                    )}
                    
                    <button
                      onClick={handleCompare}
                      disabled={selectedForComparison.length < 2 || comparing}
                      style={{
                        padding: "12px 24px",
                        backgroundColor: (selectedForComparison.length < 2 || comparing) ? "#9ca3af" : "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: (selectedForComparison.length < 2 || comparing) ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        fontSize: "15px",
                        boxShadow: selectedForComparison.length >= 2 && !comparing ? "0 4px 6px -1px rgba(16, 185, 129, 0.3)" : "none",
                        transition: "all 0.2s"
                      }}
                    >
                      {comparing ? "Analisi in corso..." : "✨ Confronta con AI"}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#d97706", fontWeight: "bold", padding: "12px", backgroundColor: "#fffbeb", borderRadius: "10px" }}>
                  <span style={{ fontSize: "18px" }}>⚠️</span> Effettua il login per utilizzare il confronto AI e scoprire qual è il prodotto migliore per te.
                </div>
              )}
            </div>
          )}
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280", fontSize: "18px", fontWeight: "bold" }}>
            Caricamento prodotti...
          </div>
        )}

        {!loading && error && (
          <div style={{ padding: "16px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "10px", textAlign: "center", fontWeight: "bold" }}>
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280", backgroundColor: "white", borderRadius: "16px", fontSize: "18px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            Nessun prodotto disponibile con questi filtri.
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "30px",
          }}
        >
          {!loading &&
            !error &&
            products.map((product) => {
              const isSelected = selectedForComparison.includes(product.id);
              
              return (
                <div
                  key={product.id}
                  style={{
                    borderRadius: "20px",
                    padding: "20px",
                    backgroundColor: "white",
                    boxShadow: isSelected ? "0 0 0 3px #10b981, 0 10px 25px -5px rgba(16, 185, 129, 0.2)" : "0 4px 6px -1px rgba(0,0,0,0.05)",
                    transition: "all 0.2s ease",
                    position: "relative",
                    transform: isSelected ? "translateY(-4px)" : "none",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ position: "absolute", top: "16px", right: "16px", zIndex: 10 }}>
                    <div 
                      onClick={() => handleSelectForComparison(product.id)}
                      style={{ 
                        width: "32px", 
                        height: "32px", 
                        borderRadius: "8px", 
                        backgroundColor: isSelected ? "#10b981" : "white",
                        border: isSelected ? "none" : "2px solid #d1d5db",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        transition: "all 0.2s"
                      }}
                      title="Seleziona per il confronto"
                    >
                      {isSelected && <span style={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>✓</span>}
                    </div>
                  </div>

                  <div style={{ height: "220px", marginBottom: "20px", borderRadius: "16px", overflow: "hidden", backgroundColor: "#f9fafb" }}>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease"
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#9ca3af",
                          fontSize: "14px",
                          fontWeight: "bold"
                        }}
                      >
                        Nessuna Immagine
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <h3 style={{ margin: "0", fontSize: "20px", color: "#111827", fontWeight: "800", lineHeight: "1.3" }}>
                      {product.name}
                    </h3>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <span style={{ color: "#6b7280", fontSize: "14px", fontWeight: "bold", backgroundColor: "#f3f4f6", padding: "4px 8px", borderRadius: "6px" }}>{product.brand}</span>
                    <span style={{ color: "#6b7280", fontSize: "14px", backgroundColor: "#f3f4f6", padding: "4px 8px", borderRadius: "6px" }}>{getCategoryName(product.category)}</span>
                  </div>

                  <div style={{ marginBottom: "auto" }}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        backgroundColor: 
                          product.status === "AVAILABLE" ? "#ecfdf5" :
                          product.status === "OUT_OF_STOCK" ? "#fffbeb" : 
                          "#fef2f2",
                        color:
                          product.status === "AVAILABLE" ? "#047857" :
                          product.status === "OUT_OF_STOCK" ? "#b45309" : 
                          "#b91c1c",
                        display: "inline-block"
                      }}
                    >
                      {product.status === "OUT_OF_STOCK" ? "Non disponibile" :
                       product.status === "DISCONTINUED" ? "Fuori produzione" :
                       "Disponibile"}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "24px" }}>
                    <div style={{ color: "#111827", fontSize: "24px", fontWeight: "900" }}>
                      {product.price} €
                    </div>
                    
                    <button
                      onClick={() => navigate(`/products/${product.id}`)}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "14px",
                        boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)"
                      }}
                    >
                      Scopri
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;