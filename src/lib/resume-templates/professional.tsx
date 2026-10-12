import type { ResumeContent } from "@/types/resume";

export function Preview({ content }: { content: ResumeContent }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = content;

  return (
    <div className="font-[var(--font-dm-sans)] text-[10px] leading-[1.5] text-gray-800 p-8">
      {/* Header */}
      <div className="text-center mb-5 pb-4 border-b-2 border-gray-800">
        <h1 className="text-[18px] font-bold tracking-wide uppercase font-[var(--font-space-grotesk)]">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex items-center justify-center gap-2 mt-1.5 text-[9px] text-gray-600 flex-wrap">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && (
            <>
              <span className="text-gray-300">|</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.location && (
            <>
              <span className="text-gray-300">|</span>
              <span>{personalInfo.location}</span>
            </>
          )}
          {personalInfo.linkedin && (
            <>
              <span className="text-gray-300">|</span>
              <span>{personalInfo.linkedin}</span>
            </>
          )}
          {personalInfo.website && (
            <>
              <span className="text-gray-300">|</span>
              <span>{personalInfo.website}</span>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <SectionTitle>Summary</SectionTitle>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <SectionTitle>Experience</SectionTitle>
          {experience.map((entry) => (
            <div key={entry.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <div className="font-semibold text-[11px]">{entry.title}</div>
                <div className="text-[8px] text-gray-500">
                  {entry.startDate}
                  {entry.current ? " – Present" : entry.endDate ? ` – ${entry.endDate}` : ""}
                </div>
              </div>
              <div className="text-gray-600 italic text-[9px]">
                {entry.company}
                {entry.location && `, ${entry.location}`}
              </div>
              {entry.description && (
                <p className="mt-1 text-gray-700 whitespace-pre-line">
                  {entry.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4">
          <SectionTitle>Education</SectionTitle>
          {education.map((entry) => (
            <div key={entry.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <div className="font-semibold text-[11px]">
                  {entry.degree}
                  {entry.field && ` in ${entry.field}`}
                </div>
                <div className="text-[8px] text-gray-500">
                  {entry.startDate}
                  {entry.current ? " – Present" : entry.endDate ? ` – ${entry.endDate}` : ""}
                </div>
              </div>
              <div className="text-gray-600 italic text-[9px]">
                {entry.institution}
              </div>
              {entry.gpa && (
                <div className="text-[9px] text-gray-600 mt-0.5">
                  GPA: {entry.gpa}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <SectionTitle>Skills</SectionTitle>
          {skills.map((group) => (
            <div key={group.id} className="mb-1">
              <span className="font-semibold">{group.category}: </span>
              <span className="text-gray-700">{group.items.join(", ")}</span>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-4">
          <SectionTitle>Projects</SectionTitle>
          {projects.map((entry) => (
            <div key={entry.id} className="mb-2">
              <div className="font-semibold text-[11px]">
                {entry.name}
                {entry.url && (
                  <span className="font-normal text-gray-500 text-[8px] ml-1">
                    {entry.url}
                  </span>
                )}
              </div>
              <p className="text-gray-700 mt-0.5">{entry.description}</p>
              {entry.technologies && entry.technologies.length > 0 && (
                <div className="text-[8px] text-gray-500 mt-0.5">
                  {entry.technologies.join(" · ")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-4">
          <SectionTitle>Certifications</SectionTitle>
          {certifications.map((entry) => (
            <div key={entry.id} className="mb-1">
              <span className="font-semibold">{entry.name}</span>
              <span className="text-gray-600"> — {entry.issuer}</span>
              {entry.date && (
                <span className="text-gray-500 text-[8px] ml-1">
                  ({entry.date})
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
    <h2 className="text-[12px] font-bold uppercase tracking-wider text-gray-800 mb-2 pb-0.5 border-b border-gray-300 font-[var(--font-space-grotesk)]">
      {children}
    </h2>
  );
}
