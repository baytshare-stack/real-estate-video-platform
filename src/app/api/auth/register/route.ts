import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      fullName, 
      email, 
      password, 
      country, 
      phoneCode, 
      phoneNumber, 
      accountType // VIEWER, AGENT, COMPANY
    } = body;

    // Validate minimal required fields
    if (!fullName || !email || !password || !accountType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user in DB
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        country,
        phoneCode,
        phoneNumber,
        role: accountType,
        // emailVerified is explicitly NULL by default
      },
    });

    // TODO: Implement OTP Email generation and sending here using Resend/SendGrid

    return NextResponse.json(
      { 
        message: "Registration successful. Please verify your email.",
        userId: newUser.id 
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
