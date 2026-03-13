import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("id");

    if (!videoId) {
      return NextResponse.json({ error: "Missing video id" }, { status: 400 });
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        channel: {
          select: {
            channelName: true,
            avatarUrl: true,
            followersCount: true,
            user: {
              select: {
                phoneNumber: true,
                phoneCode: true,
              }
            }
          }
        }
      }
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Determine WhatsApp Contact Number
    // Uses the Video specific override if it exists, otherwise falls back to the Channel Owner's phone
    const contactPhoneCode = video.phoneCode || video.channel?.user?.phoneCode || "";
    const contactPhoneNumber = video.phoneNumber || video.channel?.user?.phoneNumber || "";
    const waLink = `https://wa.me/${contactPhoneCode.replace('+', '')}${contactPhoneNumber}?text=I%20am%20interested%20in%20this%20property%20and%20would%20like%20more%20information.`;

    // Construct the response mapping directly to the Watch Page UI requirements
    const watchData = {
      id: video.id,
      videoUrl: video.videoUrl,
      playbackId: video.playbackId,
      title: video.title,
      description: video.description,
      price: video.price,
      bedrooms: video.bedrooms,
      bathrooms: video.bathrooms,
      sizeSqm: video.sizeSqm,
      location: `${video.city}, ${video.country}`,
      address: video.address,
      latitude: video.latitude,
      longitude: video.longitude,
      status: video.status,
      viewsCount: video.viewsCount,
      likesCount: video.likesCount,
      channel: {
        channelName: video.channel.channelName,
        avatarUrl: video.channel.avatarUrl,
        followersCount: video.channel.followersCount,
      },
      contact: {
        rawPhone: `+${contactPhoneCode} ${contactPhoneNumber}`,
        whatsappLink: waLink
      }
    };

    return NextResponse.json(watchData, { status: 200 });

  } catch (error) {
    console.error("Watch API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
