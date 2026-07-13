import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { Role } from "core/constants/role.ts";
import { signOut, useSession } from "../lib/auth-client";
import { useTheme } from "../lib/theme";
import {
  LayoutDashboard,
  Ticket,
  Users,
  LogOut,
  Sun,
  Moon,
  Headset,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/tickets", label: "Tickets", icon: Ticket },
];

export default function Layout() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-200 ${
      isActive
        ? "bg-primary/12 text-primary shadow-[inset_0_0_0_1px_oklch(from_var(--primary)_l_c_h_/_0.15)]"
        : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
    }`;

  const iconClass = (isActive: boolean) =>
    `h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110 ${
      isActive ? "text-primary" : ""
    }`;

  const userName = session?.user?.name ?? "";
  const initials = userName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen flex bg-background">
      {/* ─── Sidebar ─── */}
      <aside className="fixed top-0 left-0 bottom-0 w-[260px] flex flex-col border-r border-border/60 bg-sidebar z-50">
        {/* Logo */}
        <div className="px-5 h-16 flex items-center gap-3 border-b border-border/40">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
            <Headset className="h-[18px] w-[18px] text-primary-foreground" />
          </div>
          <Link to="/" className="flex flex-col">
            <span className="text-[15px] font-bold tracking-tight">
              Helpdesk
            </span>
            <span className="text-[11px] text-muted-foreground -mt-0.5">
              Support Center
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-5 space-y-1">
          <p className="px-3 mb-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60">
            Menu
          </p>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {({ isActive }) => (
                <>
                  <item.icon className={iconClass(isActive)} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
          {session?.user?.role === Role.admin && (
            <NavLink to="/users" className={linkClass}>
              {({ isActive }) => (
                <>
                  <Users className={iconClass(isActive)} />
                  Users
                </>
              )}
            </NavLink>
          )}
        </nav>

        {/* Bottom section */}
        <div className="px-3 pb-4 space-y-2">
          <div className="h-px bg-border/50 mx-2 mb-3" />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-[13px] text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all duration-200 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>

          {/* User + Sign out */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-accent/40">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-[11px] font-bold text-primary border border-primary/10">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium truncate">{userName}</p>
              <p className="text-[11px] text-muted-foreground truncate">
                {session?.user?.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 cursor-pointer shrink-0"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 ml-[260px] min-h-screen">
        <div className="max-w-[1100px] mx-auto px-8 py-8 animate-in-page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
