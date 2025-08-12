import { heroBlock, projectsGridBlock, contactBlock, experienceBlock, certificationsBlock } from "./blocks";

export const TEMPLATES = [
  {
    id: "blank",
    name: "Blank (Customizable)",
    customizable: true,
    theme: { accent: "#4a90e2", font: "system-ui", radius: 12 },
    blocks: [heroBlock, experienceBlock, projectsGridBlock, certificationsBlock, contactBlock],
  },
  {
    id: "modern",
    name: "Modern Minimal",
    customizable: false,
    theme: { accent: "#4a90e2", font: "Inter, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif", radius: 12 },
    blocks: [heroBlock, experienceBlock, projectsGridBlock, certificationsBlock, contactBlock],
  },
  {
    id: "case",
    name: "Case Study Pro",
    customizable: false,
    theme: { accent: "#16a34a", font: "Poppins, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif", radius: 10 },
    blocks: [heroBlock, experienceBlock, projectsGridBlock, certificationsBlock, contactBlock],
  },
  {
    id: "gallery",
    name: "Grid Gallery",
    customizable: false,
    theme: { accent: "#f97316", font: "Nunito, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif", radius: 14 },
    blocks: [heroBlock, experienceBlock, projectsGridBlock, certificationsBlock, contactBlock],
  },
];

export function getTemplateById(id) {
  return TEMPLATES.find((t) => t.id === id);
}


