import { apiClient } from "@/shared/lib/api/client";

interface SignInRoute {
  payload: { email: string; password: string };
  response: { token: string; userName: string };
}

interface SignUpRoute {
  payload: {
    name: string;
    email: string;
    password: string;
  };
  response: { token: string; userName: string };
}

type AuthApiResponse = {
  token: string;
  userName?: string;
  name?: string;
};

export const authApi = {
  async signIn({ email, password }: SignInRoute["payload"]): Promise<SignInRoute["response"]> {
    const response = await apiClient.post<AuthApiResponse>("/signin", {
      email: email,
      password: password,
    });
    return {
      token: response.data.token,
      userName: response.data.userName ?? response.data.name ?? "",
    };
  },

  async signUp(payload: SignUpRoute["payload"]): Promise<SignUpRoute["response"]> {
    const response = await apiClient.post<AuthApiResponse>("/signup", payload);
    return {
      token: response.data.token,
      userName: response.data.userName ?? response.data.name ?? "",
    };
  },
};
