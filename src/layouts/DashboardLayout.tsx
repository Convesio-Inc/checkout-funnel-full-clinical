import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Outlet } from "react-router";

export function DashboardLayout() {
    return (
        <main className="min-h-dvh flex flex-col">
            <DashboardHeader />
            <div className="flex-1">
                <Outlet />
            </div>
        </main>
    );
}