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

      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
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

        {user && (
          <>
            <span style={{ fontWeight: "bold" }}>
              {user.username} ({user.role})
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