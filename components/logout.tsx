"use client"

import { authClient } from "@/lib/auth-client"
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function Logout() {
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/login");
    };
    return (
        <Button
        onClick={handleLogout}
        className="gradient-bg text-white hover:brightness-110 hover:scale-[1.03] transition-all shadow-md hover:shadow-lg"
        >
        Đăng xuất <LogOut className="size-4 ml-2" />
        </Button>
    );
}