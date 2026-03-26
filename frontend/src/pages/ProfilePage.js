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
  const [messageType, setMessageType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editVote, setEditVote] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, reviewId: null });

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
      setMessageType("success");
      handleCancelEdit();
    } catch (error) {
      console.error("Errore modifica recensione", error);
      setMessage(error.message || "Errore durante la modifica della recensione.");
    }
  }

  function openDeleteModal(reviewId) {
    setDeleteModal({ isOpen: true, reviewId });
  }

  function closeDeleteModal() {
    setDeleteModal({ isOpen: false, reviewId: null });
  }

  async function handleConfirmDelete() {
    if (!deleteModal.reviewId) return;
    try {
      await deleteReview(deleteModal.reviewId);
      setReviews((prev) => prev.filter((review) => review.id !== deleteModal.reviewId));
      setMessage("Recensione eliminata con successo.");
      setMessageType("success");
    } catch (error) {
      console.error("Errore eliminazione recensione", error);
      setMessage(error.message || "Errore durante l'eliminazione della recensione.");
      setMessageType("error");
    }
    closeDeleteModal();
  }

  async function handleDelete(reviewId) {
    openDeleteModal(reviewId);
  }

  function renderStars(value) {
    return "⭐".repeat(Number(value || 0));
  }

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ 
        padding: "40px 20px", 
        fontFamily: "'Inter', Arial, sans-serif", 
        maxWidth: "900px", 
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        
        {/* User Profile Card */}
        <div style={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
          marginBottom: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center"
        }}>
          <div style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: "#2563eb",
            color: "white",
            fontSize: "36px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)"
          }}>
            {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
          
          <h1 style={{ margin: "0 0 10px 0", fontSize: "28px", color: "#1e293b" }}>{user?.username}</h1>
          <p style={{ margin: "0 0 16px 0", color: "#64748b", fontSize: "16px" }}>{user?.email}</p>
          
          <div style={{
            padding: "6px 16px",
            backgroundColor: "#dbeafe",
            color: "#1e40af",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: "600",
            letterSpacing: "0.5px"
          }}>
            {user?.role}
          </div>
        </div>

        <div style={{ width: "100%", textAlign: "left", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "24px", color: "#1e293b", margin: 0 }}>Le mie recensioni ({reviews.length})</h2>
        </div>

        {message && (
          <div style={{
            width: "100%",
            marginBottom: "24px",
            padding: "16px 20px",
            borderRadius: "12px",
            backgroundColor: messageType === "success" ? "#dcfce7" : messageType === "error" ? "#fee2e2" : "#dcfce7",
            color: messageType === "success" ? "#166534" : messageType === "error" ? "#991b1b" : "#166534",
            fontWeight: "600",
            border: `1px solid ${messageType === "success" ? "#bbf7d0" : messageType === "error" ? "#fecaca" : "#bbf7d0"}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span>{message}</span>
            <button
              onClick={() => { setMessage(""); setMessageType(""); }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "20px",
                color: messageType === "success" ? "#166534" : messageType === "error" ? "#991b1b" : "#166534"
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000
            }}
            onClick={closeDeleteModal}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "30px",
                width: "90%",
                maxWidth: "400px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ margin: "0 0 16px 0", fontSize: "20px", color: "#111827", fontWeight: "900" }}>
                Conferma eliminazione
              </h3>
              <p style={{ color: "#4b5563", margin: "0 0 24px 0" }}>
                Sei sicuro di voler eliminare questa recensione? L'azione non può essere annullata.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  onClick={closeDeleteModal}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white",
                    color: "#4b5563",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px"
                  }}
                >
                  Annulla
                </button>
                <button
                  onClick={handleConfirmDelete}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "#ef4444",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px"
                  }}
                >
                  Elimina
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
          {reviews.length === 0 ? (
            <div style={{
              padding: "40px",
              textAlign: "center",
              backgroundColor: "#fff",
              borderRadius: "16px",
              border: "1px dashed #cbd5e1",
              color: "#64748b"
            }}>
              Non hai ancora scritto recensioni. Esplora i prodotti e condividi la tua opinione!
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                border: "1px solid #f1f5f9",
                transition: "transform 0.2s ease"
              }}>
                {editingId === review.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Titolo recensione"
                      style={{ padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "16px", outline: "none" }}
                    />
                    <select
                      value={editVote}
                      onChange={(e) => setEditVote(e.target.value)}
                      style={{ padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "16px", width: "120px", outline: "none" }}
                    >
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} stelle</option>)}
                    </select>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Descrizione recensione"
                      rows="4"
                      style={{ padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "16px", resize: "vertical", outline: "none" }}
                    />
                    <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                      <button onClick={() => handleSaveEdit(review.id)} style={{ padding: "10px 20px", backgroundColor: "#059669", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Salva</button>
                      <button onClick={handleCancelEdit} style={{ padding: "10px 20px", backgroundColor: "#e2e8f0", color: "#475569", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Annulla</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <h3 style={{ margin: 0, fontSize: "20px", color: "#0f172a" }}>{review.title}</h3>
                      <div style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        backgroundColor: review.status === "APPROVED" ? "#dcfce7" : review.status === "PENDING" ? "#fef9c3" : "#fee2e2",
                        color: review.status === "APPROVED" ? "#166534" : review.status === "PENDING" ? "#854d0e" : "#991b1b",
                      }}>
                        {review.status}
                      </div>
                    </div>
                    
                    <p style={{ margin: "0 0 10px 0", color: "#475569", fontSize: "15px" }}>
                      <strong>Di:</strong> {review.product_name}
                    </p>
                    
                    <p style={{ margin: "0 0 16px 0", color: "#f59e0b", fontSize: "18px" }}>
                      {renderStars(review.vote)}
                    </p>
                    
                    <p style={{ margin: "0 0 20px 0", color: "#334155", lineHeight: "1.6" }}>
                      {review.description}
                    </p>
                    
                    <div style={{ display: "flex", gap: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                      <button onClick={() => handleEdit(review)} style={{ padding: "8px 16px", backgroundColor: "white", color: "#3b82f6", border: "1px solid #bfdbfe", borderRadius: "8px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}>Modifica</button>
                      <button onClick={() => openDeleteModal(review.id)} style={{ padding: "8px 16px", backgroundColor: "white", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "8px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }}>Elimina</button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;