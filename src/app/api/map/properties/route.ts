import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    
    // Base query to fetch only properties that have valid coordinates
    const whereClause: any = {
      latitude: { not: null },
      longitude: { not: null }
    };

    if (city) {
       whereClause.city = { contains: city };
    }

    // Fetch essential data required for map markers
    const mapProperties = await prisma.video.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        propertyType: true,
        price: true,
        latitude: true,
        longitude: true,
        city: true,
        status: true,
        channel: {
          select: { avatarUrl: true, channelName: true }
        }
      },
      take: 100 // Cap to prevent massive payloads, add bounding box logic for real production apps
    });

    return NextResponse.json(mapProperties, { status: 200 });

  } catch (error) {
    console.error("Map Data API Error:", error);
    return NextResponse.json({ error: "Failed to fetch map data" }, { status: 500 });
  }
}
