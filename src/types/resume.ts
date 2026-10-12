export interface PersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
}

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  url?: string;
  technologies?: string[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  url?: string;
}

export interface ResumeContent {
  personalInfo: PersonalInfo;
  summary?: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillGroup[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean, traditional layout ideal for corporate roles",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Two-column design with accent colors",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Single-column layout with maximum whitespace",
  },
];

export function createEmptyResumeContent(): ResumeContent {
  return {
    personalInfo: {
      fullName: "",
      email: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  };
}

export interface ResumeAnalysis {
  overallScore: number;
  sections: {
    name: string;
    score: number;
    feedback: string;
    suggestions: string[];
  }[];
  keywords: {
    found: string[];
    missing: string[];
    nice_to_have: string[];
  };
  improvements: {
    priority: "high" | "medium" | "low";
    section: string;
    suggestion: string;
  }[];
  strengths: string[];
}

export type ResumeSection = keyof ResumeContent;

export const RESUME_SECTIONS = [
  { key: "personalInfo" as const, label: "Personal Info", icon: "User" },
  { key: "summary" as const, label: "Summary", icon: "FileText" },
  { key: "experience" as const, label: "Experience", icon: "Briefcase" },
  { key: "education" as const, label: "Education", icon: "GraduationCap" },
  { key: "skills" as const, label: "Skills", icon: "Wrench" },
  { key: "projects" as const, label: "Projects", icon: "FolderOpen" },
  { key: "certifications" as const, label: "Certifications", icon: "Award" },
] as const;
