import type { ResumeContent } from "@/types/resume";

export function Preview({ content }: { content: ResumeContent }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = content;

  return (
    <div className="font-[var(--font-dm-sans)] text-[10px] leading-[1.6] text-gray-700 p-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[20px] font-light tracking-tight text-gray-900 font-[var(--font-space-grotesk)]">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex items-center gap-3 mt-1 text-[9px] text-gray-500 flex-wrap">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <p className="text-gray-600 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <SectionTitle>Experience</SectionTitle>
          {experience.map((entry) => (
            <div key={entry.id} className="mb-4">
              <div className="text-[11px] font-medium text-gray-900">
                {entry.title}
                <span className="font-normal text-gray-500">
                  {" "}at {entry.company}
                </span>
              </div>
              <div className="text-[8px] text-gray-400 mt-0.5">
                {entry.startDate}
                {entry.current ? " – Present" : entry.endDate ? ` – ${entry.endDate}` : ""}
                {entry.location && ` · ${entry.location}`}
              </div>
              {entry.description && (
                <p className="mt-1.5 text-gray-600 whitespace-pre-line">
                  {entry.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <SectionTitle>Education</SectionTitle>
          {education.map((entry) => (
            <div key={entry.id} className="mb-3">
              <div className="text-[11px] font-medium text-gray-900">
                {entry.degree}
                {entry.field && ` in ${entry.field}`}
              </div>
              <div className="text-[9px] text-gray-500">
                {entry.institution}
                <span className="text-gray-400 ml-2">
                  {entry.startDate}
                  {entry.current ? " – Present" : entry.endDate ? ` – ${entry.endDate}` : ""}
                </span>
              </div>
              {entry.gpa && (
                <div className="text-[8px] text-gray-400 mt-0.5">
                  GPA: {entry.gpa}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <SectionTitle>Skills</SectionTitle>
          <div className="space-y-1">
            {skills.map((group) => (
              <div key={group.id}>
                <span className="text-gray-900 font-medium">
                  {group.category}
                </span>
                <span className="text-gray-400 mx-2">—</span>
                <span className="text-gray-600">{group.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <SectionTitle>Projects</SectionTitle>
          {projects.map((entry) => (
            <div key={entry.id} className="mb-3">
              <div className="text-[11px] font-medium text-gray-900">
                {entry.name}
              </div>
              <p className="text-gray-600 mt-0.5">{entry.description}</p>
              {entry.technologies && entry.technologies.length > 0 && (
                <div className="text-[8px] text-gray-400 mt-0.5">
                  {entry.technologies.join(" · ")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-6">
          <SectionTitle>Certifications</SectionTitle>
          {certifications.map((entry) => (
            <div key={entry.id} className="mb-1">
              <span className="text-gray-900 font-medium">{entry.name}</span>
              <span className="text-gray-500"> — {entry.issuer}</span>
              {entry.date && (
                <span className="text-gray-400 text-[8px] ml-1">
                  {entry.date}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[9px] font-medium uppercase tracking-[0.2em] text-gray-400 mb-2 font-[var(--font-space-grotesk)]">
      {children}
    </h2>
  );
}
