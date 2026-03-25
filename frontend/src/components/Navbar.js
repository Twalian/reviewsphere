import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const role = user?.role;

  function handleLogout() {
    logoutUser();
    navigate("/");
  }

  return (
    <nav
      style={{
        backgroundColor: "#1e3a8a",
        color: "white",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
        fontFamily: "Arial, sans-serif",
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

      <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "15px" }}>
          Home
        </Link>

        <Link
          to="/products"
          style={{ color: "white", textDecoration: "none", fontSize: "15px" }}
        >
          Prodotti
        </Link>

        {user && (
          <Link
            to="/profile"
            style={{ color: "white", textDecoration: "none", fontSize: "15px" }}
          >
            Profilo
          </Link>
        )}

        {(role === "ADMIN" || role === "MODERATOR") && (
          <>
            <Link
              to="/moderation"
              style={{ color: "white", textDecoration: "none", fontSize: "15px" }}
            >
              Moderazione
            </Link>
            <Link
              to="/reports"
              style={{ color: "white", textDecoration: "none", fontSize: "15px" }}
            >
              Segnalazioni
            </Link>
          </>
        )}

        {role === "ADMIN" && (
          <>
            <Link
              to="/admin/dashboard"
              style={{ color: "white", textDecoration: "none", fontSize: "15px" }}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              style={{ color: "white", textDecoration: "none", fontSize: "15px" }}
            >
              Gestione Prodotti
            </Link>
            <Link
              to="/admin/add-product"
              style={{ color: "white", textDecoration: "none", fontSize: "15px" }}
            >
              Aggiungi Prodotto
            </Link>
            <Link
              to="/admin/categories"
              style={{ color: "white", textDecoration: "none", fontSize: "15px" }}
            >
              Categorie
            </Link>
            <Link
              to="/admin/users"
              style={{ color: "white", textDecoration: "none", fontSize: "15px" }}
            >
              Utenti
            </Link>
          </>
        )}

        {!user && (
          <>
            <Link
              to="/login"
              style={{ color: "white", textDecoration: "none", fontSize: "15px", fontWeight: "bold" }}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={{ color: "white", textDecoration: "none", fontSize: "15px", fontWeight: "bold" }}
            >
              Registrati
            </Link>
          </>
        )}

        {user && (
          <>
            <span style={{ fontWeight: "bold", borderLeft: "1px solid rgba(255,255,255,0.3)", paddingLeft: "20px" }}>
              {user.username}
            </span>

            <button
              onClick={handleLogout}
              style={{
                padding: "8px 14px",
                backgroundColor: "#ef4444",
                border: "none",
                borderRadius: "8px",
                color: "white",
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