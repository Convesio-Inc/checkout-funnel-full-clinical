import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router";

export function LoggedInBar() {
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        await logout();
        window.location.assign("/login");
    };
    
    return (
        <div className="bg-neutral-700 text-white px-4 py-1 flex justify-between items-center text-xs">
            <div className="flex items-center gap-4">
                <Link className="hover:underline" to="/orders">
                    Orders
                </Link>

                <Link className="hover:underline" to="/settings/users">
                    Users
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <p>Logged in as {user?.name}</p>
                <Link className="hover:underline" to="#" onClick={handleLogout}>
                    Logout
                </Link>
            </div>
        </div>
    );
}