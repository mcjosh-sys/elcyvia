export const RESUME_GENERATION_SYSTEM = `You are an expert resume writer. Generate a professional resume tailored to the target role.

Output a JSON object with this exact structure:
{
  "personalInfo": { "fullName": "", "email": "" },
  "summary": "2-3 sentence professional summary",
  "experience": [
    {
      "id": "unique-id",
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "startDate": "Mon YYYY",
      "endDate": "Mon YYYY",
      "current": false,
      "description": "2-4 bullet points describing achievements using action verbs and metrics"
    }
  ],
  "education": [
    {
      "id": "unique-id",
      "institution": "University Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "startDate": "Mon YYYY",
      "endDate": "Mon YYYY",
      "current": false
    }
  ],
  "skills": [
    { "id": "unique-id", "category": "Category Name", "items": ["skill1", "skill2"] }
  ],
  "projects": [],
  "certifications": []
}

Rules:
- Tailor content to the target job title and description
- Use strong action verbs and quantifiable achievements
- Include 2-3 relevant work experiences
- Include 3-4 skill categories relevant to the role
- Keep the summary concise and impactful
- Use realistic but generic placeholder content if personal info is not provided
- Generate unique IDs for each entry (use descriptive slugs like "exp-1", "edu-1", etc.)`;

export function buildGenerationPrompt(
  jobTitle: string,
  jobDescription?: string,
  personalInfo?: { fullName?: string; email?: string }
): string {
  let prompt = `Generate a professional resume for the role: ${jobTitle}`;

  if (jobDescription) {
    prompt += `\n\nJob Description:\n${jobDescription}`;
  }

  if (personalInfo?.fullName || personalInfo?.email) {
    prompt += `\n\nUse this personal information:`;
    if (personalInfo.fullName) prompt += `\nName: ${personalInfo.fullName}`;
    if (personalInfo.email) prompt += `\nEmail: ${personalInfo.email}`;
  }

  return prompt;
}

export const SECTION_ENHANCE_SYSTEM = `You are an expert resume writer. Improve the provided resume section content to be more impactful, professional, and tailored for ATS systems.

Rules:
- Use strong action verbs (Led, Developed, Implemented, Optimized, etc.)
- Include quantifiable metrics where possible (%, $, numbers)
- Be concise but impactful
- Maintain the same general structure and meaning
- Return the improved content in the exact same JSON format as the input
- Do not add fields that weren't in the input`;

export function buildEnhancePrompt(
  section: string,
  content: unknown,
  instruction?: string
): string {
  let prompt = `Improve the following "${section}" section of a resume:\n\n${JSON.stringify(content, null, 2)}`;

  if (instruction) {
    prompt += `\n\nAdditional instructions: ${instruction}`;
  }

  prompt += `\n\nReturn the improved version as JSON in the exact same structure.`;
  return prompt;
}

export const RESUME_PARSE_SYSTEM = `You are a resume parser. Extract structured data from the raw text of a resume.

Output a JSON object with this exact structure:
{
  "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "website": "" },
  "summary": "professional summary if present",
  "experience": [
    {
      "id": "exp-1",
      "title": "",
      "company": "",
      "location": "",
      "startDate": "Mon YYYY",
      "endDate": "Mon YYYY or empty if current",
      "current": false,
      "description": "combined description text"
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "institution": "",
      "degree": "",
      "field": "",
      "startDate": "Mon YYYY",
      "endDate": "Mon YYYY",
      "current": false,
      "gpa": ""
    }
  ],
  "skills": [
    { "id": "skills-1", "category": "", "items": [] }
  ],
  "projects": [
    { "id": "proj-1", "name": "", "description": "", "url": "", "technologies": [] }
  ],
  "certifications": [
    { "id": "cert-1", "name": "", "issuer": "", "date": "", "url": "" }
  ]
}

Rules:
- Extract all information accurately from the text
- Use empty arrays for sections with no data
- Normalize dates to "Mon YYYY" format
- Set "current" to true for ongoing positions/education
- Group skills by category when possible
- Include only fields that have data`;

export function buildParsePrompt(rawText: string): string {
  return `Parse this resume text into structured JSON:\n\n${rawText}`;
}
