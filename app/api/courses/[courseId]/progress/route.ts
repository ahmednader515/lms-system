import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get all chapters in the course
    const chapters = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    // Get completed chapters
    const completedChapters = await db.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: chapters.map((chapter) => chapter.id),
        },
        isCompleted: true,
      },
    });

    // Calculate progress percentage
    const progress = chapters.length > 0 
      ? Math.round((completedChapters / chapters.length) * 100)
      : 0;

    return NextResponse.json({ progress });
  } catch (error) {
    console.log("[COURSE_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 