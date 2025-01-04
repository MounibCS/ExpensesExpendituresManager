import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import LoginButton from "./Login";
import LogoutButton from "./Logout";

export default function AuthButton() {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="animate-pulse flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginButton />;
    }

    return (
        <div className="relative">
            <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-100 hover:text-gray-700 rounded-full p-2"
            >
                <img 
                    src={user?.picture} 
                    alt={user?.name} 
                    className="w-8 h-8 rounded-full"
                />
                <span>{user?.name}</span>
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 border">
                    <div className="flex flex-col items-center gap-4">
                        <img 
                            src={user?.picture} 
                            alt={user?.name} 
                            className="w-20 h-20 rounded-full"
                        />
                        <div className="text-center">
                            <h3 className="font-bold">{user?.name}</h3>
                            <p className="text-gray-600">{user?.email}</p>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            )}
        </div>
    );
}