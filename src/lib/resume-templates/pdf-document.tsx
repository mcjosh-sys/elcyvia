import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { ResumeContent } from "@/types/resume";

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
      fontWeight: 700,
    },
  ],
});

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    lineHeight: 1.5,
    color: "#1f2937",
    padding: 40,
  },
  header: {
    textAlign: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#1f2937",
  },
  name: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
    fontSize: 9,
    color: "#6b7280",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    marginTop: 12,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  entryTitle: {
    fontSize: 11,
    fontWeight: 600,
  },
  entrySubtitle: {
    fontSize: 9,
    color: "#6b7280",
    fontStyle: "italic",
  },
  entryDate: {
    fontSize: 8,
    color: "#9ca3af",
  },
  entryDesc: {
    marginTop: 3,
    color: "#374151",
  },
  entryBlock: {
    marginBottom: 8,
  },
  skillRow: {
    marginBottom: 2,
  },
  skillCategory: {
    fontWeight: 600,
  },
  summary: {
    color: "#374151",
    marginBottom: 4,
  },
});

export function ResumePDFDocument({ content }: { content: ResumeContent }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = content;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.name}>
            {personalInfo.fullName || "Your Name"}
          </Text>
          <View style={s.contactRow}>
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text>| {personalInfo.phone}</Text>}
            {personalInfo.location && <Text>| {personalInfo.location}</Text>}
            {personalInfo.linkedin && <Text>| {personalInfo.linkedin}</Text>}
            {personalInfo.website && <Text>| {personalInfo.website}</Text>}
          </View>
        </View>

        {/* Summary */}
        {summary && (
          <View>
            <Text style={s.sectionTitle}>Summary</Text>
            <Text style={s.summary}>{summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Experience</Text>
            {experience.map((entry) => (
              <View key={entry.id} style={s.entryBlock}>
                <View style={s.entryHeader}>
                  <Text style={s.entryTitle}>{entry.title}</Text>
                  <Text style={s.entryDate}>
                    {entry.startDate}
                    {entry.current ? " – Present" : entry.endDate ? ` – ${entry.endDate}` : ""}
                  </Text>
                </View>
                <Text style={s.entrySubtitle}>
                  {entry.company}
                  {entry.location && `, ${entry.location}`}
                </Text>
                {entry.description && (
                  <Text style={s.entryDesc}>{entry.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Education</Text>
            {education.map((entry) => (
              <View key={entry.id} style={s.entryBlock}>
                <View style={s.entryHeader}>
                  <Text style={s.entryTitle}>
                    {entry.degree}
                    {entry.field && ` in ${entry.field}`}
                  </Text>
                  <Text style={s.entryDate}>
                    {entry.startDate}
                    {entry.current ? " – Present" : entry.endDate ? ` – ${entry.endDate}` : ""}
                  </Text>
                </View>
                <Text style={s.entrySubtitle}>{entry.institution}</Text>
                {entry.gpa && (
                  <Text style={{ fontSize: 9, color: "#6b7280" }}>
                    GPA: {entry.gpa}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Skills</Text>
            {skills.map((group) => (
              <View key={group.id} style={s.skillRow}>
                <Text>
                  <Text style={s.skillCategory}>{group.category}: </Text>
                  <Text>{group.items.join(", ")}</Text>
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Projects</Text>
            {projects.map((entry) => (
              <View key={entry.id} style={s.entryBlock}>
                <Text style={s.entryTitle}>{entry.name}</Text>
                <Text style={s.entryDesc}>{entry.description}</Text>
                {entry.technologies && entry.technologies.length > 0 && (
                  <Text style={{ fontSize: 8, color: "#9ca3af", marginTop: 2 }}>
                    {entry.technologies.join(" · ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Certifications</Text>
            {certifications.map((entry) => (
              <View key={entry.id} style={s.skillRow}>
                <Text>
                  <Text style={s.skillCategory}>{entry.name}</Text>
                  <Text> — {entry.issuer}</Text>
                  {entry.date && (
                    <Text style={{ color: "#9ca3af" }}> ({entry.date})</Text>
                  )}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
