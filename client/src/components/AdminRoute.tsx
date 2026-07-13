import { Navigate, Outlet } from "react-router";
import { Role } from "core/constants/role.ts";
import { useSession } from "../lib/auth-client";
import { Headset } from "lucide-react";

export default function AdminRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center pulse-glow">
          <Headset className="h-7 w-7 text-primary-foreground" />
        </div>
      </div>
    );
  }

  if (session?.user?.role !== Role.admin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
