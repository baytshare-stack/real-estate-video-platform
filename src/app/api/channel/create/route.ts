import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only AGENT and COMPANY roles can create channels
    if (session.user.role === "VIEWER") {
       return NextResponse.json({ error: "Viewers cannot create channels" }, { status: 403 });
    }

    const body = await req.json();
    const { channelName, description, avatarUrl, bannerUrl } = body;

    if (!channelName) {
      return NextResponse.json({ error: "Channel Name is required" }, { status: 400 });
    }

    const existingChannel = await prisma.channel.findUnique({
      where: { userId: session.user.id }
    });

    if (existingChannel) {
      return NextResponse.json({ error: "User already has a channel" }, { status: 409 });
    }

    const newChannel = await prisma.channel.create({
      data: {
        userId: session.user.id,
        channelName,
        description,
        avatarUrl,
        bannerUrl
      }
    });

    return NextResponse.json(newChannel, { status: 201 });

  } catch (error) {
    console.error("Channel Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
