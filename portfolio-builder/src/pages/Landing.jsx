import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Landing() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <section className="card" style={{ padding: "2.5rem", textAlign: "center" }}>
          <h1 style={{ marginBottom: "0.5rem" }}>Build your portfolio in minutes</h1>
          <p className="text-muted" style={{ marginBottom: "1.25rem" }}>
            Pick a beautiful template, add your projects, and publish a shareable link.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <Link to="/signup" className="btn">Get Started</Link>
            <Link to="/login" className="btn btn-secondary">Log In</Link>
          </div>
        </section>

        <section style={{ marginTop: "2rem" }}>
          <div className="templates-grid">
            {["Responsive", "Fast", "Customizable"].map((feature) => (
              <div key={feature} className="template-card" style={{ textAlign: "center" }}>
                <div className="preview" />
                <h3>{feature}</h3>
                <p className="text-muted">A modern experience with clean design and sensible defaults.</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}


