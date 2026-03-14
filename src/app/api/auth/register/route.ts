import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

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

    // Map the incoming UI accountType ("VIEWER", "COMPANY") to Database roles
    let mappedRole: "USER" | "AGENT" | "AGENCY" | "ADMIN" = "USER";
    if (accountType === "AGENT") mappedRole = "AGENT";
    if (accountType === "COMPANY" || accountType === "AGENCY") mappedRole = "AGENCY";

    // Create user in DB
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        country,
        phoneCode,
        phoneNumber,
        role: mappedRole,
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
