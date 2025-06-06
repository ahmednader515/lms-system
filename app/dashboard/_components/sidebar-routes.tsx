"use client";

import { BarChart, Compass, Layout, List } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
    {
        icon: Layout,
        label: "لوحة التحكم",
        href: "/dashboard",
    },
    {
        icon: Compass,
        label: "استكشف",
        href: "/search",
    },
];

const teacherRoutes = [
    {
        icon: List,
        label: "الدورات",
        href: "/teacher/courses",
    },
    {
        icon: BarChart,
        label: "الاحصائيات",
        href: "/teacher/analytics",
    },
];

export const SidebarRoutes = () => {
    const pathName = usePathname();

    const isTeacherPage = pathName?.includes("/teacher");
    const routes = isTeacherPage ? teacherRoutes : guestRoutes;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem  key={route.href} icon={route.icon} label={route.label} href={route.href} />
            ))}
        </div>
    );
}