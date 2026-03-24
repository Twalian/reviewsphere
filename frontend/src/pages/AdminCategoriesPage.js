import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categories";

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Errore caricamento categorie", error);
      setMessage("Errore caricamento categorie.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
      };

      if (editingId) {
        await updateCategory(editingId, payload);
        setMessage("Categoria aggiornata con successo.");
      } else {
        await createCategory(payload);
        setMessage("Categoria creata con successo.");
      }

      setName("");
      setDescription("");
      setEditingId(null);
      loadCategories();
    } catch (error) {
      console.error("Errore salvataggio categoria", error);
      setMessage(error.message || "Errore durante il salvataggio.");
    }
  }

  function handleEdit(category) {
    setEditingId(category.id);
    setName(category.name || "");
    setDescription(category.description || "");
  }

  async function handleDelete(id) {
    if (!window.confirm("Vuoi eliminare questa categoria?")) return;

    try {
      await deleteCategory(id);
      setMessage("Categoria eliminata con successo.");
      loadCategories();
    } catch (error) {
      console.error("Errore eliminazione categoria", error);
      setMessage(error.message || "Errore durante l'eliminazione.");
    }
  }

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
        <h1>Gestione categorie</h1>

        {message && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              borderRadius: "10px",
              backgroundColor: "#e0f2fe",
              color: "#075985",
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
            marginBottom: "30px",
          }}
        >
          <input
            type="text"
            placeholder="Nome categoria"
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
            placeholder="Descrizione categoria"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          />

          <button
            type="submit"
            style={{
              width: "240px",
              padding: "12px",
              backgroundColor: editingId ? "#1d4ed8" : "#065f46",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {editingId ? "Salva modifiche" : "Crea categoria"}
          </button>
        </form>

        {categories.map((category) => (
          <div
            key={category.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "12px",
              maxWidth: "700px",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0" }}>{category.name}</h3>

            <p style={{ margin: "0 0 12px 0", color: "#4b5563" }}>
              {category.description}
            </p>

            <button
              onClick={() => handleEdit(category)}
              style={{ marginRight: "10px" }}
            >
              Modifica
            </button>

            <button onClick={() => handleDelete(category.id)}>
              Elimina
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminCategoriesPage;