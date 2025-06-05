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
import Link from "next/link";
import Image from "next/image";

interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    price: number;
    progress: number | null;
    user: {
        name: string;
        image: string;
    };
}

export const CourseCard = ({
    id,
    title,
    imageUrl,
    chaptersLength,
    price,
    progress,
    user,
}: CourseCardProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        if (progress === null) {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/courses/${id}/chapters/${chaptersLength}`);
                const chapter = response.data;
                
                if (chapter.isFree) {
                    router.push(`/courses/${id}/chapters/${chaptersLength}`);
                } else {
                    router.push(`/courses/${id}/purchase`);
                }
            } catch (error) {
                console.error("Error checking chapter access:", error);
                toast.error("فشل الوصول إلى الدورة");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Link href={`/courses/${id}`}>
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                        fill
                        className="object-cover"
                        alt={title}
                        src={imageUrl}
                    />
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {chaptersLength} {chaptersLength === 1 ? "فصل" : "فصول"}
                    </p>
                    {progress !== null ? (
                        <Progress
                            value={progress}
                            className="h-2"
                        />
                    ) : (
                        <p className="text-md md:text-sm font-medium text-slate-700">
                            {formatPrice(price)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}; 