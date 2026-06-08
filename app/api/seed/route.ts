import { NextResponse } from 'next/server';
import { connectToDatabase, readMockDb, writeMockDb } from '@/lib/db/mongoose';
import CareerModel from '@/lib/db/models/Career';
import InternshipModel from '@/lib/db/models/Internship';
import UserModel from '@/lib/db/models/User';
import AnalysisModel from '@/lib/db/models/Analysis';
import RoadmapModel from '@/lib/db/models/Roadmap';
import { seedCareers, seedInternships, seedResources, sampleAnalysis, generateMockRoadmap } from '@/lib/utils/seedData';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const connection = await connectToDatabase();
    
    if (connection.isMock) {
      // Mock Seeding
      const db = readMockDb();
      
      // Seed careers and internships
      db.careers = seedCareers;
      db.internships = seedInternships;
      db.resources = seedResources;
      
      // Setup a demo user
      const hashedPassword = await bcrypt.hash("password123", 10);
      const demoUser = {
        _id: "demo-user-id",
        name: "Demo Transitioner",
        email: "demo@skillbridge.com",
        password: hashedPassword,
        provider: "credentials" as const,
        currentJobTitle: "High School Teacher",
        industry: "Education",
        yearsExperience: 5,
        education: "Bachelor's",
        skills: {
          technical: ["Excel", "Basic Python"],
          soft: ["Communication", "Public Speaking"],
          domain: ["Lesson Planning", "Grading"],
          tools: []
        },
        location: "Remote",
        preferredWorkType: "remote" as const,
        hoursPerWeekForLearning: 8,
        targetSalaryMin: 450000,
        targetSalaryMax: 1400000,
        xpPoints: 70,
        streak: 3,
        lastActiveDate: new Date().toISOString(),
        badges: ["First Step", "Halfway Hero"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Update users collection
      const userIndex = db.users.findIndex((u: any) => u._id === "demo-user-id");
      if (userIndex > -1) db.users[userIndex] = demoUser;
      else db.users.push(demoUser);

      // Seed analysis for demo user
      const demoAnalysis = {
        _id: "demo-analysis-id",
        userId: "demo-user-id",
        createdAt: new Date().toISOString(),
        ...sampleAnalysis
      };
      const analysisIndex = db.analyses.findIndex((a: any) => a._id === "demo-analysis-id");
      if (analysisIndex > -1) db.analyses[analysisIndex] = demoAnalysis;
      else db.analyses.push(demoAnalysis);

      // Seed roadmap for demo user
      const demoRoadmap = {
        _id: "demo-roadmap-id",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...generateMockRoadmap("demo-user-id", "demo-analysis-id")
      };
      const roadmapIndex = db.roadmaps.findIndex((r: any) => r._id === "demo-roadmap-id");
      if (roadmapIndex > -1) db.roadmaps[roadmapIndex] = demoRoadmap;
      else db.roadmaps.push(demoRoadmap);

      writeMockDb(db);
      
      return NextResponse.json({
        success: true,
        mode: "MOCK DATABASE",
        message: "Demo user, mock analysis, roadmap, careers, resources, and internships seeded successfully."
      });
    }

    // Live MongoDB Seeding
    // Clear collections
    await CareerModel.deleteMany({});
    await InternshipModel.deleteMany({});
    
    // Seed careers and internships
    await CareerModel.insertMany(seedCareers);
    await InternshipModel.insertMany(seedInternships);

    // Setup demo user
    const hashedPassword = await bcrypt.hash("password123", 10);
    const demoUser = await UserModel.findOneAndUpdate(
      { email: "demo@skillbridge.com" },
      {
        name: "Demo Transitioner",
        email: "demo@skillbridge.com",
        password: hashedPassword,
        provider: "credentials",
        currentJobTitle: "High School Teacher",
        industry: "Education",
        yearsExperience: 5,
        education: "Bachelor's",
        skills: {
          technical: ["Excel", "Basic Python"],
          soft: ["Communication", "Public Speaking"],
          domain: ["Lesson Planning", "Grading"],
          tools: []
        },
        location: "Remote",
        preferredWorkType: "remote",
        hoursPerWeekForLearning: 8,
        targetSalaryMin: 450000,
        targetSalaryMax: 1400000,
        xpPoints: 70,
        streak: 3,
        lastActiveDate: new Date(),
        badges: ["First Step", "Halfway Hero"]
      },
      { upsert: true, new: true }
    );

    // Seed analysis
    const demoAnalysis = await AnalysisModel.findOneAndUpdate(
      { userId: demoUser._id },
      {
        userId: demoUser._id,
        ...sampleAnalysis
      },
      { upsert: true, new: true }
    );

    // Seed roadmap
    const mockRoadmap = generateMockRoadmap(demoUser._id.toString(), demoAnalysis._id.toString());
    await RoadmapModel.findOneAndUpdate(
      { userId: demoUser._id },
      {
        ...mockRoadmap,
        userId: demoUser._id,
        analysisId: demoAnalysis._id
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      mode: "MONGODB LIVE DATABASE",
      message: "Demo user, live analysis, roadmap, careers, and internships seeded successfully."
    });

  } catch (error: any) {
    console.error("Error seeding database:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to seed database"
    }, { status: 500 });
  }
}
