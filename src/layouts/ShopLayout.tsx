import { useEffect, useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/site";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { UrgencyBanner } from "@/components/site/UrgencyBanner";
import { LoggedInBar } from "@/components/site/LoggedInBar";
import { useAuth } from "@/hooks/useAuth";
import { Outlet } from "react-router";

const COUNTDOWN_SECONDS = 14 * 60 + 59;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function ShopLayout() {
  const { status } = useAuth();
  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    const id = setInterval(() => setRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const mmss = `${pad(Math.floor(remaining / 60))}:${pad(remaining % 60)}`;

  return (
    <div className="min-h-dvh flex flex-col">
      <AnnouncementBar timer={mmss} />
      <UrgencyBanner timer={mmss} />
      {status === "authenticated" && <LoggedInBar />}
      <SiteHeader />
      <div className="flex-1">
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  );
}
