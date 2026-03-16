import Navbar from "../components/Navbar";

function ModerationPage() {
  const reviews = [
    {
      id: 1,
      product: "iPhone 14",
      user: "cliente1",
      rating: 2,
      title: "Batteria deludente",
      status: "PENDING",
    },
    {
      id: 2,
      product: "Galaxy S24",
      user: "cliente2",
      rating: 5,
      title: "Ottimo smartphone",
      status: "APPROVED",
    },
    {
      id: 3,
      product: "Dell XPS 13",
      user: "cliente3",
      rating: 1,
      title: "Troppo costoso",
      status: "HIDDEN",
    },
  ];

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

        {reviews.map((review) => (
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
              <strong>Prodotto:</strong> {review.product}
            </p>

            <p>
              <strong>Utente:</strong> {review.user}
            </p>

            <p>
              <strong>Voto:</strong> {review.rating}/5
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
                onClick={() => alert("Recensione approvata")}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#15803d",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                }}
              >
                Approva
              </button>

              <button
                onClick={() => alert("Recensione nascosta")}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#b91c1c",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                }}
              >
                Nascondi
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModerationPage;