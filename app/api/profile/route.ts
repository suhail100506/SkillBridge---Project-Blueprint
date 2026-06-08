import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import UserModel from "@/lib/db/models/User";

export const dynamic = "force-dynamic";

// GET user profile data
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthenticated session" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await UserModel.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error in profile GET API:", error);
    return NextResponse.json({ error: error.message || "Failed to load profile" }, { status: 500 });
  }
}

// UPDATE user profile settings / preferences / progress metrics
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthenticated session" }, { status: 401 });
    }

    const updates = await req.json();
    await connectToDatabase();

    const updatedUser = await UserModel.findByIdAndUpdate(
      session.user.id,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Error in profile UPDATE API:", error);
    return NextResponse.json({ error: error.message || "Failed to save profile updates" }, { status: 500 });
  }
}
