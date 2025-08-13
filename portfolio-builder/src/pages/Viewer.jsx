import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";

export default function Viewer() {
  const { portfolioId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "portfolios", portfolioId);
      const snap = await getDoc(ref);
      if (snap.exists()) setData({ id: snap.id, ...snap.data() });
    };
    load();
  }, [portfolioId]);

  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: "1.5rem", paddingBottom: "2rem" }}>
        {!data ? (
          <p className="text-muted">Loading...</p>
        ) : (
          <article className="card">
            {!(data.templateId === 'blank' && (data.title || '').toLowerCase().includes('blank')) && (
              <h1 style={{ marginBottom: ".5rem" }}>{data.title || "Portfolio"}</h1>
            )}
            {(Array.isArray(data.sections) ? data.sections : []).map((s, idx) => (
              <section key={idx} style={{ marginTop: "1rem" }}>
                {s.type === "hero" && (
                  <div>
                    <h2>{s.data.title}</h2>
                    <p className="text-muted">{s.data.subtitle}</p>
                    {Array.isArray(s.data.socials) && s.data.socials.length > 0 && (
                      <p className="mt-2">
                        {s.data.socials.filter(Boolean).map((soc, i) => (
                          <a key={i} href={soc.url} target="_blank" rel="noreferrer" style={{ marginRight: 12 }}>
                            {soc.label}
                          </a>
                        ))}
                      </p>
                    )}
                  </div>
                )}
                {s.type === "skills" && (
                  <div>
                    <h3>Skills</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(Array.isArray(s.data.items) ? s.data.items : []).map((sk, i) => (
                        <span key={i} style={{ padding: '6px 10px', background: '#eef2f7', borderRadius: 999, fontSize: 13 }}>{sk}</span>
                      ))}
                    </div>
                  </div>
                )}
                {s.type === "experience" && (
                  <div>
                    <h3>Experience</h3>
                    {(s.data.items || []).map((job, i) => (
                      <div key={i} className="mb-3">
                        <strong>{job.role}</strong> • {job.company}
                        <div className="text-muted">{job.start} – {job.end}</div>
                        {renderTextOrList(job.summary)}
                      </div>
                    ))}
                  </div>
                )}
                {s.type === "projectsGrid" && (
                  <div>
                    <h3>Projects</h3>
                    <div className="templates-grid">
                      {(s.data.items || []).map((it, i) => (
                        <div key={i} className="template-card">
                          {it.image ? (
                            <img src={it.image} alt="project" style={{ height: 120, width: "100%", objectFit: "cover", borderRadius: 10, border: "1px solid #e5e7eb", marginBottom: 12 }} />
                          ) : (
                            <div className="preview" />
                          )}
                          <h3>{it.title}</h3>
                          {renderTextOrList(it.description)}
                          {it.link && (
                            <p className="mt-2"><a href={it.link} target="_blank" rel="noreferrer">Visit project →</a></p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {s.type === "certifications" && (
                  <div>
                    <h3>Certifications</h3>
                    <ul>
                      {(s.data.items || []).map((c, i) => (
                        <li key={i} className="text-muted">{c.name} — {c.issuer} ({c.year})</li>
                      ))}
                    </ul>
                  </div>
                )}
                {s.type === "contact" && (
                  <p className="text-muted">Contact: {s.data.email}</p>
                )}
              </section>
            ))}
            <div className="mt-3">
              <Link to={`/editor/portfolio/${portfolioId}`} className="btn">Edit this Portfolio</Link>
            </div>
          </article>
        )}
      </main>
    </>
  );
}

function renderTextOrList(text) {
  if (!text) return null;
  const lines = String(text).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length <= 1) return <p className="text-muted">{lines[0]}</p>;
  return (
    <ul style={{ paddingLeft: "1.1rem", color: "#6b7280", margin: ".25rem 0 0" }}>
      {lines.map((l, i) => (<li key={i}>{l}</li>))}
    </ul>
  );
}


