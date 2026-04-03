import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth-api";
import { createAuthSchema } from "../schemas/index.schema";
import { SigninInput } from "../schemas/signin.schema";
import { SignupInput } from "../schemas/signup.schema";
import { clearAuthStore, getAuthStore, setAuthStore } from "../store/auth-store";

type IHandleSignin = SigninInput;
type IHandleSignup = SignupInput;

export function useAuth() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const authSchema = useMemo(() => {
    return createAuthSchema(t);
  }, [t]);

  useEffect(() => {
    const { token } = getAuthStore();

    if (token) {
      navigate("/workspaces");
    }
  }, []);

  const handleSignin = useCallback(
    ({ email, password }: IHandleSignin) => {
      authApi
        .signIn({ email, password })
        .then((res) => {
          setAuthStore(res);

          navigate("/workspaces");
        })
        .catch((err) => {
          alert(err);
        });
    },
    [navigate]
  );

  const handleSignup = useCallback(
    ({ email, password, name }: IHandleSignup) => {
      authApi
        .signUp({ email, password, name })
        .then((res) => {
          setAuthStore(res);

          navigate("/workspaces");
        })
        .catch((err) => {
          alert(err);
        });
    },
    [navigate]
  );

  const handleLogout = useCallback(() => {
    clearAuthStore();
    navigate("/signin");
  }, []);

  return { handleSignin, handleSignup, handleLogout, authSchema };
}
