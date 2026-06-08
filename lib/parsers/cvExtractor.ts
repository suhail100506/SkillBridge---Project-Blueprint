export function extractCVData(text: string): {
  name: string;
  email: string;
  currentJobTitle: string;
  skills: string[];
} {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : '';

  // Extract name: usually the first non-empty line or simple guess
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const name = lines.length > 0 ? lines[0] : 'Applicant';

  // Guess job title: search for lines containing keywords
  const jobKeywords = ["developer", "designer", "teacher", "engineer", "manager", "analyst", "consultant", "coordinator", "officer", "administrator"];
  let currentJobTitle = "Career Transitioner";
  for (const line of lines) {
    if (line.toLowerCase().includes("experience") || line.toLowerCase().includes("work") || line.toLowerCase().includes("education")) {
      continue;
    }
    const lowerLine = line.toLowerCase();
    const matches = jobKeywords.filter(k => lowerLine.includes(k));
    if (matches.length > 0 && line.length < 50) {
      currentJobTitle = line;
      break;
    }
  }

  // Predefined list of skills to filter
  const commonSkills = [
    "Python", "SQL", "Excel", "Tableau", "Power BI", "Figma", "User Research", "Wireframing",
    "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express",
    "MongoDB", "Agile", "Scrum", "Git", "GitHub", "Linux", "Docker", "AWS", "Communication",
    "Public Speaking", "Writing", "Teaching", "Lesson Planning", "Grading", "Project Management",
    "Marketing", "Data Entry", "Photoshop", "Illustrator", "Java", "C++", "C#", "SEO", "Copywriting"
  ];

  const extractedSkills: string[] = [];
  const lowerText = text.toLowerCase();
  for (const skill of commonSkills) {
    // Escape regex characters
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const skillRegex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (skillRegex.test(lowerText)) {
      extractedSkills.push(skill);
    }
  }

  if (extractedSkills.length === 0) {
    extractedSkills.push("Excel", "Communication", "Management");
  }

  return {
    name,
    email,
    currentJobTitle,
    skills: extractedSkills
  };
}
export default extractCVData;
