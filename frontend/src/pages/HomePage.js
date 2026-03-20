import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function HomePage() {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <div>
      <Navbar />

      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(to right, #eff6ff, #dbeafe)",
          fontFamily: "Arial, sans-serif",
          padding: "40px",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            textAlign: "center",
            backgroundColor: "white",
            padding: "50px",
            borderRadius: "20px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              marginBottom: "20px",
              color: "#1e3a8a",
            }}
          >
            Benvenuto su ReviewSphere
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#555",
              marginBottom: "30px",
              lineHeight: "1.6",
            }}
          >
            La piattaforma per raccogliere, visualizzare e moderare recensioni
            sui prodotti tecnologici in modo semplice e intelligente.
          </p>

          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/products"
              style={{
                padding: "14px 24px",
                backgroundColor: "#1e3a8a",
                color: "white",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Vai ai prodotti
            </Link>

            {!user && (
              <Link
                to="/login"
                style={{
                  padding: "14px 24px",
                  backgroundColor: "white",
                  color: "#1e3a8a",
                  border: "2px solid #1e3a8a",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Accedi
              </Link>
            )}

            {(role === "MODERATOR" || role === "ADMIN") && (
              <Link
                to="/moderation"
                style={{
                  padding: "14px 24px",
                  backgroundColor: "white",
                  color: "#1e3a8a",
                  border: "2px solid #1e3a8a",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Vai alla moderazione
              </Link>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;