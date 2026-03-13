import { NextResponse } from "next/server";
import { PrismaClient, AdType } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") as AdType || "PRE_ROLL";
    
    // In a real ad engine, we would parse user demographics, location, and behavior
    // to match against `targetAudience` JSON fields.
    const activeAds = await prisma.advertisement.findMany({
      where: {
        type,
        status: "ACTIVE",
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      take: 1, // Return 1 ad to play
      orderBy: {
        createdAt: "desc" // Or by highest bidder/budget
      }
    });

    if (activeAds.length === 0) {
      return NextResponse.json({ message: "No ads available" }, { status: 200 });
    }

    const selectedAd = activeAds[0];
    
    // Log the impression (without user ID for anonymous views)
    await prisma.adImpression.create({
      data: {
        advertisementId: selectedAd.id,
        action: "VIEW",
      }
    });

    return NextResponse.json(selectedAd, { status: 200 });

  } catch (error) {
    console.error("Ad Engine API Error:", error);
    return NextResponse.json({ error: "Failed to fetch advertisement" }, { status: 500 });
  }
}
