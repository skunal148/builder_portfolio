// Basic reusable blocks used by templates

export const heroBlock = {
  type: "hero",
  label: "Hero",
  defaultData: {
    title: "Hi, I'm Your Name",
    subtitle: "Role or tagline",
    socials: [
      { label: "GitHub", url: "" },
      { label: "LinkedIn", url: "" },
      { label: "Website", url: "" },
    ],
  },
};

export const projectsGridBlock = {
  type: "projectsGrid",
  label: "Projects",
  defaultData: {
    items: [
      { title: "Project One", description: "Brief summary", link: "", tags: ["React"] },
      { title: "Project Two", description: "Brief summary", link: "", tags: ["Node"] },
    ],
  },
};

export const contactBlock = {
  type: "contact",
  label: "Contact",
  defaultData: {
    email: "you@example.com",
  },
};

export const experienceBlock = {
  type: "experience",
  label: "Work Experience",
  defaultData: {
    items: [
      {
        company: "Company Inc.",
        role: "Software Engineer",
        start: "2023",
        end: "Present",
        summary: "Worked on frontend features and performance improvements.",
      },
    ],
  },
};

export const certificationsBlock = {
  type: "certifications",
  label: "Certifications",
  defaultData: {
    items: [
      { name: "Certification Name", issuer: "Issuer", year: "2024", link: "" },
    ],
  },
};

export const skillsBlock = {
  type: "skills",
  label: "Skills",
  defaultData: {
    items: ["JavaScript", "React", "Node.js"],
  },
};


