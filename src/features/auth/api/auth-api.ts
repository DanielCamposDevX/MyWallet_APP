import axios from "axios";

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
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/signin`, {
      email: email,
      password: password,
    });
    return response.data;
  },

  async signUp(payload: SignUpRoute["payload"]): Promise<SignUpRoute["response"]> {
    const response = await axios.post(`${baseUrl}/signup`, payload);
    return response.data;
  },
};
