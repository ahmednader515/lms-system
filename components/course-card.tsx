"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Tag, Users } from "lucide-react";

interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    price: number;
    progress: number | null;
    category: string;
    chapters: { id: string }[];
    isPurchased?: boolean;
    lastAccessedChapterId?: string;
    studentsCount?: number;
}

export const CourseCard = ({
    id,
    title,
    imageUrl,
    chaptersLength,
    price,
    progress,
    category,
    chapters,
    isPurchased = false,
    lastAccessedChapterId,
    studentsCount = 0,
}: CourseCardProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        if (isPurchased) {
            // Navigate to the last accessed chapter or first chapter if none
            const chapterId = lastAccessedChapterId || chapters[0]?.id;
            if (chapterId) {
                router.push(`/courses/${id}/chapters/${chapterId}`);
            }
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`/api/courses/${id}/chapters/${chapters[0]?.id}`);
            const chapter = response.data;
            
            if (chapter.isFree) {
                router.push(`/courses/${id}/chapters/${chapters[0]?.id}`);
            } else {
                router.push(`/courses/${id}/purchase`);
            }
        } catch (error) {
            console.error("Error checking chapter access:", error);
            toast.error("فشل الوصول إلى الدورة");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="group hover:shadow-xl transition overflow-hidden border border-slate-200 dark:border-slate-700 h-full flex flex-col">
            <div className="relative">
                <div className="aspect-video w-full overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </div>
            
            <CardContent className="p-4 pt-5 flex flex-col flex-grow">
                <div className="text-lg font-semibold group-hover:text-primary transition line-clamp-2 min-h-[3.5rem]">
                    {title}
                </div>
                
                <div className="mt-3 flex items-center gap-x-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{chaptersLength} {chaptersLength === 1 ? "الفصل" : "الفصول"}</span>
                    </div>
                    <div className="flex items-center gap-x-1">
                        <Users className="h-4 w-4" />
                        <span>{studentsCount} {studentsCount === 1 ? "طالب" : "طلاب"}</span>
                    </div>
                </div>

                {/* Secondary price display for non-purchased courses */}
                {progress === null && (
                    <div className="mt-4 flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-primary" />
                        <span className={`font-bold text-lg ${price === 0 ? "text-emerald-600" : "text-primary"}`}>
                            {price === 0 ? "دورة مجانية" : formatPrice(price)}
                        </span>
                    </div>
                )}
                
                {progress !== null ? (
                    <div className="mt-auto space-y-2 pt-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">التقدم</span>
                            <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <Button
                            onClick={handleClick}
                            disabled={isLoading}
                            size="sm"
                            className="w-full mt-3"
                        >
                            استمر في التعلم
                        </Button>
                    </div>
                ) : (
                    <div className="mt-auto pt-4">
                        <Button
                            onClick={handleClick}
                            disabled={isLoading}
                            className="w-full"
                            variant={price === 0 ? "outline" : "default"}
                        >
                            {price === 0 ? "ابدأ التعلم" : "مشاهدة الدورة"}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}; 