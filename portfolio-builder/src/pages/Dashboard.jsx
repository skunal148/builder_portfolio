import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";

export default function Dashboard() {
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "portfolios"),
      where("uid", "==", auth.currentUser.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      rows.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      setPortfolios(rows);
    });
    return () => unsub();
  }, []);

  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: "1.5rem", paddingBottom: "2rem" }}>
        <div className="dashboard-header">
          <h2 className="mb-0">Your Portfolios</h2>
          <div style={{ display: "flex", gap: ".5rem" }}>
            <Link className="btn" to="/templates">Create New</Link>
          </div>
        </div>

        {portfolios.length === 0 ? (
          <p className="text-muted">No portfolios yet. Click "Create New" to start.</p>
        ) : (
          <div className="templates-grid">
            {portfolios.map((p) => (
              <div key={p.id} className="template-card">
                <div className="preview" />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.5rem' }}>
                  <h3 style={{ margin: 0 }}>{p.title || p.templateName || "Untitled Portfolio"}</h3>
                  <button
                    aria-label="Delete portfolio"
                    title="Delete"
                    className="btn btn-secondary"
                    onClick={async () => {
                      const confirmDelete = confirm('Delete this portfolio? This cannot be undone.');
                      if (!confirmDelete) return;
                      await deleteDoc(doc(db, 'portfolios', p.id));
                    }}
                  >
                    ✕
                  </button>
                </div>
                <p className="text-muted mb-3">Template: {p.templateId || "unknown"}</p>
                <div style={{ display: "flex", gap: ".5rem" }}>
                  <Link className="btn btn-secondary" to={`/editor/portfolio/${p.id}`}>Edit</Link>
                  <Link className="btn" to={`/view/${p.id}`}>View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
