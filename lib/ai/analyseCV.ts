import { SYSTEM_PROMPT_ANALYSE, USER_PROMPT_ANALYSE } from './prompts';
import { sampleAnalysis } from '../utils/seedData';

interface ProfileInput {
  currentJobTitle: string;
  industry: string;
  yearsExperience: number;
  education: string;
  skills: string[];
  location: string;
  preferredWorkType: string;
  hoursPerWeekForLearning: number;
  targetSalaryMin: number;
  targetSalaryMax: number;
  learningStyle?: string;
}

export async function analyseProfile(profile: ProfileInput): Promise<any> {
  const profileJsonStr = JSON.stringify(profile, null, 2);
  const prompt = USER_PROMPT_ANALYSE.replace('{profileData}', profileJsonStr);

  const apiKeyOpenAI = process.env.OPENAI_API_KEY;
  const apiKeyAnthropic = process.env.ANTHROPIC_API_KEY;

  if (!apiKeyOpenAI && !apiKeyAnthropic) {
    console.warn("⚠️ No AI API Keys configured. Generating high-quality SIMULATED analysis report.");
    // Wait 2s to simulate network latency for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));
    return generateMockAnalysis(profile);
  }

  try {
    if (apiKeyOpenAI) {
      // Call OpenAI API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKeyOpenAI}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: SYSTEM_PROMPT_ANALYSE },
            { role: "user", content: prompt }
          ],
          temperature: 0.2,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI responded with status ${response.status}`);
      }

      const resData = await response.json();
      const rawText = resData.choices[0].message.content;
      return JSON.parse(rawText);
    } else if (apiKeyAnthropic) {
      // Call Anthropic API
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKeyAnthropic,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 4000,
          system: SYSTEM_PROMPT_ANALYSE,
          messages: [
            { role: "user", content: prompt }
          ],
          temperature: 0.2
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic responded with status ${response.status}`);
      }

      const resData = await response.json();
      const rawText = resData.content[0].text;
      return JSON.parse(rawText);
    }
  } catch (error) {
    console.error("❌ Live AI Completion failed. Falling back to Simulated Analysis engine.", error);
    return generateMockAnalysis(profile);
  }
}

// Generate dynamic mock analysis matching the profile
function generateMockAnalysis(profile: ProfileInput): any {
  const userSkills = profile.skills.map(s => s.toLowerCase());
  
  // Customise recommendations based on profile title / skills
  const isTechCurrent = profile.industry.toLowerCase() === 'tech' || 
                        userSkills.includes('javascript') || 
                        userSkills.includes('python') || 
                        userSkills.includes('programming');

  let recs = [];
  if (isTechCurrent) {
    // If they already have some programming skills, suggest advanced tech roles
    recs = [
      {
        careerTitle: "Full Stack Developer",
        careerSlug: "full-stack-developer",
        matchPercentage: 86,
        whyItFits: `Since you already have basic coding knowledge, transitioning to Full Stack Development is a natural next step. Your understanding of syntax maps directly to standard React components and database management.`,
        skillsYouHave: profile.skills.slice(0, 3),
        skillsNeeded: ["React / Next.js", "Node.js & Express", "MongoDB & SQL", "REST API Development"],
        salaryRange: { min: 600000, mid: 1100000, max: 1900000, currency: "INR" },
        demandGrowth: 25,
        jobsDemandData: [
          { year: 2022, count: 28000 },
          { year: 2023, count: 32000 },
          { year: 2024, count: 37000 },
          { year: 2025, count: 43000 },
          { year: 2026, count: 51000 },
          { year: 2027, count: 60000 }
        ]
      },
      {
        careerTitle: "Data Analyst",
        careerSlug: "data-analyst",
        matchPercentage: 80,
        whyItFits: `Your technical skills are highly compatible with building query layers. Transitioning into data analysis will allow you to leverage Python and SQL libraries immediately.`,
        skillsYouHave: profile.skills.slice(0, 3),
        skillsNeeded: ["SQL queries", "Tableau dashboard design", "Business Intelligence", "Introductory Statistics"],
        salaryRange: { min: 450000, mid: 800000, max: 1400000, currency: "INR" },
        demandGrowth: 23,
        jobsDemandData: [
          { year: 2022, count: 42000 },
          { year: 2023, count: 48300 },
          { year: 2024, count: 54600 },
          { year: 2025, count: 62100 },
          { year: 2026, count: 71400 },
          { year: 2027, count: 81900 }
        ]
      },
      {
        careerTitle: "Cybersecurity Analyst",
        careerSlug: "cybersecurity-analyst",
        matchPercentage: 72,
        whyItFits: `With solid scripting foundations, adding network protocols and vulnerability scanning modules will transition you into a highly sought-after security specialist.`,
        skillsYouHave: profile.skills.slice(0, 2),
        skillsNeeded: ["Network Security", "Linux Administration", "Incident Response", "Vulnerability Scanning"],
        salaryRange: { min: 550000, mid: 1000000, max: 1800000, currency: "INR" },
        demandGrowth: 32,
        jobsDemandData: [
          { year: 2022, count: 12000 },
          { year: 2023, count: 14400 },
          { year: 2024, count: 17200 },
          { year: 2025, count: 21000 },
          { year: 2026, count: 25000 },
          { year: 2027, count: 30000 }
        ]
      }
    ];
  } else {
    // Default recommendations based on teacher demo data
    recs = sampleAnalysis.recommendations.map(r => ({
      ...r,
      skillsYouHave: profile.skills.slice(0, 3)
    }));
  }

  // Calculate dynamic skill breakdown
  const strong = profile.skills.slice(0, 3);
  const developing = profile.skills.slice(3, 5);
  const transferable = ["Active Listening", "Problem Solving", "Collaboration"];
  const gaps = recs[0].skillsNeeded;

  return {
    inputType: "manual",
    rawInput: JSON.stringify(profile),
    extractedSkills: { strong, developing, transferable, gaps },
    overallScore: isTechCurrent ? 84 : 78,
    recommendations: recs,
    aiSummary: `You have a very promising background. By leveraging your experience in "${profile.currentJobTitle || 'your current role'}", you possess critical soft skills like communication and task organization. Learning tools like SQL and Figma will open direct transition opportunities.`,
    shareToken: Math.random().toString(36).substring(2, 15)
  };
}
