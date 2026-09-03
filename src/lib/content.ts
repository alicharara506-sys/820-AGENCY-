import type { AlgoState } from "@/components/algo/AlgoStateMachine";

export interface Discipline {
  id: string;
  index: string;
  name: string;
  algoState: AlgoState;
  summary: string;
  services: string[];
}

export const DISCIPLINES: Discipline[] = [
  {
    id: "brand",
    index: "01",
    name: "Brand",
    algoState: "creative",
    summary: "ALGO enters creative mode — sketching marks, grids and the systems that hold a brand together.",
    services: [
      "Brand Strategy",
      "Brand Positioning",
      "Naming",
      "Visual Identity",
      "Brand Guidelines",
      "Creative Direction",
      "Packaging",
    ],
  },
  {
    id: "digital",
    index: "02",
    name: "Digital",
    algoState: "happy",
    summary: "ALGO switches to communication mode — activating the signals a brand uses to reach people.",
    services: [
      "Digital Marketing",
      "Social Media Strategy",
      "Content Creation",
      "Campaigns",
      "Advertising Creative",
      "Motion Content",
      "Growth Marketing",
    ],
  },
  {
    id: "technology",
    index: "03",
    name: "Technology",
    algoState: "building",
    summary: "ALGO becomes builder mode — interfaces and systems assemble piece by piece.",
    services: [
      "Websites",
      "E-commerce",
      "UI/UX",
      "Interactive Experiences",
      "3D Websites",
      "Web Applications",
      "SaaS",
      "Custom Software",
      "APIs & Integrations",
    ],
  },
  {
    id: "ai",
    index: "04",
    name: "AI",
    algoState: "thinking",
    summary: "ALGO becomes intelligence mode — a network of agents and reasoning paths grows outward.",
    services: [
      "AI Applications",
      "AI Agents",
      "Workflow Automation",
      "AI Integration",
      "Customer Automation",
      "Process Automation",
      "Multi-Agent Systems",
    ],
  },
  {
    id: "analytics",
    index: "05",
    name: "Analytics",
    algoState: "analyzing",
    summary: "ALGO becomes analysis mode — data resolves into clear, decision-ready visualizations.",
    services: [
      "Business Analytics",
      "KPI Tracking",
      "Performance Dashboards",
      "Sales Analytics",
      "Marketing Analytics",
      "Customer Analytics",
      "Operational Analytics",
      "Forecasting",
      "Automated Reporting",
      "AI-Powered Insights",
    ],
  },
];

export interface Project {
  id: string;
  name: string;
  client: string;
  discipline: string;
  year: string;
  description: string;
}

export const PROJECTS: Project[] = [
  {
    id: "orbis",
    name: "Orbis Retail OS",
    client: "Orbis Group",
    discipline: "Technology · AI",
    year: "2025",
    description: "A unified commerce platform with an AI layer that forecasts demand across 40 stores.",
  },
  {
    id: "kanan",
    name: "Kanan Rebrand",
    client: "Kanan Foods",
    discipline: "Brand · Digital",
    year: "2025",
    description: "A full identity system and launch campaign for a regional food brand entering new markets.",
  },
  {
    id: "voss",
    name: "Voss Analytics Suite",
    client: "Voss Capital",
    discipline: "Analytics",
    year: "2024",
    description: "Real-time performance dashboards that replaced eleven disconnected spreadsheets.",
  },
  {
    id: "haven",
    name: "Haven Concierge Agent",
    client: "Haven Hospitality",
    discipline: "AI · Technology",
    year: "2024",
    description: "A multi-agent system that automates guest requests across a 12-property portfolio.",
  },
];

export interface ProcessStep {
  id: string;
  index: string;
  name: string;
  algoAction: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  { id: "discover", index: "01", name: "Discover", algoAction: "ALGO scans the problem.", description: "We map the business, the market and the real question worth solving." },
  { id: "strategize", index: "02", name: "Strategize", algoAction: "ALGO organizes floating nodes.", description: "Strategy turns findings into a clear plan — positioning, priorities, roadmap." },
  { id: "create", index: "03", name: "Create", algoAction: "ALGO sketches and builds.", description: "Brand and design systems take shape, ready to carry the strategy." },
  { id: "build", index: "04", name: "Build", algoAction: "Interfaces assemble.", description: "Engineering turns designs into fast, reliable products and systems." },
  { id: "launch", index: "05", name: "Launch", algoAction: "System activates.", description: "We ship — coordinated, monitored, and built to hold up under real traffic." },
  { id: "analyze", index: "06", name: "Analyze", algoAction: "Data appears.", description: "Dashboards and reporting turn activity into decisions." },
  { id: "grow", index: "07", name: "Grow", algoAction: "The network expands.", description: "We iterate on what the data shows, compounding results over time." },
];
