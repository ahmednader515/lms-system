import { NavbarRoutes } from "@/components/navbar-routes"
import { MobileSidebar } from "./mobile-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "./logo"

export const Navbar = () => {
    return (
        <div className="p-4 border-b h-full flex items-center bg-card shadow-sm">
            <MobileSidebar />
            <div className="flex items-center rtl:mr-4 ltr:ml-4">
                <Logo />
            </div>
            <div className="flex items-center gap-x-4 rtl:mr-auto ltr:ml-auto">
                <ThemeToggle />
                <NavbarRoutes />
            </div>
        </div>
    )
}