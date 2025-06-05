"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
    categories: {
        id: string;
        name: string;
    }[];
}

export const CategoryFilter = ({
    categories
}: CategoryFilterProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const selectedCategoryId = searchParams.get("categoryId");

    const onClick = (categoryId: string | undefined) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (categoryId) {
            params.set("categoryId", categoryId);
        } else {
            params.delete("categoryId");
        }

        const url = `/search?${params.toString()}`;
        router.push(url);
    };

    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            <Button
                onClick={() => onClick(undefined)}
                className={cn(
                    "rounded-md px-3 py-2 text-sm border border-slate-200",
                    !selectedCategoryId && "bg-slate-200 text-slate-900"
                )}
                variant="ghost"
            >
                الكل
            </Button>
            {categories.map((category) => (
                <Button
                    key={category.id}
                    onClick={() => onClick(category.id)}
                    className={cn(
                        "rounded-md px-3 py-2 text-sm border border-slate-200",
                        selectedCategoryId === category.id && "bg-slate-200 text-slate-900"
                    )}
                    variant="ghost"
                >
                    {category.name}
                </Button>
            ))}
        </div>
    );
}; 