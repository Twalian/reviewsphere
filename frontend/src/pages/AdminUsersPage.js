import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAdminUsers, updateUserRole } from "../api/users";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "" });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (error) {
      console.error("Errore caricamento utenti", error);
      setToast({ message: "Errore caricamento utenti.", type: "error" });
    }
  }

  async function handleRoleChange(id, newRole) {
    try {
      await updateUserRole(id, newRole);
      setToast({ message: "Ruolo aggiornato con successo.", type: "success" });
      loadUsers();
    } catch (error) {
      console.error("Errore aggiornamento ruolo", error);
      setToast({ message: error.message || "Errore aggiornamento ruolo.", type: "error" });
    }
  }

  return (
    <div style={{ backgroundColor: "#f9fafb", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <Navbar />

      <div style={{ padding: "40px 5%", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ margin: "0 0 10px 0", color: "#111827" }}>Gestione Utenti</h1>
          <p style={{ margin: 0, color: "#6b7280" }}>Amministra gli account e i permessi della piattaforma.</p>
        </div>

        {/* Toast Notification */}
        {toast.message && (
          <div
            style={{
              marginBottom: "24px",
              padding: "16px 20px",
              borderRadius: "12px",
              backgroundColor: toast.type === "success" ? "#dcfce7" : "#fee2e2",
              color: toast.type === "success" ? "#166534" : "#991b1b",
              fontWeight: "bold",
              border: `1px solid ${toast.type === "success" ? "#bbf7d0" : "#fecaca"}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToast({ message: "", type: "" })}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "20px",
                color: toast.type === "success" ? "#166534" : "#991b1b"
              }}
            >
              ×
            </button>
          </div>
        )}

        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          padding: "30px", 
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" 
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f9fafb",
                  flexWrap: "wrap",
                  gap: "20px"
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 4px 0", color: "#111827", display: "flex", alignItems: "center", gap: "10px" }}>
                    {user.username}
                    <span style={{ 
                      fontSize: "12px", 
                      padding: "4px 8px", 
                      borderRadius: "10px", 
                      backgroundColor: user.role === "ADMIN" ? "#fee2e2" : user.role === "MODERATOR" ? "#fef3c7" : "#e0e7ff",
                      color: user.role === "ADMIN" ? "#991b1b" : user.role === "MODERATOR" ? "#92400e" : "#3730a3",
                      fontWeight: "bold"
                    }}>
                      {user.role}
                    </span>
                  </h3>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
                    {user.email}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <label style={{ fontSize: "14px", fontWeight: "bold", color: "#374151" }}>Cambia ruolo:</label>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "8px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "white",
                      cursor: "pointer",
                      fontWeight: "bold",
                      color: "#111827"
                    }}
                  >
                    <option value="CLIENT">CLIENT</option>
                    <option value="MODERATOR">MODERATOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <p style={{ textAlign: "center", color: "#6b7280", margin: "20px 0" }}>Nessun utente trovato.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsersPage;