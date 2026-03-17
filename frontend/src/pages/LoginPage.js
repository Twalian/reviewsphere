import Navbar from "../components/Navbar";

function LoginPage() {
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
            width: "100%",
            maxWidth: "420px",
            padding: "30px",
            border: "1px solid #ddd",
            borderRadius: "16px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            backgroundColor: "#fff",
          }}
        >
          <h1 style={{ marginBottom: "10px", color: "#1e3a8a" }}>Login</h1>

          <p style={{ color: "#555", marginBottom: "20px" }}>
            Accedi a ReviewSphere
          </p>

          <form>
            <div style={{ marginBottom: "16px" }}>
              <label>Email</label>
              <input
                type="email"
                placeholder="Inserisci la tua email"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Inserisci la tua password"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#1e3a8a",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Accedi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;