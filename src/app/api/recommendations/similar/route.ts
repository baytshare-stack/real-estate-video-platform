import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
    }

    // First fetch the source video to understand what to recommend against
    const sourceVideo = await prisma.video.findUnique({
      where: { id: videoId },
      select: { propertyType: true, city: true, price: true }
    });

    if (!sourceVideo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Find similar properties: Matches same PropertyType OR same City, excluding the source video itself.
    // For a highly complex recommendation engine (Phase 6), this also factors in ViewHistory
    const similarProperties = await prisma.video.findMany({
      where: {
        id: { not: videoId },
        OR: [
          { propertyType: sourceVideo.propertyType },
          { city: sourceVideo.city },
        ]
      },
      include: {
        channel: { select: { channelName: true, avatarUrl: true } }
      },
      orderBy: {
        viewsCount: "desc"
      },
      take: 10
    });

    return NextResponse.json(similarProperties, { status: 200 });

  } catch (error) {
    console.error("Recommendations API Error:", error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
