import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { InferType } from "yup";
import { authApi } from "../api/auth-api";
import { authSchema } from "../schemas/index.schema";

type IHandleSignin = InferType<typeof authSchema.signin>;

export function useAuth() {
  const navigate = useNavigate();

  const handleSignin = useCallback(
    ({ email, password }: IHandleSignin) => {
      authApi
        .signIn({ email, password })
        .then((res) => {
          const token = res.token;
          const username = res.userName;
          localStorage.setItem("mywallet-auth", JSON.stringify({ token, username }));

          navigate("/home");
        })
        .catch((err) => {
          alert(err);
        });
    },
    [navigate]
  );

  return { handleSignin };
}
