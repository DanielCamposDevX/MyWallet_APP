import MyWalletLogoName from "@/shared/components/MyWalletLogoName";
import { ThemeSelector } from "@/shared/components/ThemeSelector";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex justify-center items-center p-10 w-screen h-screen bg-slate-300 dark:bg-accent ">
      <main className="relative flex-1 flex flex-col md:flex-row w-full h-full rounded-xl  bg-secondary dark:bg-background   p-4 md:justify-between  ">
        <aside className="max-md:hidden min-h-[20vh] md:w-1/2 w-full flex justify-center items-center bg-linear-30 bg-primary from-50% to-100% dark:bg-accent from-accent-foreground dark:from-primary rounded-xl">
          <MyWalletLogoName variant="secondary" />
        </aside>
        <div className="md:w-1/2 w-full h-full rounded-xl relative ">
          <ThemeSelector className="absolute top-4 right-4 z-10" />
          <Outlet />
        </div>
      </main>
    </div>
  );
}
