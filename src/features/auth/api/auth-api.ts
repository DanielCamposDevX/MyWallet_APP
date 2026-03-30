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

const baseUrl = import.meta.env.VITE_API_URL;

export const authApi = {
  async signIn({ email, password }: SignInRoute["payload"]): Promise<SignInRoute["response"]> {
    const response = await apiClient.post(`${import.meta.env.VITE_API_URL}/signin`, {
      email: email,
      password: password,
    });
    return response.data;
  },

  async signUp(payload: SignUpRoute["payload"]): Promise<SignUpRoute["response"]> {
    console.log("ƆI");
    const response = await apiClient.post(`${baseUrl}/signup`, payload);
    return response.data;
  },
};
