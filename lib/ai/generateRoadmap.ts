import { SYSTEM_PROMPT_ROADMAP, USER_PROMPT_ROADMAP } from './prompts';
import { generateMockRoadmap } from '../utils/seedData';
import { seedResources } from '../utils/seedData';

interface GenerateRoadmapInput {
  userId: string;
  analysisId: string;
  targetCareer: string;
  targetCareerSlug: string;
  hoursPerWeek: number;
  profileData: any;
  analysisDetails: any;
}

export async function generateRoadmap(input: GenerateRoadmapInput): Promise<any> {
  const apiKeyOpenAI = process.env.OPENAI_API_KEY;
  const apiKeyAnthropic = process.env.ANTHROPIC_API_KEY;

  if (!apiKeyOpenAI && !apiKeyAnthropic) {
    console.warn("⚠️ No AI API Keys configured. Generating SIMULATED 90-day reskilling plan.");
    await new Promise(resolve => setTimeout(resolve, 2000));
    return createSimulatedRoadmap(input);
  }

  const prompt = USER_PROMPT_ROADMAP
    .replace('{profileData}', JSON.stringify(input.profileData))
    .replace('{targetCareer}', input.targetCareer)
    .replace('{analysisDetails}', JSON.stringify(input.analysisDetails));

  try {
    let resultText = "";
    if (apiKeyOpenAI) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKeyOpenAI}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: SYSTEM_PROMPT_ROADMAP },
            { role: "user", content: prompt }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        })
      });
      if (!response.ok) throw new Error(`OpenAI responded with status ${response.status}`);
      const data = await response.json();
      resultText = data.choices[0].message.content;
    } else if (apiKeyAnthropic) {
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
          system: SYSTEM_PROMPT_ROADMAP,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3
        })
      });
      if (!response.ok) throw new Error(`Anthropic responded with status ${response.status}`);
      const data = await response.json();
      resultText = data.content[0].text;
    }

    const jsonParsed = JSON.parse(resultText);
    
    // Add additional metadata required for Roadmap model
    return {
      userId: input.userId,
      analysisId: input.analysisId,
      targetCareer: input.targetCareer,
      targetCareerSlug: input.targetCareerSlug,
      totalDays: 90,
      status: 'active',
      overallProgress: 0,
      currentDay: 1,
      phases: jsonParsed.phases.map((phase: any) => ({
        ...phase,
        weeks: phase.weeks.map((week: any) => ({
          ...week,
          status: 'not_started',
          tasks: week.tasks.map((task: any) => ({
            ...task,
            completed: false,
            completedAt: null
          }))
        }))
      })),
      totalXP: jsonParsed.phases.reduce((acc: number, p: any) => 
        acc + p.weeks.reduce((wAcc: number, w: any) => 
          wAcc + w.tasks.reduce((tAcc: number, t: any) => tAcc + (t.xpReward || 10), 0)
        , 0)
      , 0),
      earnedXP: 0
    };
  } catch (error) {
    console.error("❌ Live AI Roadmap generation failed. Falling back to Simulated Roadmap.", error);
    return createSimulatedRoadmap(input);
  }
}

