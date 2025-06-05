"use client";

import { formatPrice } from "@/lib/format";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Image from "next/image";

interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    price: number;
    progress: number | null;
}

export const CourseCard = ({
    id,
    title,
    imageUrl,
    chaptersLength,
    price,
    progress,
}: CourseCardProps) => {
    const router = useRouter();

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