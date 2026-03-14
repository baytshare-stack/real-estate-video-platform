import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
        title, description, propertyType, status,
        bedrooms, bathrooms, sizeSqm, price,
        country, city, area, 
        videoFormat, videoUrl, thumbnailUrl
    } = body;

    // Validate core fields
    if (!title || !propertyType || !status || !price) {
       return NextResponse.json({ error: "Missing required property fields" }, { status: 400 });
    }

    // For demo purposes, assign to a default or first available channel
    let channel = await prisma.channel.findFirst();
    if (!channel) {
        // Create a dummy channel if DB is completely empty
        const user = await prisma.user.findFirst();
        if (user) {
            channel = await prisma.channel.create({
                data: {
                    ownerId: user.id,
                    name: "Demo Creator",
                    description: "Demo channel for testing uploads"
                }
            });
        } else {
            return NextResponse.json({ error: "No users exist in DB to own a channel." }, { status: 400 });
        }
    }

    // Create the video record
    const video = await prisma.video.create({
        data: {
            title,
            description: description || null,
            channelId: channel.id,
            videoUrl: videoUrl || "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4", // Mock video
            thumbnail: thumbnailUrl || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800&h=450", // Mock thumbnail
            property: {
                create: {
                    propertyType: propertyType,
                    status: status,
                    bedrooms: bedrooms ? parseFloat(bedrooms) : undefined,
                    bathrooms: bathrooms ? parseFloat(bathrooms) : undefined,
                    sizeSqm: sizeSqm ? parseFloat(sizeSqm) : undefined,
                    price: parseFloat(price),
                    country: country,
                    city: city,
                    address: typeof area === 'string' ? area : undefined
                }
            }
        }
    });

    return NextResponse.json({ success: true, videoId: video.id });

  } catch (error: any) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
