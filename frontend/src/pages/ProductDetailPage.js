import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { getProducts } from "../api/products";
import {
  addReview,
  getReviewsByProduct,
  getAiSummaryByProduct,
  toggleHelpful,
  reportReview,
} from "../api/reviews";

function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSummaryRequested, setAiSummaryRequested] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [sort, setSort] = useState("newest");

  const [title, setTitle] = useState("");
  const [vote, setVote] = useState(5);
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadData();
  }, [id, sort]);

  async function loadData() {
    try {
      setMessage("");
      setMessageType("");

      const products = await getProducts();
      const foundProduct = products.find((p) => String(p.id) === String(id));

      if (!foundProduct) {
        setMessage("Prodotto non trovato.");
        setMessageType("error");
        return;
      }

      setProduct(foundProduct);

      const reviewsData = await getReviewsByProduct(id, sort);
      setReviews(reviewsData || []);
    } catch (error) {
      console.error("Errore caricamento prodotto:", error);
      setMessage("Errore durante il caricamento del prodotto.");
      setMessageType("error");
    }
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    try {
      const payload = {
        title: title.trim(),
        vote: Number(vote),
        description: description.trim(),
        product: Number(id),
      };

      await addReview(payload);

      setMessage("Recensione inviata con successo! Sarà visibile una volta approvata.");
      setMessageType("success");
      setTitle("");
      setVote(5);
      setDescription("");

      loadData();
    } catch (error) {
      console.error("Errore invio recensione:", error);

      if (error.status === 409 || error.message?.includes("409")) {
        setMessage("Hai già inviato una recensione per questo prodotto.");
      } else {
        setMessage(error.message || "Errore durante l'invio della recensione.");
      }
      setMessageType("error");
    }
  }

  async function handleHelpful(reviewId) {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
            ...review,
            user_marked_helpful: !review.user_marked_helpful,
            helpful_count: review.user_marked_helpful
              ? Math.max((review.helpful_count ?? 0) - 1, 0)
              : (review.helpful_count ?? 0) + 1,
          }
          : review
      )
    );

    try {
      await toggleHelpful(reviewId);
    } catch (error) {
      console.error("Errore helpful vote:", error);
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? {
              ...review,
              user_marked_helpful: !review.user_marked_helpful,
              helpful_count: review.user_marked_helpful
                ? (review.helpful_count ?? 0) + 1
                : Math.max((review.helpful_count ?? 0) - 1, 0),
            }
            : review
        )
      );
    }
  }

  async function handleReport(reviewId) {
    const reason = window.prompt("Scrivi il motivo della segnalazione:");

    if (!reason || !reason.trim()) return;

    try {
      await reportReview(reviewId, reason.trim());
      setMessage("Segnalazione inviata con successo.");
      setMessageType("success");
    } catch (error) {
      console.error("Errore segnalazione recensione:", error);
      setMessage(error.message || "Errore durante la segnalazione.");
      setMessageType("error");
    }
  }

  async function handleLoadAiSummary() {
    setAiSummaryLoading(true);
    setAiSummaryRequested(true);
    try {
      const summaryData = await getAiSummaryByProduct(id);
      setAiSummary(summaryData);
    } catch (error) {
      console.error("Errore AI summary:", error);
      setAiSummary(null);
    } finally {
      setAiSummaryLoading(false);
    }
  }

  function renderStars(value) {
    return "⭐".repeat(Number(value || 0));
  }

  return (
    <div style={{ backgroundColor: "#f9fafb", minHeight: "100vh", fontFamily: "'Inter', Arial, sans-serif", paddingBottom: "60px" }}>
      <Navbar />

      <div style={{ padding: "40px 5%", maxWidth: "1200px", margin: "0 auto" }}>

        {message && (
          <div
            style={{
              marginBottom: "30px",
              padding: "16px 20px",
              borderRadius: "12px",
              backgroundColor: messageType === "success" ? "#dcfce7" : "#fee2e2",
              color: messageType === "success" ? "#166534" : "#991b1b",
              fontWeight: "bold",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              border: `1px solid ${messageType === "success" ? "#bbf7d0" : "#fecaca"}`
            }}
          >
            {message}
          </div>
        )}

        {product && (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "24px",
              padding: "40px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              display: "flex",
              gap: "50px",
              alignItems: "stretch",
              marginBottom: "40px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1", minWidth: "300px", maxWidth: "450px", display: "flex", flexDirection: "column" }}>
              <img
                src={product.image_url || "https://via.placeholder.com/400x400"}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "auto",
                  aspectRatio: "1/1",
                  borderRadius: "20px",
                  objectFit: "cover",
                  backgroundColor: "#f3f4f6",
                  boxShadow: "0 10px 20px -5px rgba(0,0,0,0.1)"
                }}
              />
            </div>

            <div style={{ flex: "2", minWidth: "300px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "inline-block", marginBottom: "16px" }}>
                <span style={{ backgroundColor: "#1e3a8a", color: "white", padding: "6px 16px", borderRadius: "999px", fontWeight: "bold", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {product.brand}
                </span>
              </div>

              <h1 style={{ margin: "0 0 20px 0", fontSize: "40px", fontWeight: "900", color: "#111827", lineHeight: "1.1" }}>
                {product.name}
              </h1>

              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px", flexWrap: "wrap" }}>
                <div style={{ fontSize: "36px", fontWeight: "900", color: "#111827" }}>
                  {product.price} €
                </div>

                <span
                  style={{
                    padding: "8px 16px",
                    borderRadius: "999px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    backgroundColor:
                      product.status === "AVAILABLE" ? "#ecfdf5" :
                        product.status === "OUT_OF_STOCK" ? "#fffbeb" :
                          "#fef2f2",
                    color:
                      product.status === "AVAILABLE" ? "#047857" :
                        product.status === "OUT_OF_STOCK" ? "#b45309" :
                          "#b91c1c",
                  }}
                >
                  {product.status === "OUT_OF_STOCK" ? "Non disponibile" :
                    product.status === "DISCONTINUED" ? "Fuori produzione" :
                      "Disponibile"}
                </span>

                {product.category && (
                  <span style={{ color: "#6b7280", fontSize: "16px", fontWeight: "bold", display: "flex", alignItems: "center" }}>
                    <span style={{ color: "#d1d5db", marginRight: "10px" }}>|</span> {product.category}
                  </span>
                )}
              </div>

              <div style={{ padding: "30px", backgroundColor: "#f9fafb", borderRadius: "20px", flex: 1, border: "1px solid #f3f4f6" }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "20px", color: "#111827", fontWeight: "800" }}>Panoramica</h3>
                <p style={{ margin: 0, lineHeight: "1.8", color: "#4b5563", fontSize: "17px" }}>
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "40px", alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* LEFT COLUMN: Actions & Summary */}
          <div style={{ flex: "1", minWidth: "300px" }}>

            <div
              style={{
                backgroundColor: "white",
                borderRadius: "24px",
                padding: "30px",
                marginBottom: "30px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                background: "linear-gradient(145deg, #ffffff, #f0f9ff)",
                border: "1px solid #e0f2fe"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: aiSummaryRequested ? "20px" : 0 }}>
                <div>
                  <h2 style={{ margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "10px", color: "#1e3a8a", fontSize: "24px", fontWeight: "900" }}>
                    <span style={{ fontSize: "28px" }}>🤖</span> Sintesi Intelligente
                  </h2>
                  {!aiSummaryRequested && (
                    <p style={{ color: "#3b82f6", margin: 0, fontSize: "15px", lineHeight: "1.5" }}>
                      Lascia che l'AI legga tutte le recensioni per te ed estrapoli pro e contro.
                    </p>
                  )}
                </div>

                {!aiSummaryRequested && (
                  <button
                    onClick={handleLoadAiSummary}
                    style={{
                      padding: "14px 24px",
                      backgroundColor: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "16px",
                      boxShadow: "0 6px 12px -2px rgba(37, 99, 235, 0.3)",
                      transition: "all 0.2s"
                    }}
                  >
                    Genera Sintesi AI
                  </button>
                )}
              </div>

              {aiSummaryLoading && (
                <div style={{ textAlign: "center", padding: "20px", color: "#2563eb", fontWeight: "bold", fontSize: "16px" }}>
                  <div style={{ fontSize: "30px", marginBottom: "10px", animation: "spin 2s linear infinite" }}>⏳</div>
                  Analisi delle opinioni in corso...
                </div>
              )}

              {aiSummaryRequested && !aiSummaryLoading && (
                aiSummary ? (
                  <div style={{ color: "#1e3a8a" }}>
                    {aiSummary.summary && (
                      <p style={{ marginBottom: "24px", lineHeight: "1.7", fontSize: "16px", backgroundColor: "white", padding: "20px", borderRadius: "16px", border: "1px solid #bfdbfe", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                        {aiSummary.summary}
                      </p>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      {aiSummary.pros && aiSummary.pros.length > 0 && (
                        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "16px", border: "1px solid #a7f3d0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                          <strong style={{ display: "flex", alignItems: "center", gap: "8px", color: "#059669", marginBottom: "12px", fontSize: "18px" }}>
                            <span>👍</span> Punti di forza
                          </strong>
                          <ul style={{ margin: 0, paddingLeft: "15px", color: "#374151", lineHeight: "1.6", listStyleType: "none" }}>
                            {aiSummary.pros.map((pro, index) => (
                              <li key={index} style={{ marginBottom: "8px", position: "relative", paddingLeft: "20px" }}>
                                <span style={{ position: "absolute", left: 0, color: "#10b981" }}>✓</span> {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {aiSummary.cons && aiSummary.cons.length > 0 && (
                        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "16px", border: "1px solid #fecaca", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                          <strong style={{ display: "flex", alignItems: "center", gap: "8px", color: "#dc2626", marginBottom: "12px", fontSize: "18px" }}>
                            <span>👎</span> Punti critici
                          </strong>
                          <ul style={{ margin: 0, paddingLeft: "15px", color: "#374151", lineHeight: "1.6", listStyleType: "none" }}>
                            {aiSummary.cons.map((con, index) => (
                              <li key={index} style={{ marginBottom: "8px", position: "relative", paddingLeft: "20px" }}>
                                <span style={{ position: "absolute", left: 0, color: "#ef4444" }}>✕</span> {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "20px", backgroundColor: "white", borderRadius: "12px", textAlign: "center", color: "#6b7280" }}>
                    Riepilogo AI non disponibile per questo prodotto (servono più recensioni).
                  </div>
                )
              )}
            </div>

            {user?.role === "CLIENT" && (
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "24px",
                  padding: "30px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                  position: "sticky",
                  top: "20px"
                }}
              >
                <h3 style={{ margin: "0 0 20px 0", fontSize: "22px", color: "#111827", fontWeight: "900" }}>La tua opinione</h3>
                <p style={{ color: "#6b7280", margin: "0 0 20px 0", fontSize: "15px", lineHeight: "1.5" }}>Condividi la tua esperienza con la community di ReviewSphere.</p>

                <form
                  onSubmit={handleSubmitReview}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#374151", fontSize: "14px" }}>Titolo recensione</label>
                    <input
                      type="text"
                      placeholder="Molto comodo..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "12px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "#f9fafb",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#374151", fontSize: "14px" }}>Voto (1-5)</label>
                    <select
                      value={vote}
                      onChange={(e) => setVote(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "12px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "#f9fafb",
                        boxSizing: "border-box",
                        cursor: "pointer",
                        fontWeight: "bold",
                        color: "#111827"
                      }}
                    >
                      <option value={1}>⭐ 1 - Pessimo</option>
                      <option value={2}>⭐⭐ 2 - Scarso</option>
                      <option value={3}>⭐⭐⭐ 3 - Ok</option>
                      <option value={4}>⭐⭐⭐⭐ 4 - Ottimo</option>
                      <option value={5}>⭐⭐⭐⭐⭐ 5 - Perfetto</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#374151", fontSize: "14px" }}>Testo</label>
                    <textarea
                      placeholder="Racconta i dettagli..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows="4"
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "12px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "#f9fafb",
                        resize: "vertical",
                        boxSizing: "border-box",
                        lineHeight: "1.5"
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: "16px",
                      backgroundColor: "#111827",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "16px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
                      marginTop: "10px"
                    }}
                  >
                    Pubblica Recensione
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Reviews List */}
          <div style={{ flex: "2", minWidth: "300px" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "28px", fontWeight: "900", color: "#111827", margin: 0 }}>Recensioni ({reviews.length})</h2>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontWeight: "bold", fontSize: "14px", color: "#6b7280", display: "none" }}>Ordina</span>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white",
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: "#374151"
                  }}
                >
                  <option value="newest">Più recenti</option>
                  <option value="oldest">Meno recenti</option>
                  <option value="highest">Voti alti</option>
                  <option value="lowest">Voti bassi</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {reviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 20px", backgroundColor: "white", borderRadius: "24px", color: "#6b7280", fontSize: "18px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                  Non ci sono ancora recensioni per questo prodotto.<br />
                  <br />✨ Sii tu il primo!
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "20px",
                      padding: "30px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", color: "#4b5563", fontWeight: "900", fontSize: "20px", border: "2px solid #e5e7eb" }}>
                          {review.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: "800", color: "#111827", fontSize: "16px" }}>{review.username}</div>
                          <div style={{ color: "#f59e0b", fontSize: "13px", letterSpacing: "3px", marginTop: "4px" }}>
                            {renderStars(review.vote)}
                          </div>
                        </div>
                      </div>

                      {/* Status Badge only for Admin/Moderator */}
                      {(user?.role === "ADMIN" || user?.role === "MODERATOR") && (
                        <div
                          style={{
                            padding: "6px 12px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            backgroundColor:
                              review.status === "APPROVED" ? "#dcfce7" :
                                review.status === "PENDING" ? "#fef9c3" :
                                  "#fee2e2",
                            color:
                              review.status === "APPROVED" ? "#166534" :
                                review.status === "PENDING" ? "#854d0e" :
                                  "#991b1b",
                          }}
                        >
                          {review.status}
                        </div>
                      )}
                    </div>

                    <h4 style={{ margin: "0 0 12px 0", fontSize: "20px", color: "#111827", fontWeight: "800", lineHeight: "1.4" }}>"{review.title}"</h4>

                    <p style={{ margin: "0 0 24px 0", color: "#4b5563", lineHeight: "1.7", fontSize: "16px" }}>
                      {review.description}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", borderTop: "1px solid #f3f4f6", paddingTop: "24px" }}>
                      <div
                        style={{
                          ...(review.sentiment
                            ? review.sentiment === "positive"
                              ? { backgroundColor: "#ecfdf5", color: "#047857" }
                              : review.sentiment === "negative"
                                ? { backgroundColor: "#fef2f2", color: "#b91c1c" }
                                : { backgroundColor: "#fffbeb", color: "#b45309" }
                            : { backgroundColor: "#f3f4f6", color: "#4b5563" }),
                          padding: "8px 16px",
                          borderRadius: "999px",
                          fontSize: "13px",
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        {review.sentiment === "positive" ? "✨" : review.sentiment === "negative" ? "⚠️" : "⚖️"}
                        <span style={{ opacity: 0.8 }}>AI Sentiment:</span> <span style={{ textTransform: "capitalize" }}>{review.sentiment || "N/A"}</span>
                      </div>

                      <div style={{ display: "flex", gap: "12px" }}>
                        <button
                          onClick={() => handleHelpful(review.id)}
                          style={{
                            padding: "10px 16px",
                            borderRadius: "10px",
                            border: review.user_marked_helpful ? "2px solid #3b82f6" : "1px solid #d1d5db",
                            backgroundColor: review.user_marked_helpful ? "#eff6ff" : "white",
                            color: review.user_marked_helpful ? "#1d4ed8" : "#4b5563",
                            cursor: "pointer",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "all 0.2s ease"
                          }}
                        >
                          👍 Utile ({review.helpful_count ?? 0})
                        </button>

                        {user?.role === "CLIENT" && user?.username !== review.username && (
                          <button
                            onClick={() => handleReport(review.id)}
                            style={{
                              padding: "10px 16px",
                              borderRadius: "10px",
                              border: "1px solid #fca5a5",
                              backgroundColor: "#fef2f2",
                              color: "#ef4444",
                              cursor: "pointer",
                              fontWeight: "bold",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              transition: "all 0.2s ease"
                            }}
                          >
                            🚩 Segnala
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;