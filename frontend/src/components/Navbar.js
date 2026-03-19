import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { user, logoutUser } = useAuth();

  return (
    <nav
      style={{
        backgroundColor: "#1e3a8a",
        color: "white",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link
        to="/"
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        ReviewSphere
      </Link>

      <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </Link>

        <Link
          to="/products"
          style={{ color: "white", textDecoration: "none" }}
        >
          Prodotti
        </Link>

        {/* Moderation visibile solo a MODERATOR o ADMIN */}
        {user && (user.role === "MODERATOR" || user.role === "ADMIN") && (
          <Link
            to="/moderation"
            style={{ color: "white", textDecoration: "none" }}
          >
            Moderazione
          </Link>
        )}

        {/* Se utente NON loggato */}
        {!user && (
          <>
            <Link
              to="/login"
              style={{ color: "white", textDecoration: "none" }}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={{ color: "white", textDecoration: "none" }}
            >
              Registrati
            </Link>
          </>
        )}

        {/* Se utente loggato */}
        {user && (
          <>
            <span style={{ fontSize: "14px", opacity: 0.9 }}>
              {user.username} ({user.role})
            </span>

            <button
              onClick={logoutUser}
              style={{
                backgroundColor: "white",
                color: "#1e3a8a",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;