// Generates dynamic, high-quality, pre-defined 13-week study roadmap based on target career slug
function createSimulatedRoadmap(input: GenerateRoadmapInput): any {
  const careerSlug = input.targetCareerSlug;
  const isData = careerSlug === 'data-analyst';
  const isUX = careerSlug === 'ux-designer';
  const isSecurity = careerSlug === 'cybersecurity-analyst';
  const isDev = careerSlug === 'full-stack-developer';
  
  // Filter resources for this career
  const relatedResources = seedResources.filter(r => r.careerPath === careerSlug);

  // If we have a preseeded mock roadmap for the target career, let's load or extrapolate it
  const baseRoadmap = generateMockRoadmap(input.userId, input.analysisId);
  
  if (isData) {
    // Return standard mock roadmap, but set progress to 0 for a freshly generated one
    return {
      ...baseRoadmap,
      targetCareer: "Data Analyst",
      targetCareerSlug: "data-analyst",
      overallProgress: 0,
      currentDay: 1,
      earnedXP: 0,
      phases: baseRoadmap.phases.map((phase: any) => ({
        ...phase,
        weeks: phase.weeks.map((week: any) => ({
          ...week,
          status: 'not_started' as const,
          tasks: week.tasks.map((task: any) => ({
            ...task,
            completed: false,
            completedAt: null
          })),
          milestoneCompleted: false
        }))
      }))
    };
  }

  // Fallback structure for other careers (UX, Security, Dev, PM)
  const defaultTheme = isUX ? "Design Foundations" : isSecurity ? "Network Basics" : isDev ? "HTML & CSS Layouts" : "Agile & Backlogs";
  const mockResource = relatedResources[0] || {
    title: `Introductory Guide to ${input.targetCareer}`,
    platform: "YouTube",
    url: "https://www.youtube.com",
    duration: "2 hours",
    free: true
  };

  const phases = [
    {
      phaseNumber: 1 as const,
      title: "Phase 1: Foundations (Days 1–30)",
      description: `Grasp the core terminology, principles, and initial tools required for ${input.targetCareer}.`,
      startDay: 1,
      endDay: 30,
      weeks: Array.from({ length: 4 }).map((_, i) => ({
        weekNumber: i + 1,
        theme: i === 0 ? defaultTheme : `Week ${i + 1}: Tool mastery & Core syntax`,
        status: 'not_started' as const,
        tasks: [
          {
            id: `w${i+1}-t1`,
            title: `Study the fundamentals of ${input.targetCareer}`,
            type: "watch" as const,
            estimatedMinutes: 60,
            resource: {
              platform: mockResource.platform,
              url: mockResource.url,
              title: mockResource.title,
              duration: mockResource.duration,
              free: true
            },
            completed: false,
            completedAt: null,
            xpReward: 20
          },
          {
            id: `w${i+1}-t2`,
            title: "Hands-on basic layout practice",
            type: "practice" as const,
            estimatedMinutes: 45,
            resource: {
              platform: "GitHub / Figma",
              url: "https://github.com",
              title: "Interactive practice exercises",
              duration: "45 mins",
              free: true
            },
            completed: false,
            completedAt: null,
            xpReward: 15
          }
        ],
        milestone: `Complete Phase 1 challenge for ${input.targetCareer}`,
        milestoneCompleted: false
      }))
    },
    {
      phaseNumber: 2 as const,
      title: "Phase 2: Intermediate Implementation (Days 31–60)",
      description: "Dive deep into industry projects, learning integration, APIs, or advanced wireframing workflows.",
      startDay: 31,
      endDay: 60,
      weeks: Array.from({ length: 4 }).map((_, i) => ({
        weekNumber: i + 5,
        theme: `Week ${i + 5}: Dynamic workflows and frameworks`,
        status: 'not_started' as const,
        tasks: [
          {
            id: `w${i+5}-t1`,
            title: "Work along with a comprehensive build tutorial",
            type: "build" as const,
            estimatedMinutes: 120,
            resource: {
              platform: "YouTube",
              url: "https://www.youtube.com",
              title: "Build project walkthrough",
              duration: "2 hours",
              free: true
            },
            completed: false,
            completedAt: null,
            xpReward: 40
          }
        ],
        milestone: `Deliver intermediate mockup / setup`,
        milestoneCompleted: false
      }))
    },
    {
      phaseNumber: 3 as const,
      title: "Phase 3: Portfolio & Apply (Days 61–90)",
      description: "Fine-tune your resume, publish your projects to GitHub, and begin applying for micro-internships.",
      startDay: 61,
      endDay: 90,
      weeks: Array.from({ length: 5 }).map((_, i) => ({
        weekNumber: i + 9,
        theme: `Week ${i + 9}: Portfolio assembly & networking`,
        status: 'not_started' as const,
        tasks: [
          {
            id: `w${i+9}-t1`,
            title: "Join local community forums & post your profile",
            type: "network" as const,
            estimatedMinutes: 30,
            resource: {
              platform: "LinkedIn / Discord",
              url: "https://linkedin.com",
              title: "Transition community networks",
              duration: "30 mins",
              free: true
            },
            completed: false,
            completedAt: null,
            xpReward: 15
          }
        ],
        milestone: i === 4 ? `Earn the "${input.targetCareer} Bridger" certificate badge` : null,
        milestoneCompleted: false
      }))
    }
  ];

  return {
    userId: input.userId,
    analysisId: input.analysisId,
    targetCareer: input.targetCareer,
    targetCareerSlug: input.targetCareerSlug,
    totalDays: 90,
    status: 'active' as const,
    overallProgress: 0,
    currentDay: 1,
    phases,
    totalXP: 320,
    earnedXP: 0
  };
}
