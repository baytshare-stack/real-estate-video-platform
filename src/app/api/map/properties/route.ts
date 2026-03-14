import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    
    // Base query to fetch only properties
    const whereClause: any = {
      property: { isNot: null }
    };

    if (city) {
       whereClause.property = { city: { contains: city } };
    }

    // Fetch essential data required for map markers
    const mapProperties = await prisma.video.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        property: {
          select: {
            propertyType: true,
            price: true,
            city: true,
            status: true
          }
        },
        channel: {
          select: { avatar: true, name: true }
        }
      },
      take: 100
    });

    // Map the shape back for the frontend
    const mappedProps = mapProperties.map(v => ({
      ...v,
      propertyType: v.property?.propertyType,
      price: v.property?.price ? Number(v.property.price) : 0,
      city: v.property?.city,
      status: v.property?.status,
      latitude: 0, // removed from schema
      longitude: 0, // removed from schema
      channelAvatarUrl: v.channel?.avatar,
      channelName: v.channel?.name
    }));

    return NextResponse.json(mappedProps, { status: 200 });

  } catch (error) {
    console.error("Map Data API Error:", error);
    return NextResponse.json({ error: "Failed to fetch map data" }, { status: 500 });
  }
}
