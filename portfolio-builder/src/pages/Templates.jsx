import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { TEMPLATES } from "../templates";

export default function Templates() {
  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: "1.5rem", paddingBottom: "2rem" }}>
        <h2 className="mb-3">Choose a template</h2>
        <div className="templates-grid">
          {TEMPLATES.map((t) => (
            <div key={t.id} className="template-card">
              <div className="preview" />
              <h3>{t.name}</h3>
              {t.customizable && <p className="text-muted">Customizable</p>}
              <Link className="btn mt-3 btn-block" to={`/editor/${t.id}`}>Use Template</Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}


