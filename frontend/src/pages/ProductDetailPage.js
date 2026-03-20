import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { addReview, getReviewsByProduct } from "../api/reviews";

function ProductDetailPage() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vote, setVote] = useState("");
  const [message, setMessage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await getReviewsByProduct(id);
        setReviews(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingReviews(false);
      }
    }

    loadReviews();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const newReview = await addReview({
        product: id,
        title,
        description,
        vote: Number(vote),
      });

      setMessage("Recensione inviata con successo!");
      setTitle("");
      setDescription("");
      setVote("");
      setReviews((prevReviews) => [newReview, ...prevReviews]);
    } catch (error) {
      setMessage("Errore durante l'invio della recensione");
      console.error(error);
    }
  }

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
        <h1>Dettaglio Prodotto</h1>

        <p>Product ID: {id}</p>

        <h2 style={{ marginTop: "30px" }}>Scrivi una recensione</h2>

        {message && (
          <p
            style={{
              marginBottom: "15px",
              color: message.includes("successo") ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
          <div style={{ marginBottom: "15px" }}>
            <label>Titolo</label>
            <input
              type="text"
              placeholder="Titolo recensione"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Descrizione</label>
            <textarea
              placeholder="Scrivi la tua recensione"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Voto</label>
            <input
              type="number"
              min="1"
              max="5"
              value={vote}
              onChange={(e) => setVote(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "12px 20px",
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

        <h2 style={{ marginTop: "40px", marginBottom: "20px" }}>
          Recensioni del prodotto
        </h2>

        {loadingReviews ? (
          <p>Caricamento recensioni...</p>
        ) : reviews.length === 0 ? (
          <p>Nessuna recensione per questo prodotto.</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "16px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0" }}>{review.title}</h3>

              <p>
                <strong>Utente:</strong>{" "}
                {review.username || review.user_username || review.user?.username || review.user}
              </p>

              <p>
                <strong>Voto:</strong> {review.vote || review.rating}/5
              </p>

              <p>
                <strong>Descrizione:</strong> {review.description}
              </p>

              <p>
                <strong>Stato:</strong> {review.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;