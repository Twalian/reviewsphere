import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getProducts } from "../api/products";

function ProductsPage() {
  const mockProducts = [
    {
      id: 1,
      name: "iPhone 14",
      brand: "Apple",
      category: "Smartphone",
      price: "899€",
    },
    {
      id: 2,
      name: "Galaxy S24",
      brand: "Samsung",
      category: "Smartphone",
      price: "799€",
    },
    {
      id: 3,
      name: "Dell XPS 13",
      brand: "Dell",
      category: "Laptop",
      price: "1199€",
    },
  ];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setProducts(mockProducts);
        setUsingMockData(true);
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

        {usingMockData && (
          <p style={{ color: "#b45309", marginBottom: "20px" }}>
            API prodotti non ancora disponibile: visualizzazione dati demo.
          </p>
        )}

        {loading && <p>Caricamento prodotti...</p>}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {!loading &&
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
                  Immagine prodotto
                </div>

                <h3 style={{ margin: "0 0 10px 0" }}>{product.name}</h3>

                <p style={{ margin: "6px 0" }}>
                  <strong>Marca:</strong> {product.brand}
                </p>

                <p style={{ margin: "6px 0" }}>
                  <strong>Categoria:</strong> {product.category}
                </p>

                <p style={{ margin: "6px 0 16px 0" }}>
                  <strong>Prezzo:</strong> {product.price}
                </p>

                <button
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