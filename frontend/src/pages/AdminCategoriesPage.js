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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div style={{ backgroundColor: "#f9fafb", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <Navbar />

      <div style={{ padding: "40px 5%", maxWidth: "1000px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ margin: "0 0 10px 0", color: "#111827" }}>Gestione Categorie</h1>
          <p style={{ margin: 0, color: "#6b7280" }}>Crea e gestisci i settori del catalogo.</p>
        </div>

        {message && (
          <div
            style={{
              marginBottom: "20px",
              padding: "16px 20px",
              borderRadius: "12px",
              backgroundColor: message.includes("Errore") ? "#fee2e2" : "#dcfce7",
              color: message.includes("Errore") ? "#991b1b" : "#166534",
              fontWeight: "bold",
              border: `1px solid ${message.includes("Errore") ? "#fecaca" : "#bbf7d0"}`
            }}
          >
            {message}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px" }}>
          
          {/* Form Card */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          }}>
            <h2 style={{ margin: "0 0 20px 0", color: "#111827", fontSize: "20px" }}>
              {editingId ? "Modifica Categoria" : "Nuova Categoria"}
            </h2>
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#374151" }}>Nome</label>
                <input
                  type="text"
                  placeholder="Es. Elettronica, Libri..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    boxSizing: "border-box",
                    backgroundColor: "#f9fafb"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#374151" }}>Descrizione</label>
                <textarea
                  placeholder="Descrizione dettagliata..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    resize: "vertical",
                    boxSizing: "border-box",
                    backgroundColor: "#f9fafb"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "14px",
                    backgroundColor: editingId ? "#2563eb" : "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px"
                  }}
                >
                  {editingId ? "Salva Modifiche" : "Crea Categoria"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setName("");
                      setDescription("");
                    }}
                    style={{
                      padding: "14px 20px",
                      backgroundColor: "#f3f4f6",
                      color: "#4b5563",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Annulla
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List Card */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          }}>
            <h2 style={{ margin: "0 0 20px 0", color: "#111827", fontSize: "20px" }}>
              Categorie Esistenti
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#f9fafb",
                    flexWrap: "wrap",
                    gap: "20px"
                  }}
                >
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <h3 style={{ margin: "0 0 4px 0", color: "#111827" }}>{category.name}</h3>
                    <p style={{ margin: 0, color: "#6b7280", fontSize: "14px", lineHeight: "1.5" }}>
                      {category.description}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleEdit(category)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "white",
                        color: "#374151",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold"
                      }}
                    >
                      Modifica
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold"
                      }}
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <p style={{ color: "#6b7280", textAlign: "center", margin: 0 }}>Nessuna categoria presente.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminCategoriesPage;