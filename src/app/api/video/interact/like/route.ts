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

    const body = await req.json();
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
    }

    const userId = session.user.id;

    // Check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_videoId: { userId, videoId }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.$transaction([
        prisma.like.delete({
          where: { userId_videoId: { userId, videoId } }
        }),
        prisma.video.update({
          where: { id: videoId },
          data: { likesCount: { decrement: 1 } }
        })
      ]);
      return NextResponse.json({ liked: false }, { status: 200 });
    } else {
      // Like
      await prisma.$transaction([
        prisma.like.create({
          data: { userId, videoId }
        }),
        prisma.video.update({
          where: { id: videoId },
          data: { likesCount: { increment: 1 } }
        })
      ]);
      return NextResponse.json({ liked: true }, { status: 200 });
    }

  } catch (error) {
    console.error("Interaction API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
