import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getReviewsForModeration,
  approveReview,
  hideReview,
} from "../api/moderation";

function ModerationPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await getReviewsForModeration();
        setReviews(data);
      } catch (error) {
        setError("Errore nel caricamento delle recensioni");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  async function handleApprove(reviewId) {
    try {
      const updatedReview = await approveReview(reviewId);

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId ? updatedReview : review
        )
      );
    } catch (error) {
      alert("Errore durante l'approvazione della recensione");
      console.error(error);
    }
  }

  async function handleHide(reviewId) {
    try {
      const updatedReview = await hideReview(reviewId);

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId ? updatedReview : review
        )
      );
    } catch (error) {
      alert("Errore durante il nascondimento della recensione");
      console.error(error);
    }
  }

  const totalReviews = reviews.length;
  const approvedReviews = reviews.filter(
    (review) => review.status === "APPROVED"
  ).length;
  const pendingReviews = reviews.filter(
    (review) => review.status === "PENDING"
  ).length;
  const hiddenReviews = reviews.filter(
    (review) => review.status === "HIDDEN"
  ).length;

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ marginBottom: "10px" }}>Moderazione Recensioni</h1>

        <p style={{ color: "#555", marginBottom: "20px" }}>
          Pannello moderatore per approvare o nascondere recensioni
        </p>

        {loading && <p>Caricamento recensioni...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <>
            <div
              style={{
                display: "flex",
                gap: "20px",
                marginBottom: "30px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  background: "#dbeafe",
                  padding: "12px 18px",
                  borderRadius: "10px",
                }}
              >
                Totali: <strong>{totalReviews}</strong>
              </div>

              <div
                style={{
                  background: "#dcfce7",
                  padding: "12px 18px",
                  borderRadius: "10px",
                }}
              >
                Approved: <strong>{approvedReviews}</strong>
              </div>

              <div
                style={{
                  background: "#fef9c3",
                  padding: "12px 18px",
                  borderRadius: "10px",
                }}
              >
                Pending: <strong>{pendingReviews}</strong>
              </div>

              <div
                style={{
                  background: "#fee2e2",
                  padding: "12px 18px",
                  borderRadius: "10px",
                }}
              >
                Hidden: <strong>{hiddenReviews}</strong>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p>Nessuna recensione disponibile.</p>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    backgroundColor: "#fff",
                  }}
                >
                  <h3 style={{ margin: "0 0 10px 0" }}>{review.title}</h3>

                  <p>
                    <strong>Prodotto:</strong>{" "}
                    {review.product_name || review.product?.name || review.product}
                  </p>

                  <p>
                    <strong>Utente:</strong>{" "}
                    {review.username || review.user_username || review.user?.username || review.user}
                  </p>

                  <p>
                    <strong>Voto:</strong> {review.vote || review.rating}/5
                  </p>

                  <p>
                    <strong>Stato:</strong>{" "}
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "8px",
                        color: "white",
                        fontWeight: "bold",
                        backgroundColor:
                          review.status === "APPROVED"
                            ? "#15803d"
                            : review.status === "HIDDEN"
                            ? "#b91c1c"
                            : "#ca8a04",
                      }}
                    >
                      {review.status}
                    </span>
                  </p>

                  <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleApprove(review.id)}
                      disabled={review.status === "APPROVED"}
                      style={{
                        padding: "10px 16px",
                        backgroundColor:
                          review.status === "APPROVED" ? "#86efac" : "#15803d",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor:
                          review.status === "APPROVED" ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                        opacity: review.status === "APPROVED" ? 0.7 : 1,
                      }}
                    >
                      Approva
                    </button>

                    <button
                      onClick={() => handleHide(review.id)}
                      disabled={review.status === "HIDDEN"}
                      style={{
                        padding: "10px 16px",
                        backgroundColor:
                          review.status === "HIDDEN" ? "#fca5a5" : "#b91c1c",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        cursor:
                          review.status === "HIDDEN" ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                        opacity: review.status === "HIDDEN" ? 0.7 : 1,
                      }}
                    >
                      Nascondi
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ModerationPage;