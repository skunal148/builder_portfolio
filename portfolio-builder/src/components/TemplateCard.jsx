export default function TemplateCard({ template }) {
  return (
    <div className="template-card">
      <div className="preview" aria-hidden="true" />
      <h3>{template.name}</h3>
      <button className="btn mt-3 btn-block">Use Template</button>
    </div>
  );
}
  