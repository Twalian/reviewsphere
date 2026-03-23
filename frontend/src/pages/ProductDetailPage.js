import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getProducts } from "../api/products";
import { getReviewsByProduct, addReview } from "../api/reviews";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vote, setVote] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const products = await getProducts();

        const selectedProduct = products.find((p) => p.id === Number(id));

        setProduct(selectedProduct);

        const reviewData = await getReviewsByProduct(id);
        setReviews(reviewData);
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await addReview({
        product: Number(id),
        title,
        description,
        vote: Number(vote),
      });

      setMessage(
        "Recensione inviata con successo! Sarà visibile dopo la moderazione."
      );
      setMessageType("success");
      setTitle("");
      setDescription("");
      setVote("");

      const updatedReviews = await getReviewsByProduct(id);
      setReviews(updatedReviews);
    } catch (error) {
      setMessage("Errore durante l'invio della recensione.");
      setMessageType("error");
      console.error(error);
    }
  }

  const approvedReviews = reviews.filter(
    (review) => review.status === "APPROVED"
  );

  let averageRating = 0;

  if (approvedReviews.length > 0) {
    const totalVotes = approvedReviews.reduce(
      (sum, review) => sum + review.vote,
      0
    );

    averageRating = (totalVotes / approvedReviews.length).toFixed(1);
  }

  function getMessageStyle() {
    if (messageType === "success") {
      return {
        backgroundColor: "#dcfce7",
        color: "#166534",
        border: "1px solid #86efac",
      };
    }

    return {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fca5a5",
    };
  }

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
        <button
          onClick={() => navigate("/products")}
          style={{
            marginBottom: "20px",
            padding: "10px 16px",
            backgroundColor: "#e5e7eb",
            color: "#111827",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← Torna ai prodotti
        </button>

        {!product && <p>Caricamento prodotto...</p>}

        {product && (
          <>
            <h1>{product.name}</h1>

            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                style={{
                  width: "100%",
                  maxWidth: "420px",
                  height: "auto",
                  borderRadius: "12px",
                  marginTop: "16px",
                  marginBottom: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  objectFit: "cover",
                }}
              />
            )}

            <p style={{ marginTop: "10px", fontSize: "16px", color: "#374151" }}>
              <strong>Descrizione:</strong>{" "}
              {product.description || "Descrizione non disponibile"}
            </p>

            <p>
              <strong>Marca:</strong> {product.brand}
            </p>

            <p>
              <strong>Prezzo:</strong> {product.price}
            </p>

            <p>
              <strong>Media recensioni:</strong>{" "}
              {approvedReviews.length > 0
                ? `⭐ ${averageRating} / 5 (${approvedReviews.length} recensioni)`
                : "Nessuna recensione"}
            </p>

            <h2 style={{ marginTop: "40px" }}>Scrivi una recensione</h2>

            {message && (
              <div
                style={{
                  ...getMessageStyle(),
                  padding: "12px 16px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  fontWeight: "bold",
                  maxWidth: "600px",
                }}
              >
                {message}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{
                maxWidth: "600px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                marginBottom: "40px",
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
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                }}
              />

              <textarea
                placeholder="Scrivi la tua recensione"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="4"
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  resize: "vertical",
                }}
              />

              <input
                type="number"
                min="1"
                max="5"
                placeholder="Voto da 1 a 5"
                value={vote}
                onChange={(e) => setVote(e.target.value)}
                required
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  width: "160px",
                }}
              />

              <button
                type="submit"
                style={{
                  width: "220px",
                  padding: "12px",
                  backgroundColor: "#1e3a8a",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Invia recensione
              </button>
            </form>

            <h2 style={{ marginTop: "40px" }}>Recensioni</h2>

            {approvedReviews.length === 0 && (
              <p>Nessuna recensione approvata per questo prodotto.</p>
            )}

            {approvedReviews.map((review) => (
              <div
                key={review.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "16px",
                  marginTop: "12px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <h3>{review.title}</h3>

                <p>
                  <strong>Utente:</strong>{" "}
                  {review.username ||
                    review.user_username ||
                    review.user?.username ||
                    review.user}
                </p>

                <p>
                  <strong>Voto:</strong> {"⭐".repeat(review.vote)}
                </p>

                <p>{review.description}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;