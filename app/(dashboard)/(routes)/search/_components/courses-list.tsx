import { Course } from "@prisma/client";
import { CourseCard } from "@/components/course-card";
import { auth } from "@/lib/auth";

interface CoursesListProps {
    items: (Course & {
        category: { name: string } | null;
        chapters: { id: string }[];
        purchases: { id: string; status?: string }[];
    })[];
}

export const CoursesList = async ({
    items
}: CoursesListProps) => {
    const { userId } = await auth();

    return (
        <div>
            {items.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    لا يوجد دورات مطابقة لمعايير البحث الخاصة بك
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                    <CourseCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        imageUrl={item.imageUrl!}
                        chaptersLength={item.chapters.length}
                        price={item.price!}
                        progress={null}
                        category={item?.category?.name!}
                        chapters={item.chapters}
                        isPurchased={item.purchases.some(purchase => purchase.status === "ACTIVE")}
                    />
                ))}
            </div>
        </div>
    );
}; 