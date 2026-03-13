import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Basic list of known spam keywords/patterns
const spamKeywords = [
  "http://", "https://", "www.", ".com", ".net", "crypto", "bitcoin", "invest", "viagra", "casino"
];

function isSpam(content: string): boolean {
  const lowerContent = content.toLowerCase();
  for (const keyword of spamKeywords) {
    if (lowerContent.includes(keyword)) {
      return true;
    }
  }
  return false;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { videoId, content, parentId } = body;

    if (!videoId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Anti-Spam Check
    if (isSpam(content)) {
      // In a full implementation, you might write to FlagRecord instead of rejecting outright
      return NextResponse.json(
        { error: "Comment blocked due to security policy (detected spam logic)." }, 
        { status: 403 }
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        userId: session.user.id,
        videoId,
        parentId: parentId || null
      },
      include: {
        user: { select: { fullName: true } }
      }
    });

    return NextResponse.json(newComment, { status: 201 });

  } catch (error) {
    console.error("Comment API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
