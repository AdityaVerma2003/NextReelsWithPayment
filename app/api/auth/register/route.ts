import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { sendVerificationEmail } from "@/app/helpers/sendVerificationEmail";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    await User.create({
      email,
      password,
    });
   
    // Send verification email and capture the response
    const emailResponse = await sendVerificationEmail(email);

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error("Email sending failed:", errorData);

      return NextResponse.json(
        { error: "User created, but verification email failed to send", details: errorData },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
