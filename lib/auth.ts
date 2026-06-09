import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "./db/models/User";
import { connectToDatabase } from "./db/mongoose";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        await connectToDatabase();
        
        // Find user
        let user = await UserModel.findOne({ email: credentials.email });
        
        if (!user) {
          // Auto register user for hackathon convenience!
          const hashedPassword = await bcrypt.hash(credentials.password as string, 10);
          user = await UserModel.create({
            name: (credentials.email as string).split('@')[0],
            email: credentials.email,
            password: hashedPassword,
            provider: 'credentials',
            currentJobTitle: 'Student / Career Transitioner',
            industry: 'None',
            yearsExperience: 0,
            education: "Bachelor's",
            skills: { technical: [], soft: [], domain: [], tools: [] },
            location: 'Remote',
            preferredWorkType: 'remote',
            hoursPerWeekForLearning: 5,
            targetSalaryMin: 500000,
            targetSalaryMax: 1200000,
            xpPoints: 0,
            streak: 1,
            lastActiveDate: new Date(),
            badges: []
          });
        } else {
          // Verify password
          if (user.password) {
            const isMatch = await bcrypt.compare(credentials.password as string, user.password);
            if (!isMatch) return null;
          }
        }
        
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "default_nextauth_secret_for_hackathon_development",
});
export default handlers;
