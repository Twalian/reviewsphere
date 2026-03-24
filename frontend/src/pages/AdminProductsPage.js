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
    <div>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h1>Gestione Prodotti</h1>

        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              padding: "16px",
              marginBottom: "10px",
              borderRadius: "10px"
            }}
          >
            <h3>{p.name}</h3>
            <p>{p.brand}</p>
            <p>{p.price} €</p>

            <button
              onClick={() => navigate(`/admin/products/${p.id}/edit`)}
              style={{ marginRight: "10px" }}
            >
              Modifica
            </button>

            <button onClick={() => handleDelete(p.id)}>
              Elimina
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProductsPage;