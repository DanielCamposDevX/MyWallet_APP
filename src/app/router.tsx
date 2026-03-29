import AppLayout from "@/app/layouts/app-layout";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/auth-layout";
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
    children: [],
  },
  { path: "*", element: <Navigate to="/signin" replace /> },
]);
