import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const resolvedParams = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const progress = await db.userProgress.findMany({
      where: {
        userId,
        chapter: {
          courseId: resolvedParams.courseId,
        }
      },
      include: {
        chapter: true,
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.log("[PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 