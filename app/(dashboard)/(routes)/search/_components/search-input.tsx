"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import qs from "query-string";

export const SearchInput = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(searchParams.get("title") || "");
    const debouncedValue = useDebounce(value, 500);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        const query = {
            title: debouncedValue,
            categoryId: searchParams.get("categoryId"),
        };

        const url = qs.stringifyUrl({
            url: window.location.href,
            query,
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    }, [debouncedValue, router, searchParams]);

    return (
        <div className="relative">
            <Search className="absolute h-4 w-4 top-3 rtl:right-3 ltr:left-3 text-slate-600 dark:text-slate-400" />
            <Input
                onChange={onChange}
                value={value}
                className="w-full md:w-[300px] lg:w-[400px] rtl:pr-9 ltr:pl-9 rounded-full bg-slate-100 dark:bg-slate-800 focus-visible:ring-slate-200 dark:focus-visible:ring-slate-700"
                placeholder="ابحث عن دورة"
            />
        </div>
    );
}; 