export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  provider: "google" | "credentials";
  currentJobTitle: string;
  industry: string;
  yearsExperience: number;
  education: string;
  skills: {
    technical: string[];
    soft: string[];
    domain: string[];
    tools: string[];
  };
  location: string;
  preferredWorkType: "remote" | "hybrid" | "onsite";
  hoursPerWeekForLearning: number;
  targetSalaryMin: number;
  targetSalaryMax: number;
  xpPoints: number;
  streak: number;
  lastActiveDate: string;
  badges: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Career {
  _id: string;
  slug: string;
  title: string;
  description: string;
  industry: string;
  typicalDayDescription: string;
  salaryIndia: { entry: number; mid: number; senior: number; lead: number };
  salaryGlobal: { entry: number; mid: number; senior: number; lead: number };
  demandTrend: { year: number; indexValue: number }[];
  demandGrowthRate: number;
  remotePercentage: number;
  requiredSkills: { name: string; priority: "must" | "nice"; learningHours: number }[];
  topCertifications: string[];
  topHiringCompanies: string[];
  relatedCareers: string[];
  tags: string[];
}

export interface Internship {
  _id: string;
  company: string;
  logo: string;
  title: string;
  description: string;
  skills_required: string[];
  skills_gained: string[];
  duration_weeks: number;
  remote: boolean;
  stipend: number | null;
  deadline: string;
  spots_total: number;
  spots_remaining: number;
  career_path: string[];
  apply_url: string;
  verified: boolean;
}

export interface Recommendation {
  careerTitle: string;
  careerSlug: string;
  matchPercentage: number;
  whyItFits: string;
  skillsYouHave: string[];
  skillsNeeded: string[];
  salaryRange: { min: number; mid: number; max: number; currency: string };
  demandGrowth: number;
  jobsDemandData: { year: number; count: number }[];
}

export interface Analysis {
  _id: string;
  userId?: string;
  inputType: "cv" | "manual";
  rawInput: string;
  extractedSkills: {
    strong: string[];
    developing: string[];
    transferable: string[];
    gaps: string[];
  };
  overallScore: number;
  recommendations: Recommendation[];
  aiSummary: string;
  shareToken: string;
  createdAt: string;
}

export interface RoadmapTask {
  id: string;
  title: string;
  type: "watch" | "read" | "practice" | "build" | "network";
  estimatedMinutes: number;
  resource: {
    platform: string;
    url: string;
    title: string;
    duration: string;
    free: boolean;
  };
  completed: boolean;
  completedAt: string | null;
  xpReward: number;
}

export interface RoadmapWeek {
  weekNumber: number;
  theme: string;
  status: "not_started" | "in_progress" | "completed";
  tasks: RoadmapTask[];
  milestone: string | null;
  milestoneCompleted: boolean;
}

export interface RoadmapPhase {
  phaseNumber: 1 | 2 | 3;
  title: string;
  description: string;
  startDay: number;
  endDay: number;
  weeks: RoadmapWeek[];
}

export interface Roadmap {
  _id: string;
  userId?: string;
  analysisId?: string;
  targetCareer: string;
  targetCareerSlug: string;
  totalDays: number;
  status: "active" | "completed" | "paused";
  overallProgress: number;
  currentDay: number;
  phases: RoadmapPhase[];
  totalXP: number;
  earnedXP: number;
  createdAt: string;
  updatedAt: string;
}
export default {};
