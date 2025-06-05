import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CourseCard } from "@/components/course-card";
import { formatPrice } from "@/lib/format";
import { SearchInput } from "./_components/search-input";
import { CategoryFilter } from "./_components/category-filter";

interface DashboardPageProps {
    searchParams: {
        title: string;
        categoryId: string;
    };
}

const DashboardPage = async ({
    searchParams
}: DashboardPageProps) => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    });

    const purchasedCourses = await db.course.findMany({
        where: {
            isPublished: true,
            purchases: {
                some: {
                    userId,
                    payment: {
                        status: "COMPLETED"
                    }
                },
            },
            ...(searchParams.title && {
                title: {
                    contains: searchParams.title,
                }
            }),
            ...(searchParams.categoryId && {
                categoryId: searchParams.categoryId
            })
        },
        include: {
            category: true,
            chapters: {
                where: {
                    isPublished: true,
                },
                include: {
                    userProgress: {
                        where: {
                            userId,
                            isCompleted: true,
                        },
                    },
                },
                orderBy: {
                    position: "asc",
                },
            },
            purchases: {
                where: {
                    userId,
                    payment: {
                        status: "COMPLETED"
                    }
                },
                select: {
                    id: true,
                    payment: {
                        select: {
                            status: true
                        }
                    }
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const coursesWithProgress = purchasedCourses.map(course => {
        const totalChapters = course.chapters.length;
        const completedChapters = course.chapters.filter(chapter => 
            chapter.userProgress.length > 0
        ).length;
        const progress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

        // Find the first incomplete chapter or the last chapter if all are complete
        const lastAccessedChapter = course.chapters.find(chapter => 
            !chapter.userProgress.length
        ) || course.chapters[course.chapters.length - 1];

        return {
            ...course,
            progress: Math.round(progress),
            lastAccessedChapterId: lastAccessedChapter?.id,
        };
    });

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">دوراتي</h1>
                <p className="text-muted-foreground">
                    استمر في التعلم من حيث تركت
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col gap-4">
                    <SearchInput />
                    <CategoryFilter categories={categories} />
                </div>

                {coursesWithProgress.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                        {searchParams.title || searchParams.categoryId ? (
                            "لا يوجد دورات مطابقة لمعايير البحث الخاصة بك."
                        ) : (
                            "لم تشتري أي دورات بعد. استكشف دوراتنا للبدء!"
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                        {coursesWithProgress.map((course) => (
                            <CourseCard
                                key={course.id}
                                id={course.id}
                                title={course.title}
                                imageUrl={course.imageUrl!}
                                chaptersLength={course.chapters.length}
                                price={course.price!}
                                progress={course.progress}
                                category={course?.category?.name!}
                                chapters={course.chapters}
                                isPurchased={true}
                                lastAccessedChapterId={course.lastAccessedChapterId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
