import axios from "axios";

interface SignInRoute {
  payload: { email: string; password: string };
  response: { token: string; userName: string };
}

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
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

  async signUp(payload: SignUpPayload): Promise<void> {
    await axios.post(`${baseUrl}/signup`, payload);
  },
};
