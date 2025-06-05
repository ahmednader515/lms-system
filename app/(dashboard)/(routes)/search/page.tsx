import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SearchInput } from "./_components/search-input";
import { CoursesList } from "./_components/courses-list";
import { CategoryFilter } from "./_components/category-filter";

interface SearchPageProps {
    searchParams: {
        title: string;
        categoryId: string;
    };
}

const SearchPage = async ({
    searchParams
}: SearchPageProps) => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    });

    const courses = await db.course.findMany({
        where: {
            isPublished: true,
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
                select: {
                    id: true
                }
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
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className="p-6 space-y-4">
            <div className="space-y-3">
                <div>
                    <h1 className="text-2xl font-bold">استكشف الدورات</h1>
                    <p className="text-sm text-muted-foreground">
                        استكشف مجموعة كبيرة من الدورات
                    </p>
                </div>
                <SearchInput />
            </div>
            <CoursesList items={courses} />
        </div>
    );
}

export default SearchPage;