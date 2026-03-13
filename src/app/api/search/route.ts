import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const city = searchParams.get("city") || "";
    const type = searchParams.get("type") || ""; // APARTMENT, VILLA, etc
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const bedrooms = searchParams.get("bedrooms");

    const whereClause: Prisma.VideoWhereInput = {
      // Basic free-text search across Title and Description
      OR: [
        { title: { contains: query } },  // SQLite defaults to case-insensitive mostly
        { description: { contains: query } },
      ],
    };

    if (city) {
      whereClause.city = { contains: city };
    }

    if (type) {
      // Force cast to the enum for strict filtering
      whereClause.propertyType = type as any; 
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
    }

    if (bedrooms) {
      whereClause.bedrooms = { gte: parseInt(bedrooms, 10) };
    }

    const results = await prisma.video.findMany({
      where: whereClause,
      include: {
        channel: {
          select: { channelName: true, avatarUrl: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 20 // Pagination logic can be added later
    });

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Failed to search videos" }, { status: 500 });
  }
}
