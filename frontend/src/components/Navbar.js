import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [adminOpen, setAdminOpen] = useState(false);

  const role = user?.role;

  const dropdownItem = {
    textDecoration: "none",
    padding: "10px 12px",
    borderRadius: "8px",
    color: "#111827",
    fontWeight: "500",
  };

  function handleLogout() {
    logoutUser();
    navigate("/");
  }

  function handleAdminLinkClick() {
    setAdminOpen(false);
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

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </Link>

        <Link
          to="/products"
          style={{ color: "white", textDecoration: "none" }}
        >
          Prodotti
        </Link>

        {user && (
          <Link
            to="/profile"
            style={{ color: "white", textDecoration: "none" }}
          >
            Profilo
          </Link>
        )}

        {(role === "ADMIN" || role === "MODERATOR") && (
          <Link
            to="/moderation"
            style={{ color: "white", textDecoration: "none" }}
          >
            Moderazione
          </Link>
        )}

        {(role === "ADMIN" || role === "MODERATOR") && (
          <Link
            to="/reports"
            style={{ color: "white", textDecoration: "none" }}
          >
            Segnalazioni
          </Link>
        )}

        {role === "ADMIN" && (
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setAdminOpen(!adminOpen)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Admin ▼
            </button>

            {adminOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "36px",
                  right: "0",
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "12px",
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "220px",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                  overflow: "hidden",
                  zIndex: 1000,
                }}
              >
                <Link
                  to="/admin/dashboard"
                  style={dropdownItem}
                  onClick={handleAdminLinkClick}
                >
                  Dashboard
                </Link>

                <Link
                  to="/admin/products"
                  style={dropdownItem}
                  onClick={handleAdminLinkClick}
                >
                  Gestione prodotti
                </Link>

                <Link
                  to="/admin/add-product"
                  style={dropdownItem}
                  onClick={handleAdminLinkClick}
                >
                  Aggiungi prodotto
                </Link>

                <Link
                  to="/admin/categories"
                  style={dropdownItem}
                  onClick={handleAdminLinkClick}
                >
                  Gestione categorie
                </Link>

                <Link
                  to="/admin/users"
                  style={dropdownItem}
                  onClick={handleAdminLinkClick}
                >
                  Gestione utenti
                </Link>
              </div>
            )}
          </div>
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