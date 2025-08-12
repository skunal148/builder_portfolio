import { heroBlock, projectsGridBlock, contactBlock, experienceBlock, certificationsBlock } from "./blocks";

export const TEMPLATES = [
  { id: "modern", name: "Modern Minimal", blocks: [heroBlock, experienceBlock, projectsGridBlock, certificationsBlock, contactBlock] },
  { id: "case", name: "Case Study Pro", blocks: [heroBlock, experienceBlock, projectsGridBlock, certificationsBlock, contactBlock] },
  { id: "gallery", name: "Grid Gallery", blocks: [heroBlock, experienceBlock, projectsGridBlock, certificationsBlock, contactBlock] },
];

export function getTemplateById(id) {
  return TEMPLATES.find((t) => t.id === id);
}


