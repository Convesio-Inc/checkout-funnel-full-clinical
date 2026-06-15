import { Cog, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "react-router";
import { Button } from "../ui/button";

/**
 * DashboardHeader
 * -----------------------------------------------------------------------------
 * Sticky top navigation for the dashboard page.
 * -----------------------------------------------------------------------------
 */
export function DashboardHeader() {

    const { user, logout } = useAuth();

    const { pathname } = useLocation();

    return (
        <header
            data-section="dashboard-header"
            className="sticky top-0 z-30 border-b border-[#ECECEC] bg-white/90 px-5 py-3 backdrop-blur-[14px] sm:px-8"
        >
            <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-6">
                <div className="inline-flex items-center gap-3.5">
                    <Link to="/">
                        <img alt="Convesio" className="h-6 w-auto" src="/convesio-logo.svg" />
                    </Link>
                    <span aria-hidden="true" className="h-5 w-px bg-[#ECECEC]" />

                    <Link to="/orders">
                        <Button
                            variant="ghost"
                            className={
                                pathname.startsWith("/orders")
                                    ? "border-0 border-b-2 border-[#FF6A5B] rounded-none"
                                    : ""
                            }
                        >
                            Orders
                        </Button>
                    </Link>
               
                </div>

                <div className="inline-flex items-center gap-2">
                    <div className="inline-flex items-center gap-2.5 rounded-full border border-[#ECECEC] px-2.5 py-1.5 text-[13px] text-[#4A4A4A]">
                        <span className="grid h-6.5 w-6.5 place-items-center rounded-full bg-gradient-to-br from-[#FF6A5B] to-[#FFB3AA] text-[11px] font-bold tracking-[0.02em] text-white">
                            {user?.name?.charAt(0)}
                        </span>
                        <span>{user?.name}</span>
                    </div>

                    <Link to="/settings/users" className="inline-flex items-center gap-2 h-8 w-8 text-[13px] font-semibold tracking-[0.04em] text-[#4A4A4A] uppercase transition-colors hover:text-[#FF6A5B] rounded-full border border-[#ECECEC] justify-center">
                        <Cog className="h-3.5 w-3.5" />
                    </Link>

                    <Link to="#" className="inline-flex items-center gap-2 h-8 w-8 text-[13px] font-semibold tracking-[0.04em] text-[#4A4A4A] uppercase transition-colors hover:text-[#FF6A5B] rounded-full border border-[#ECECEC] justify-center" title="Log out" onClick={() => logout()}>
                        <LogOut className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </header>
    );
}
