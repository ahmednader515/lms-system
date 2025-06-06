'use client';
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CourseCard } from "@/components/course-card";
import { SearchInputWrapper } from "./_components/search-input-wrapper";
import { Suspense } from "react";

interface SearchPageProps {
    searchParams: {
        title: string;
    };
}

const SearchPage = async ({
    searchParams,
}: SearchPageProps) => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const courses = await db.course.findMany({
        where: {
            isPublished: true,
            title: {
                contains: searchParams.title,
            },
        },
        include: {
            user: true,
            chapters: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="flex flex-col">
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <Suspense fallback={
                    <div className="flex items-center gap-x-2">
                        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                        <div className="h-10 w-10 animate-pulse rounded-md bg-muted" />
                    </div>
                }>
                    <SearchInputWrapper />
                </Suspense>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            id={course.id}
                            title={course.title}
                            imageUrl={course.imageUrl!}
                            chaptersLength={course.chapters.length}
                            price={course.price!}
                            progress={null}
                            user={{
                                name: course.user.name,
                                image: course.user.image || "/male.png"
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
