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
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [vote, setVote] = useState(5);
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setMessage("");

      const products = await getProducts();
      const foundProduct = products.find((p) => String(p.id) === String(id));

      if (!foundProduct) {
        setMessage("Prodotto non trovato.");
        return;
      }

      setProduct(foundProduct);

      const reviewsData = await getReviewsByProduct(id);
      setReviews(reviewsData || []);

      try {
        const summaryData = await getAiSummaryByProduct(id);
        setAiSummary(summaryData);
      } catch (error) {
        console.error("Errore AI summary:", error);
        setAiSummary(null);
      }
    } catch (error) {
      console.error("Errore caricamento prodotto:", error);
      setMessage("Errore durante il caricamento del prodotto.");
    }
  }

  async function handleSubmitReview(e) {
    e.preventDefault();

    try {
      const payload = {
        title: title.trim(),
        vote: Number(vote),
        description: description.trim(),
        product: Number(id),
      };

      await addReview(payload);

      setMessage("Recensione inviata con successo.");
      setTitle("");
      setVote(5);
      setDescription("");

      loadData();
    } catch (error) {
      console.error("Errore invio recensione:", error);
      setMessage(error.message || "Errore durante l'invio della recensione.");
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
    } catch (error) {
      console.error("Errore segnalazione recensione:", error);
      setMessage(error.message || "Errore durante la segnalazione.");
    }
  }

  function renderStars(value) {
    return "⭐".repeat(Number(value || 0));
  }

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
        {message && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              borderRadius: "10px",
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              fontWeight: "bold",
              maxWidth: "900px",
            }}
          >
            {message}
          </div>
        )}

        {product && (
          <div
            style={{
              display: "flex",
              gap: "30px",
              alignItems: "flex-start",
              marginBottom: "30px",
              flexWrap: "wrap",
            }}
          >
            <img
              src={product.image_url || "https://via.placeholder.com/320x220"}
              alt={product.name}
              style={{
                width: "320px",
                maxWidth: "100%",
                borderRadius: "12px",
                objectFit: "cover",
                border: "1px solid #ddd",
              }}
            />

            <div style={{ maxWidth: "700px" }}>
              <h1 style={{ marginTop: 0 }}>{product.name}</h1>

              <p style={{ color: "#4b5563", marginBottom: "8px" }}>
                <strong>Marca:</strong> {product.brand}
              </p>

              <p style={{ color: "#4b5563", marginBottom: "8px" }}>
                <strong>Prezzo:</strong> {product.price} €
              </p>

              <p style={{ color: "#4b5563", marginBottom: "8px" }}>
                <strong>Categoria:</strong> {product.category}
              </p>

              <p style={{ color: "#4b5563", marginBottom: "16px" }}>
                <strong>Stato:</strong> {product.status}
              </p>

              <p style={{ lineHeight: "1.6", color: "#111827" }}>
                {product.description}
              </p>
            </div>
          </div>
        )}

        {user?.role === "CLIENT" && (
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "30px",
              maxWidth: "900px",
              backgroundColor: "#f9fafb",
            }}
          >
            <h2>Scrivi una recensione</h2>

            <form
              onSubmit={handleSubmitReview}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <input
                type="text"
                placeholder="Titolo recensione"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />

              <select
                value={vote}
                onChange={(e) => setVote(e.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  width: "180px",
                }}
              >
                <option value={1}>1 stella</option>
                <option value={2}>2 stelle</option>
                <option value={3}>3 stelle</option>
                <option value={4}>4 stelle</option>
                <option value={5}>5 stelle</option>
              </select>

              <textarea
                placeholder="Scrivi la tua recensione"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="4"
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  resize: "vertical",
                }}
              />

              <button
                type="submit"
                style={{
                  width: "220px",
                  padding: "12px",
                  backgroundColor: "#065f46",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Invia recensione
              </button>
            </form>
          </div>
        )}

        <div
          style={{
            border: "1px solid #dbeafe",
            backgroundColor: "#eff6ff",
            borderRadius: "12px",
            padding: "18px",
            marginBottom: "30px",
            maxWidth: "900px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>🤖 AI Summary recensioni</h2>

          {aiSummary ? (
            <>
              {aiSummary.summary && (
                <p style={{ marginBottom: "12px" }}>{aiSummary.summary}</p>
              )}

              {aiSummary.pros && aiSummary.pros.length > 0 && (
                <div style={{ marginBottom: "10px" }}>
                  <strong>Pro:</strong>
                  <ul>
                    {aiSummary.pros.map((pro, index) => (
                      <li key={index}>{pro}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aiSummary.cons && aiSummary.cons.length > 0 && (
                <div>
                  <strong>Contro:</strong>
                  <ul>
                    {aiSummary.cons.map((con, index) => (
                      <li key={index}>{con}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p style={{ color: "#6b7280", marginBottom: 0 }}>
              Al momento il riepilogo AI non è disponibile per questo prodotto.
            </p>
          )}
        </div>

        <h2>Recensioni</h2>

        {reviews.length === 0 ? (
          <p>Non ci sono ancora recensioni per questo prodotto.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "14px",
                maxWidth: "900px",
                backgroundColor: "white",
              }}
            >
              <h3 style={{ margin: "0 0 8px 0" }}>{review.title}</h3>

              <p style={{ margin: "0 0 6px 0", color: "#4b5563" }}>
                <strong>Autore:</strong> {review.username}
              </p>

              <p
                style={{
                  margin: "0 0 6px 0",
                  color: "#f59e0b",
                  fontSize: "18px",
                }}
              >
                {renderStars(review.vote)} ({review.vote}/5)
              </p>

              {review.status && (
                <p style={{ margin: "0 0 6px 0", color: "#4b5563" }}>
                  <strong>Stato:</strong> {review.status}
                </p>
              )}

              <p style={{ margin: "10px 0 12px 0", color: "#111827" }}>
                {review.description}
              </p>

              <div
                style={{
                  ...(review.sentiment
                    ? review.sentiment === "positive"
                      ? { backgroundColor: "#dcfce7", color: "#166534" }
                      : review.sentiment === "negative"
                      ? { backgroundColor: "#fee2e2", color: "#991b1b" }
                      : { backgroundColor: "#fef9c3", color: "#854d0e" }
                    : { backgroundColor: "#e5e7eb", color: "#374151" }),
                  display: "inline-block",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginBottom: "12px",
                }}
              >
                Sentiment AI: {review.sentiment || "non disponibile"}
              </div>

              <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleHelpful(review.id)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    backgroundColor: review.user_marked_helpful
                      ? "#dbeafe"
                      : "white",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  👍 Utile ({review.helpful_count ?? 0})
                </button>

                {user?.role === "CLIENT" && user?.username !== review.username && (
                  <button
                    onClick={() => handleReport(review.id)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      backgroundColor: "white",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    🚩 Segnala
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;