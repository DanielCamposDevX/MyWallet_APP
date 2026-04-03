import MyWalletLogo from "@/shared/components/MyWalletLogo";
import { ThemeSelector } from "@/shared/components/ThemeSelector";
import { Button } from "@/shared/components/ui/button";
import { useActiveWorkspace } from "@/features/workspaces/hooks/use-active-workspace";
import { clearAuthStore, getAuthStore } from "@/features/auth/store/auth-store";
import { ArrowDownUp, BriefcaseBusiness, House, LogOut, Tags, WalletCards } from "lucide-react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";

const linkClassName =
  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-muted";
const activeLinkClassName = "bg-primary text-primary-foreground hover:bg-primary/90";

export default function AppLayout() {
  const navigate = useNavigate();
  const { token, userName } = getAuthStore();
  const { workspace } = useActiveWorkspace();

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  const handleLogout = () => {
    clearAuthStore();
    navigate("/signin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#cffafe_0%,transparent_50%),linear-gradient(180deg,hsl(var(--background))_20%,hsl(var(--secondary))_100%)] px-4 py-4 md:px-8">
      <header className="mx-auto mb-4 flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/80 p-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-primary/10 p-2">
            <MyWalletLogo />
          </div>
          <div>
            <p className="text-sm font-semibold">MyWallet</p>
            <p className="text-xs text-muted-foreground">
              {userName ?? "Usuário"}
              {workspace ? ` • ${workspace.name}` : ""}
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `${linkClassName} ${isActive ? activeLinkClassName : "text-foreground"}`
            }
          >
            <House className="size-4" />
            Home
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `${linkClassName} ${isActive ? activeLinkClassName : "text-foreground"}`
            }
          >
            <ArrowDownUp className="size-4" />
            Transações
          </NavLink>
          <NavLink
            to="/installments"
            className={({ isActive }) =>
              `${linkClassName} ${isActive ? activeLinkClassName : "text-foreground"}`
            }
          >
            <WalletCards className="size-4" />
            Parcelamentos
          </NavLink>
          <NavLink
            to="/tags"
            className={({ isActive }) =>
              `${linkClassName} ${isActive ? activeLinkClassName : "text-foreground"}`
            }
          >
            <Tags className="size-4" />
            Tags
          </NavLink>
          <NavLink
            to="/workspaces"
            className={({ isActive }) =>
              `${linkClassName} ${isActive ? activeLinkClassName : "text-foreground"}`
            }
          >
            <BriefcaseBusiness className="size-4" />
            Workspaces
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSelector />
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="size-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl justify-center">
        <Outlet />
      </main>
    </div>
  );
}
