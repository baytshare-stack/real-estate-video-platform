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
      include: { property: true }
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
          { property: { propertyType: sourceVideo.property?.propertyType } },
          { property: { city: sourceVideo.property?.city } },
        ]
      },
      include: {
        channel: { select: { name: true, avatar: true } },
        property: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10
    });

    // Map properties back if frontend relies on flat structure, similar to map route, 
    // or just return raw format as handled in search API. Let's return raw format since SearchClient was adapted.
    // However, some properties might expect flat. I will return the prisma response.

    return NextResponse.json(similarProperties, { status: 200 });

  } catch (error) {
    console.error("Recommendations API Error:", error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
