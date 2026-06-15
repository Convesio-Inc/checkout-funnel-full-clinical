import { useAuth } from "@/hooks/useAuth";
import { CheckoutTimer } from "../checkout/CheckoutTimer";

export function SiteHeader() {
    const { status } = useAuth();

    return (
        <header className="border-b py-4 bg-header-background/90 backdrop-blur border-header-border mb-6 sticky top-0 z-10">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">

                <div>
                    <span className="text-base font-medium">BioVerve</span>
                </div>

                <div className="flex items-center gap-2 md:gap-4 lg:gap-8 text-sm">
                    <a className="hover:underline" href="/product">Product</a>
                    <a className="hover:underline" href="/">Checkout</a>
                    {status !== "authenticated" && (
                        <a className="hover:underline" href="/login">Login</a>
                    )}
                </div>

                {typeof window !== "undefined" && window.location.pathname === "/" && (
                    <div>
                        <CheckoutTimer />
                    </div>
                )}
            </div>
        </header>
    );
}
