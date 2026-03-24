import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProducts } from "../api/products";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function getCategoryLabel(category) {
    if (category === 1) return "Smartphone";
    if (category === 2) return "Computer";
    if (category === 3) return "Tablet";
    if (category === 4) return "Accessori";
    return category;
  }

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        console.log("PRODUCTS FROM API:", data);
        setProducts(data);
      } catch (err) {
        setError("Errore nel caricamento dei prodotti");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ marginBottom: "10px" }}>Lista Prodotti</h1>
        <p style={{ color: "#555", marginBottom: "20px" }}>
          Catalogo prodotti ReviewSphere
        </p>

        {loading && <p>Caricamento prodotti...</p>}

        {!loading && error && (
          <p style={{ color: "red", marginBottom: "20px" }}>{error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <p>Nessun prodotto disponibile.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {!loading &&
            !error &&
            products.map((product) => (
              <div
                key={product.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  backgroundColor: "#fff",
                }}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      marginBottom: "16px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: "160px",
                      backgroundColor: "#e5e7eb",
                      borderRadius: "12px",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6b7280",
                      fontWeight: "bold",
                    }}
                  >
                    Immagine non disponibile
                  </div>
                )}

                <h3 style={{ margin: "0 0 10px 0" }}>{product.name}</h3>

                <p style={{ margin: "6px 0" }}>
                  <strong>Marca:</strong> {product.brand}
                </p>

                <p style={{ margin: "6px 0" }}>
                  <strong>Categoria:</strong> {getCategoryLabel(product.category)}
                </p>

                <p style={{ margin: "6px 0 16px 0" }}>
                  <strong>Prezzo:</strong> {product.price}
                </p>

                <button
                  onClick={() => navigate(`/products/${product.id}`)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#1e3a8a",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold",
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