"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import qs from "query-string";

interface CategoryFilterProps {
    categories: Category[];
}

export const CategoryFilter = ({
    categories
}: CategoryFilterProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const categoryId = searchParams.get("categoryId");

    const onClick = (id: string | null) => {
        const query = {
            categoryId: id,
            title: searchParams.get("title"),
        };

        const url = qs.stringifyUrl({
            url: window.location.href,
            query,
        }, { skipNull: true });

        router.push(url);
    };

    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            <Button
                onClick={() => onClick(null)}
                className={cn(
                    "rounded-md text-sm text-muted-foreground",
                    !categoryId && "bg-primary/10 text-primary"
                )}
                variant="ghost"
                size="sm"
            >
                الكل
            </Button>
            {categories.map((category) => (
                <Button
                    key={category.id}
                    onClick={() => onClick(category.id)}
                    className={cn(
                        "rounded-md text-sm text-muted-foreground",
                        categoryId === category.id && "bg-primary/10 text-primary"
                    )}
                    variant="ghost"
                    size="sm"
                >
                    {category.name}
                </Button>
            ))}
        </div>
    );
}; 