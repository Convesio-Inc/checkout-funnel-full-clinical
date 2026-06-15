import { SiteFooter, SiteHeader } from "@/components/site";
import { LoggedInBar } from "@/components/site/LoggedInBar";
import { useAuth } from "@/hooks/useAuth";
import { Outlet } from "react-router";

export function ShopLayout() {
    const { status } = useAuth();

    return (
        <main className="min-h-dvh flex flex-col">
            {status === "authenticated" && <LoggedInBar />}
            <SiteHeader />
            <div className="flex-1">
                <Outlet />
            </div>
            <SiteFooter />
        </main>
    );
}