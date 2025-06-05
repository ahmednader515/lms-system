import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = await auth();
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[CHAPTER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { courseId, chapterId } = params;
    console.log("[CHAPTER_ID] Fetching chapter:", { courseId, chapterId });
    
    const { userId } = await auth();
    console.log("[CHAPTER_ID] User ID:", userId);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      include: {
        course: {
          select: {
            userId: true,
          }
        },
        muxData: true,
        userProgress: {
          where: {
            userId,
          }
        }
      }
    });

    console.log("[CHAPTER_ID] Found chapter:", chapter);

    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    // Get the next and previous chapters
    const nextChapter = await db.chapter.findFirst({
      where: {
        courseId: courseId,
        position: {
          gt: chapter.position
        }
      },
      orderBy: {
        position: "asc"
      }
    });

    const previousChapter = await db.chapter.findFirst({
      where: {
        courseId: courseId,
        position: {
          lt: chapter.position
        }
      },
      orderBy: {
        position: "desc"
      }
    });

    const response = {
      ...chapter,
      nextChapterId: nextChapter?.id || null,
      previousChapterId: previousChapter?.id || null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[CHAPTER_ID] Detailed error:", error);
    if (error instanceof Error) {
      return new NextResponse(`Internal Error: ${error.message}\nStack: ${error.stack}`, { status: 500 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
} 