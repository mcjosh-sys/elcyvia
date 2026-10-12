import type { ResumeContent } from "@/types/resume";

export function Preview({ content }: { content: ResumeContent }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = content;

  return (
    <div className="font-[var(--font-dm-sans)] text-[10px] leading-[1.5] text-gray-800 flex min-h-full">
      {/* Left sidebar */}
      <div className="w-[35%] bg-gray-900 text-gray-100 p-6 shrink-0">
        <h1 className="text-[16px] font-bold text-white font-[var(--font-space-grotesk)] leading-tight">
          {personalInfo.fullName || "Your Name"}
        </h1>

        {/* Contact */}
        <div className="mt-4 space-y-1 text-[8px] text-gray-300">
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
          {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
          {personalInfo.website && <div>{personalInfo.website}</div>}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mt-5">
            <SidebarTitle>Skills</SidebarTitle>
            {skills.map((group) => (
              <div key={group.id} className="mb-2.5">
                <div className="font-semibold text-[9px] text-emerald-400 mb-0.5">
                  {group.category}
                </div>
                <div className="text-gray-300 text-[8px]">
                  {group.items.join(" · ")}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mt-5">
            <SidebarTitle>Certifications</SidebarTitle>
            {certifications.map((entry) => (
              <div key={entry.id} className="mb-2">
                <div className="font-semibold text-[9px]">{entry.name}</div>
                <div className="text-gray-400 text-[8px]">
                  {entry.issuer}
                  {entry.date && ` · ${entry.date}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right content */}
      <div className="flex-1 p-6">
        {/* Summary */}
        {summary && (
          <div className="mb-5">
            <MainTitle>Profile</MainTitle>
            <p className="text-gray-700">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-5">
            <MainTitle>Experience</MainTitle>
            {experience.map((entry) => (
              <div key={entry.id} className="mb-3">
                <div className="font-semibold text-[11px]">{entry.title}</div>
                <div className="flex justify-between text-[9px]">
                  <span className="text-emerald-700 font-medium">
                    {entry.company}
                    {entry.location && ` · ${entry.location}`}
                  </span>
                  <span className="text-gray-400">
                    {entry.startDate}
                    {entry.current ? " – Present" : entry.endDate ? ` – ${entry.endDate}` : ""}
                  </span>
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
          <div className="mb-5">
            <MainTitle>Education</MainTitle>
            {education.map((entry) => (
              <div key={entry.id} className="mb-2">
                <div className="font-semibold text-[11px]">
                  {entry.degree}
                  {entry.field && ` in ${entry.field}`}
                </div>
                <div className="flex justify-between text-[9px]">
                  <span className="text-gray-600">{entry.institution}</span>
                  <span className="text-gray-400">
                    {entry.startDate}
                    {entry.current ? " – Present" : entry.endDate ? ` – ${entry.endDate}` : ""}
                  </span>
                </div>
                {entry.gpa && (
                  <div className="text-[8px] text-gray-500">GPA: {entry.gpa}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-5">
            <MainTitle>Projects</MainTitle>
            {projects.map((entry) => (
              <div key={entry.id} className="mb-2">
                <div className="font-semibold text-[11px]">{entry.name}</div>
                <p className="text-gray-700 mt-0.5">{entry.description}</p>
                {entry.technologies && entry.technologies.length > 0 && (
                  <div className="text-[8px] text-emerald-700 mt-0.5">
                    {entry.technologies.join(" · ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2 font-[var(--font-space-grotesk)]">
      {children}
    </h2>
  );
}

function MainTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[12px] font-bold uppercase tracking-wider text-gray-800 mb-2 pb-0.5 border-b-2 border-emerald-600 font-[var(--font-space-grotesk)]">
      {children}
    </h2>
  );
}
