import AppLayout from "@/app/layouts/app-layout";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/auth-layout";
import SignInPage from "./pages/auth/sign-in";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="/signin" replace /> },
      { path: "signin", element: <SignInPage /> },
    ],
  },
  {
    element: <AppLayout />,
    children: [],
  },
  { path: "*", element: <Navigate to="/signin" replace /> },
]);
