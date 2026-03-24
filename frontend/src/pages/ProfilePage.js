import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import {
  getMyReviews,
  updateReview,
  deleteReview,
} from "../api/reviews";

function ProfilePage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editVote, setEditVote] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    loadMyReviews();
  }, []);

  async function loadMyReviews() {
    try {
      const data = await getMyReviews();
      setReviews(data);
    } catch (error) {
      console.error("Errore caricamento recensioni", error);
      setMessage("Errore caricamento recensioni.");
    }
  }

  function handleEdit(review) {
    setEditingId(review.id);
    setEditTitle(review.title || "");
    setEditVote(review.vote || "");
    setEditDescription(review.description || "");
    setMessage("");
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditVote("");
    setEditDescription("");
  }

  async function handleSaveEdit(reviewId) {
    try {
      const payload = {
        title: editTitle.trim(),
        vote: Number(editVote),
        description: editDescription.trim(),
      };

      await updateReview(reviewId, payload);

      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                title: payload.title,
                vote: payload.vote,
                description: payload.description,
              }
            : review
        )
      );

      setMessage("Recensione aggiornata con successo.");
      handleCancelEdit();
    } catch (error) {
      console.error("Errore modifica recensione", error);
      setMessage(error.message || "Errore durante la modifica della recensione.");
    }
  }

  async function handleDelete(reviewId) {
    if (!window.confirm("Vuoi eliminare questa recensione?")) return;

    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      setMessage("Recensione eliminata con successo.");
    } catch (error) {
      console.error("Errore eliminazione recensione", error);
      setMessage(error.message || "Errore durante l'eliminazione della recensione.");
    }
  }

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
        <h1>Profilo utente</h1>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "16px",
            marginBottom: "24px",
            maxWidth: "700px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Informazioni account</h3>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Ruolo:</strong> {user?.role}</p>
        </div>

        <h2>Le mie recensioni</h2>

        {message && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              borderRadius: "10px",
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              fontWeight: "bold",
              maxWidth: "700px",
            }}
          >
            {message}
          </div>
        )}

        {reviews.length === 0 ? (
          <p>Non hai ancora scritto recensioni.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "12px",
                maxWidth: "700px",
              }}
            >
              {editingId === review.id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Titolo recensione"
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />

                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={editVote}
                    onChange={(e) => setEditVote(e.target.value)}
                    placeholder="Voto"
                    style={{
                      width: "120px",
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      display: "block",
                    }}
                  />

                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Descrizione recensione"
                    rows="4"
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      resize: "vertical",
                    }}
                  />

                  <button
                    onClick={() => handleSaveEdit(review.id)}
                    style={{ marginRight: "10px" }}
                  >
                    Salva
                  </button>

                  <button onClick={handleCancelEdit}>
                    Annulla
                  </button>
                </>
              ) : (
                <>
                  <h3 style={{ margin: "0 0 8px 0" }}>{review.title}</h3>

                  <p style={{ margin: "0 0 8px 0" }}>
                    <strong>Prodotto:</strong> {review.product_name}
                  </p>

                  <p style={{ margin: "0 0 8px 0" }}>
                    <strong>Voto:</strong> {review.vote}/5
                  </p>

                  <p style={{ margin: "0 0 8px 0" }}>
                    <strong>Stato:</strong> {review.status}
                  </p>

                  <p style={{ margin: "0 0 12px 0", color: "#374151" }}>
                    {review.description}
                  </p>

                  <button
                    onClick={() => handleEdit(review)}
                    style={{ marginRight: "10px" }}
                  >
                    Modifica
                  </button>

                  <button onClick={() => handleDelete(review.id)}>
                    Elimina
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProfilePage;