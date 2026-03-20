import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { user } = useAuth();

  const role = user?.role;

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

      <div style={{ display: "flex", gap: "18px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </Link>

        <Link
          to="/products"
          style={{ color: "white", textDecoration: "none" }}
        >
          Prodotti
        </Link>

        {(role === "ADMIN" || role === "MODERATOR") && (
          <Link
            to="/moderation"
            style={{ color: "white", textDecoration: "none" }}
          >
            Moderazione
          </Link>
        )}

        <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
          Login
        </Link>

        <Link
          to="/register"
          style={{ color: "white", textDecoration: "none" }}
        >
          Registrati
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;