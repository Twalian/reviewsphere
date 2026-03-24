import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAdminUsers, updateUserRole } from "../api/users";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (error) {
      console.error("Errore caricamento utenti", error);
      setMessage("Errore caricamento utenti.");
    }
  }

  async function handleRoleChange(id, newRole) {
    try {
      await updateUserRole(id, newRole);
      setMessage("Ruolo aggiornato con successo.");
      loadUsers();
    } catch (error) {
      console.error("Errore aggiornamento ruolo", error);
      setMessage(error.message || "Errore aggiornamento ruolo.");
    }
  }

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
        <h1>Gestione utenti</h1>

        {message && (
          <div
            style={{
              marginBottom: "20px",
              padding: "12px 16px",
              borderRadius: "10px",
              backgroundColor: "#e0f2fe",
              color: "#075985",
              fontWeight: "bold",
              maxWidth: "700px",
            }}
          >
            {message}
          </div>
        )}

        {users.map((user) => (
          <div
            key={user.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "12px",
              maxWidth: "700px",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0" }}>
              {user.username} ({user.role})
            </h3>

            <p style={{ margin: "0 0 12px 0", color: "#4b5563" }}>
              {user.email}
            </p>

            <select
              value={user.role}
              onChange={(e) => handleRoleChange(user.id, e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "220px",
              }}
            >
              <option value="CLIENT">CLIENT</option>
              <option value="MODERATOR">MODERATOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminUsersPage;