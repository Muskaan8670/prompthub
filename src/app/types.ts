export interface Prompt {
  id: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
  notes?: string;
  isFavorite: boolean;
  createdAt: string;
}

export const DEFAULT_CATEGORIES = [
  "Web Development",
  "React",
  "Next.js",
  "Node.js",
  "WordPress",
  "UI/UX",
  "Content Writing",
  "Marketing",
  "Office Productivity",
  "General AI"
];

export const DEMO_PROMPTS: Prompt[] = [
  {
    id: "demo-1",
    title: "Generate React component from requirements",
    category: "React",
    tags: ["React", "TypeScript", "TailwindCSS", "Frontend"],
    content: "Act as an expert React developer. Generate a clean, responsive React functional component based on the following requirements:\n1. Props: { title: string, items: string[], onSelect: (item: string) => void }\n2. Use Tailwind CSS for modern glassmorphism styling.\n3. Make sure typescript types are clean.\n4. Include subtle interactive hover effects.",
    notes: "Perfect for bootstrapping new list or grid components quickly.",
    isFavorite: true,
    createdAt: "2026-08-10T12:00:00.000Z"
  },
  {
    id: "demo-2",
    title: "Create SEO-friendly landing page content",
    category: "Content Writing",
    tags: ["SEO", "Copywriting", "Landing Page", "Marketing"],
    content: "Write a high-converting landing page outline and primary copy targeting the keyword: [Target Keyword].\nThe content should follow the AIDA framework (Attention, Interest, Desire, Action).\nInclude sections for:\n- Hero header with compelling hook\n- Sub-headline focusing on core value prop\n- Problem statement & pain points\n- Our solution and 3 key features (with benefit bullets)\n- Social proof/testimonial placeholders\n- Call to Action button label & micro-copy.",
    notes: "Requires replacing [Target Keyword] before usage.",
    isFavorite: true,
    createdAt: "2026-08-11T14:30:00.000Z"
  },
  {
    id: "demo-3",
    title: "Convert design mockup into HTML structure",
    category: "UI/UX",
    tags: ["HTML", "CSS", "UI/UX", "TailwindCSS"],
    content: "Given a description of a user interface: [UI Description].\nConvert it into clean, semantic HTML5 structure styled entirely with utility classes from Tailwind CSS.\nEnsure accessibility (aria tags, landmarks) and make it fully responsive (mobile-first approach).",
    notes: "Insert the visual description in place of [UI Description].",
    isFavorite: false,
    createdAt: "2026-08-12T09:15:00.000Z"
  },
  {
    id: "demo-4",
    title: "Improve website accessibility",
    category: "Web Development",
    tags: ["Accessibility", "WCAG", "HTML", "A11y"],
    content: "Review this React component code and list 5 actionable ways to improve its accessibility to conform with WCAG 2.2 AA standards.\nParticularly focus on keyboard navigability, semantic ARIA properties, screen reader announcements, and focus trap behavior inside modals/dropdowns.\nHere is the component code:\n[Insert Code]",
    notes: "Use this to audit interactive components before releasing to production.",
    isFavorite: false,
    createdAt: "2026-08-13T10:00:00.000Z"
  },
  {
    id: "demo-5",
    title: "Generate project documentation",
    category: "General AI",
    tags: ["Documentation", "Markdown", "Git", "DevOps"],
    content: "Read the attached codebase structure / summary and generate a professional, comprehensive README.md file including:\n- Project Title & Catchy Description\n- Installation instructions (npm, yarn, pnpm, bun)\n- High-level folder architecture overview\n- Configuration & Environment Variables guide\n- Code guidelines or workflow instructions\n- Licensing info.",
    notes: "Great for open-source releases or onboarding internal team members.",
    isFavorite: false,
    createdAt: "2026-08-13T11:00:00.000Z"
  }
];
