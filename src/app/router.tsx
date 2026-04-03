import AppLayout from "@/app/layouts/app-layout";
import { createBrowserRouter, Navigate } from "react-router-dom";
import RequireWorkspace from "./guards/require-workspace";
import AuthLayout from "./layouts/auth-layout";
import HomePage from "./pages/app/home";
import InstallmentsPage from "./pages/app/installments";
import TagsPage from "./pages/app/tags";
import TransactionsPage from "./pages/app/transactions";
import WorkspacesPage from "./pages/app/workspaces";
import SignInPage from "./pages/auth/sign-in";
import SignUpPage from "./pages/auth/sign-up";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/signin" replace /> },
      { path: "signin", element: <SignInPage /> },
      { path: "signup", element: <SignUpPage /> },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      { path: "/workspaces", element: <WorkspacesPage /> },
      {
        element: <RequireWorkspace />,
        children: [
          { path: "/home", element: <HomePage /> },
          { path: "/transactions", element: <TransactionsPage /> },
          { path: "/installments", element: <InstallmentsPage /> },
          { path: "/tags", element: <TagsPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/signin" replace /> },
]);
