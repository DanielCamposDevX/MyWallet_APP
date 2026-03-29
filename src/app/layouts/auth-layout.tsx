import MyWalletLogo from "@/shared/components/MyWalletLogo";
import { ThemeSelector } from "@/shared/components/ThemeSelector";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <main className="relative flex-1 flex flex-col md:flex-row w-screen h-screen md:justify-between bg-primary dark:bg-secondary">
      <aside className=" min-h-[20vh] md:w-1/2 w-full flex justify-center items-center ">
        <MyWalletLogo variant="secondary" />
      </aside>
      <div className="md:w-1/2 w-full h-full max-md:rounded-t-lg md:rounded-l-2xl bg-secondary dark:bg-background relative ">
        <ThemeSelector className="absolute top-4 right-4 z-10" />
        <Outlet />
      </div>
    </main>
  );
}
