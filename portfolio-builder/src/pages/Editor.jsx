import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getTemplateById } from "../templates";
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Editor() {
  const { templateId, portfolioId } = useParams();
  const navigate = useNavigate();
  const template = useMemo(() => getTemplateById(templateId), [templateId]);
  const [sections, setSections] = useState(() =>
    (template?.blocks || []).map((b) => ({ type: b.type, data: { ...b.defaultData } }))
  );
  const [title, setTitle] = useState(template ? `${template.name} Portfolio` : "Untitled Portfolio");
  const [showSaved, setShowSaved] = useState(false);
  const [lastSavedId, setLastSavedId] = useState(portfolioId || null);
  const [theme, setTheme] = useState(() => template?.theme || { accent: "#4a90e2", radius: 12, font: "system-ui" });

  // If we are editing an existing portfolio, load it
  useEffect(() => {
    const load = async () => {
      if (!portfolioId) return;
      const ref = doc(db, "portfolios", portfolioId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setSections(Array.isArray(data.sections) ? data.sections : []);
        setTitle(data.title || "Untitled Portfolio");
      }
    };
    load();
  }, [portfolioId]);

  const handleChange = (index, field, value) => {
    setSections((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], data: { ...next[index].data, [field]: value } };
      return next;
    });
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: "1.5rem", paddingBottom: "2rem" }}>
        <div className="dashboard-header">
          <h2 className="mb-0">Editing: {title}</h2>
          <div style={{ display: "flex", gap: ".5rem" }}>
            <button className="btn" onClick={async () => {
              if (!auth.currentUser) { alert("Please log in to save"); return; }
              try {
                let id = portfolioId;
                if (!id) {
                  const docRef = await addDoc(collection(db, "portfolios"), {
                    uid: auth.currentUser.uid,
                    templateId: templateId || "custom",
                    title,
                    sections,
                    theme,
                    createdAt: serverTimestamp(),
                    updatedAt: Date.now(),
                  });
                  id = docRef.id;
                } else {
                  await setDoc(doc(db, "portfolios", id), {
                    uid: auth.currentUser.uid,
                    templateId: templateId || "custom",
                    title,
                    sections,
                    theme,
                    updatedAt: Date.now(),
                  }, { merge: true });
                }
                setShowSaved(true);
                setLastSavedId(id);
              } catch (e) {
                alert(e.message);
              }
            }}>Save</button>
            <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
          </div>
        </div>

        <div className="templates-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <section className="card">
            <h3>Editor</h3>
            <div className="form-row">
              <label>title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            {template?.customizable && (
              <div className="card" style={{ marginTop: "1rem" }}>
                <h4 className="mb-3">Theme</h4>
                <div className="form-row"><label>accent</label><input type="color" value={theme.accent} onChange={(e) => setTheme({ ...theme, accent: e.target.value })} /></div>
                <div className="form-row"><label>font</label><input value={theme.font} onChange={(e) => setTheme({ ...theme, font: e.target.value })} /></div>
                <div className="form-row"><label>radius</label><input type="number" value={theme.radius} onChange={(e) => setTheme({ ...theme, radius: Number(e.target.value) })} /></div>
              </div>
            )}
            {sections.map((s, idx) => (
              <div key={idx} className="form-row" style={{ marginTop: "0.75rem" }}>
                <strong style={{ display: "block" }}>{s.type}</strong>
                {s.type === "hero" ? (
                  <HeroEditor
                    data={s.data}
                    onChange={(field, value) => handleChange(idx, field, value)}
                  />
                ) : Object.keys(s.data).map((field) => {
                  const value = s.data[field];
                  const isComplex = Array.isArray(value) || (value !== null && typeof value === "object");
                  return (
                    <div key={field} className="form-row">
                      <label>{field}</label>
                      {s.type === "projectsGrid" && field === "items" ? (
                        <ProjectsEditor
                          items={Array.isArray(value) ? value : []}
                          onChange={(items) => handleChange(idx, "items", items)}
                        />
                      ) : s.type === "hero" && field === "socials" ? (
                        <SocialsEditor
                          items={Array.isArray(value) ? value : []}
                          onChange={(items) => handleChange(idx, "socials", items)}
                        />
                      ) : s.type === "experience" && field === "items" ? (
                        <ExperienceEditor
                          items={Array.isArray(value) ? value : []}
                          onChange={(items) => handleChange(idx, "items", items)}
                        />
                      ) : s.type === "certifications" && field === "items" ? (
                        <CertificationsEditor
                          items={Array.isArray(value) ? value : []}
                          onChange={(items) => handleChange(idx, "items", items)}
                        />
                      ) : isComplex ? (
                        <span className="text-muted">Complex field – editing UI coming soon</span>
                      ) : (
                        <input
                          value={value || ""}
                          onChange={(e) => handleChange(idx, field, e.target.value)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </section>

          <section className="card" style={{
            ["--primary-color"]: theme.accent,
            ["--border-radius"]: `${theme.radius}px`,
            fontFamily: theme.font,
          }}>
            <h3>Preview</h3>
            <div style={{ marginTop: "0.75rem" }}>
              {sections.map((s, idx) => (
                <div key={idx} style={{ marginBottom: "1rem" }}>
                  {s.type === "hero" && (
                    <div>
                      <h1>{s.data.title}</h1>
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
                  {s.type === "projectsGrid" && (
                    <div className="templates-grid">
                      {(Array.isArray(s.data.items) ? s.data.items : []).map((it, i) => (
                        <div key={i} className="template-card">
                          {it.image ? (
                            <img src={it.image} alt="project" style={{ height: 120, width: "100%", objectFit: "cover", borderRadius: 10, border: "1px solid #e5e7eb", marginBottom: 12 }} />
                          ) : (
                            <div className="preview" />
                          )}
                          <h3>{it.title}</h3>
                          {renderTextOrList(it.description)}
                        </div>
                      ))}
                    </div>
                  )}
                  {s.type === "experience" && (
                    <div>
                      <h3>Experience</h3>
                      <div>
                        {(Array.isArray(s.data.items) ? s.data.items : []).map((job, i) => (
                          <div key={i} className="mb-3">
                            <strong>{job.role}</strong> • {job.company}
                            <div className="text-muted">{job.start} – {job.end}</div>
                            {renderTextOrList(job.summary)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {s.type === "certifications" && (
                    <div>
                      <h3>Certifications</h3>
                      <ul>
                        {(Array.isArray(s.data.items) ? s.data.items : []).map((c, i) => (
                          <li key={i} className="text-muted">
                            {c.name} — {c.issuer} ({c.year})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {s.type === "contact" && (
                    <p className="text-muted">Contact: {s.data.email}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      {showSaved && (
        <div className="modal-backdrop" onClick={() => setShowSaved(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Portfolio saved</h3>
            <p className="text-muted">Your changes have been saved successfully.</p>
            <div className="modal-actions">
              <Link className="btn" to={`/view/${lastSavedId}`}>View</Link>
              <button className="btn btn-secondary" onClick={() => setShowSaved(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProjectsEditor({ items, onChange }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const reorder = (arr, from, to) => {
    const copy = [...arr];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    return copy;
  };

  const normalizeUrl = (value) => {
    const v = (value || "").trim();
    if (!v) return "";
    if (/^https?:\/\//i.test(v)) return v;
    return `https://${v}`;
  };

  const isValidUrl = (value) => {
    const v = normalizeUrl(value);
    try { new URL(v); return true; } catch { return false; }
  };

  const addItem = () => {
    onChange([...items, { title: "New Project", description: "", tags: [] }]);
  };
  const updateItem = (i, field, value) => {
    const next = items.map((it, idx) => (idx === i ? { ...it, [field]: value } : it));
    onChange(next);
  };
  const updateThumbnail = async (i, file) => {
    try {
      if (!file) return;
      // Convert to base64 data URL and store directly in Firestore-backed state
      const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const dataUrl = await toBase64(file);
      updateItem(i, "image", dataUrl);
    } catch (e) {
      alert(e.message);
    }
  };
  const removeItem = (i) => {
    const next = items.filter((_, idx) => idx !== i);
    onChange(next);
  };

  return (
    <div>
      {items.map((it, i) => (
        <div
          key={i}
          className="card"
          style={{
            padding: "0.75rem",
            marginBottom: "0.5rem",
            outline: overIndex === i ? "2px dashed #4a90e2" : "none",
            cursor: "grab",
          }}
          draggable
          onDragStart={() => setDragIndex(i)}
          onDragOver={(e) => {
            e.preventDefault();
            setOverIndex(i);
          }}
          onDragLeave={() => setOverIndex(null)}
          onDrop={() => {
            if (dragIndex === null || dragIndex === i) {
              setOverIndex(null);
              return;
            }
            onChange(reorder(items, dragIndex, i));
            setDragIndex(null);
            setOverIndex(null);
          }}
        >
          <div className="form-row">
            <label>title</label>
            <input value={it.title || ""} onChange={(e) => updateItem(i, "title", e.target.value)} />
          </div>
          <div className="form-row">
            <label>description</label>
            <textarea value={it.description || ""} onChange={(e) => updateItem(i, "description", e.target.value)} />
          </div>
          <div className="form-row">
            <label>link</label>
            <input
              type="url"
              value={it.link || ""}
              onChange={(e) => updateItem(i, "link", e.target.value)}
              onBlur={(e) => updateItem(i, "link", normalizeUrl(e.target.value))}
              placeholder="https://..."
            />
            {it.link && !isValidUrl(it.link) && (
              <small style={{ color: '#ef4444' }}>Enter a valid URL</small>
            )}
          </div>
          <div className="form-row">
            <label>thumbnail</label>
            <input type="file" accept="image/*" onChange={(e) => updateThumbnail(i, e.target.files?.[0])} />
            {it.image && (
              <img src={it.image} alt="thumbnail" style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb", marginTop: 6 }} />
            )}
          </div>
          <div className="form-footer" style={{ marginTop: "0.5rem" }}>
            <button type="button" className="btn btn-secondary" onClick={() => removeItem(i)}>Remove</button>
          </div>
        </div>
      ))}
      <button type="button" className="btn mt-3" onClick={addItem}>Add project</button>
    </div>
  );
}

function ExperienceEditor({ items, onChange }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const reorder = (arr, from, to) => {
    const copy = [...arr];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    return copy;
  };

  const addItem = () => {
    onChange([
      ...items,
      { company: "", role: "", start: "", end: "", summary: "" },
    ]);
  };
  const updateItem = (i, field, value) => {
    const next = items.map((it, idx) => (idx === i ? { ...it, [field]: value } : it));
    onChange(next);
  };
  const removeItem = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      {items.map((it, i) => (
        <div
          key={i}
          className="card"
          style={{
            padding: "0.75rem",
            marginBottom: "0.5rem",
            outline: overIndex === i ? "2px dashed #4a90e2" : "none",
            cursor: "grab",
          }}
          draggable
          onDragStart={() => setDragIndex(i)}
          onDragOver={(e) => {
            e.preventDefault();
            setOverIndex(i);
          }}
          onDragLeave={() => setOverIndex(null)}
          onDrop={() => {
            if (dragIndex === null || dragIndex === i) {
              setOverIndex(null);
              return;
            }
            onChange(reorder(items, dragIndex, i));
            setDragIndex(null);
            setOverIndex(null);
          }}
        >
          <div className="form-row"><label>company</label><input value={it.company || ""} onChange={(e) => updateItem(i, "company", e.target.value)} /></div>
          <div className="form-row"><label>role</label><input value={it.role || ""} onChange={(e) => updateItem(i, "role", e.target.value)} /></div>
          <div className="form-row"><label>start</label><input value={it.start || ""} onChange={(e) => updateItem(i, "start", e.target.value)} /></div>
          <div className="form-row"><label>end</label><input value={it.end || ""} onChange={(e) => updateItem(i, "end", e.target.value)} /></div>
          <div className="form-row"><label>summary</label><textarea value={it.summary || ""} onChange={(e) => updateItem(i, "summary", e.target.value)} /></div>
          <div className="form-footer" style={{ marginTop: "0.5rem" }}>
            <button type="button" className="btn btn-secondary" onClick={() => removeItem(i)}>Remove</button>
          </div>
        </div>
      ))}
      <button type="button" className="btn mt-3" onClick={addItem}>Add experience</button>
    </div>
  );
}

// Renders a string as plain text or bullet list if it contains newline-separated items
function renderTextOrList(text) {
  if (!text) return <p className="text-muted" />;
  const lines = String(text).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length <= 1) {
    return <p className="text-muted">{lines[0]}</p>;
  }
  return (
    <ul style={{ paddingLeft: "1.1rem", color: "#6b7280", margin: ".25rem 0 0" }}>
      {lines.map((l, i) => (
        <li key={i}>{l}</li>
      ))}
    </ul>
  );
}

function CertificationsEditor({ items, onChange }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const reorder = (arr, from, to) => {
    const copy = [...arr];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    return copy;
  };

  const addItem = () => onChange([...items, { name: "", issuer: "", year: "", link: "" }]);
  const updateItem = (i, field, value) => {
    const next = items.map((it, idx) => (idx === i ? { ...it, [field]: value } : it));
    onChange(next);
  };
  const removeItem = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      {items.map((it, i) => (
        <div
          key={i}
          className="card"
          style={{
            padding: "0.75rem",
            marginBottom: "0.5rem",
            outline: overIndex === i ? "2px dashed #4a90e2" : "none",
            cursor: "grab",
          }}
          draggable
          onDragStart={() => setDragIndex(i)}
          onDragOver={(e) => {
            e.preventDefault();
            setOverIndex(i);
          }}
          onDragLeave={() => setOverIndex(null)}
          onDrop={() => {
            if (dragIndex === null || dragIndex === i) {
              setOverIndex(null);
              return;
            }
            onChange(reorder(items, dragIndex, i));
            setDragIndex(null);
            setOverIndex(null);
          }}
        >
          <div className="form-row"><label>name</label><input value={it.name || ""} onChange={(e) => updateItem(i, "name", e.target.value)} /></div>
          <div className="form-row"><label>issuer</label><input value={it.issuer || ""} onChange={(e) => updateItem(i, "issuer", e.target.value)} /></div>
          <div className="form-row"><label>year</label><input value={it.year || ""} onChange={(e) => updateItem(i, "year", e.target.value)} /></div>
          <div className="form-row"><label>link</label><input value={it.link || ""} onChange={(e) => updateItem(i, "link", e.target.value)} /></div>
          <div className="form-footer" style={{ marginTop: "0.5rem" }}>
            <button type="button" className="btn btn-secondary" onClick={() => removeItem(i)}>Remove</button>
          </div>
        </div>
      ))}
      <button type="button" className="btn mt-3" onClick={addItem}>Add certification</button>
    </div>
  );
}

function SocialsEditor({ items, onChange }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const reorder = (arr, from, to) => {
    const copy = [...arr];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    return copy;
  };

  const addItem = () => onChange([...(items || []), { label: "", url: "" }]);
  const updateItem = (i, field, value) => onChange(items.map((it, idx) => idx === i ? { ...it, [field]: value } : it));
  const removeItem = (i) => onChange(items.filter((_, idx) => idx !== i));

  const normalizeUrl = (value) => {
    const v = (value || "").trim();
    if (!v) return "";
    if (/^https?:\/\//i.test(v)) return v;
    return `https://${v}`;
  };

  return (
    <div>
      {(items || []).map((it, i) => (
        <div
          key={i}
          className="card"
          style={{ padding: "0.75rem", marginBottom: "0.5rem", cursor: "grab", outline: overIndex === i ? "2px dashed #4a90e2" : "none" }}
          draggable
          onDragStart={() => setDragIndex(i)}
          onDragOver={(e) => { e.preventDefault(); setOverIndex(i); }}
          onDragLeave={() => setOverIndex(null)}
          onDrop={() => { if (dragIndex !== null && dragIndex !== i) onChange(reorder(items, dragIndex, i)); setDragIndex(null); setOverIndex(null); }}
        >
          <div className="form-row"><label>label</label><input value={it.label || ""} onChange={(e) => updateItem(i, 'label', e.target.value)} /></div>
          <div className="form-row"><label>url</label><input value={it.url || ""} onBlur={(e) => updateItem(i, 'url', normalizeUrl(e.target.value))} onChange={(e) => updateItem(i, 'url', e.target.value)} placeholder="https://..." /></div>
          <div className="form-footer" style={{ marginTop: "0.5rem" }}>
            <button type="button" className="btn btn-secondary" onClick={() => removeItem(i)}>Remove</button>
          </div>
        </div>
      ))}
      <button type="button" className="btn mt-3" onClick={addItem}>Add social link</button>
    </div>
  );
}

function HeroEditor({ data, onChange }) {
  return (
    <div>
      <div className="form-row"><label>title</label><input value={data.title || ""} onChange={(e) => onChange('title', e.target.value)} /></div>
      <div className="form-row"><label>subtitle</label><input value={data.subtitle || ""} onChange={(e) => onChange('subtitle', e.target.value)} /></div>
      <div className="form-row"><label>socials</label>
        <SocialsEditor items={Array.isArray(data.socials) ? data.socials : []} onChange={(items) => onChange('socials', items)} />
      </div>
    </div>
  );
}


