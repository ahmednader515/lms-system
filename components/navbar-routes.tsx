"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react";
import Link from "next/link";
import { UserButton } from "./user-button";
import { useSession } from "next-auth/react";

export const NavbarRoutes = () => {
    const pathName = usePathname();
    const { data: session } = useSession();

    const isTeacherPage = pathName?.startsWith("/teacher");
    const isPlayerPage = pathName?.includes("/chapter");
    const isTeacher = session?.user?.role === "TEACHER";

    return (
        <div className="flex items-center gap-x-2 rtl:mr-auto ltr:ml-auto">
            {isTeacherPage || isPlayerPage ? (
                <Link href="/dashboard">
                    <Button size="sm" variant="ghost">
                        <LogOut className="h-4 w-4 rtl:ml-2 ltr:mr-2"/>
                        الخروج
                    </Button>
                </Link>
            ) : isTeacher ? (
                <Link href="/teacher/courses">
                    <Button size="sm" variant="ghost">
                        وضع المعلم
                    </Button>
                </Link>
            ) : null}
            <UserButton />
        </div>
    )
}