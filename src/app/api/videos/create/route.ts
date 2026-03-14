import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only AGENT and AGENCY roles can create videos
    if (session.user.role === "USER" || session.user.role === "ADMIN") {
       return NextResponse.json({ error: "Only agents or agencies can upload properties" }, { status: 403 });
    }

    const channel = await prisma.channel.findUnique({
      where: { ownerId: session.user.id }
    });

    if (!channel) {
      return NextResponse.json({ error: "You must create a channel first to upload properties." }, { status: 403 });
    }

    const body = await req.json();
    const { 
      title, description, videoUrl, thumbnail, 
      propertyType, status, price, bedrooms, bathrooms, sizeSqm, country, city, address 
    } = body;

    if (!title || !videoUrl || !propertyType || !status || !price || !country || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create the Video along with its linked Property record in a Prisma transaction/nested create
    const newVideo = await prisma.video.create({
      data: {
        title,
        description,
        videoUrl,
        thumbnail,
        channelId: channel.id,
        property: {
          create: {
            propertyType,
            status,
            price: parseFloat(price),
            bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
            bathrooms: bathrooms ? parseFloat(bathrooms) : undefined,
            sizeSqm: sizeSqm ? parseFloat(sizeSqm) : undefined,
            country,
            city,
            address
          }
        }
      },
      include: { property: true }
    });

    return NextResponse.json(newVideo, { status: 201 });

  } catch (error) {
    console.error("Video Upload Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
