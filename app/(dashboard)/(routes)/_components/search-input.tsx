"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const SearchInput = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;

        if (title) {
            router.push(`/search?title=${title}`);
        } else {
            router.push("/search");
        }
    };

    return (
        <form onSubmit={onSubmit} className="flex items-center gap-x-2">
            <Input
                name="title"
                placeholder="ابحث عن دورات..."
                defaultValue={searchParams.get("title") || ""}
                className="h-10"
            />
            <Button type="submit" size="sm">
                <Search className="h-4 w-4" />
            </Button>
        </form>
    );
}; 