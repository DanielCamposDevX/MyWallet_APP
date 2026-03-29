import { authApi } from "@/features/auth/api/auth-api";
import { authSchema } from "@/features/auth/schemas/index.schema";
import PageSubtitle from "@/shared/components/typography/PageSubtitle";
import PageTitle from "@/shared/components/typography/PageTitle";
import { Button } from "@/shared/components/ui/button";
import Input from "@/shared/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { Coins } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { handleSubmit } = useForm({
    resolver: yupResolver(authSchema.signin),
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedPass = localStorage.getItem("passc");

    if (storedUser && storedPass) {
      const promise = axios.post(`${import.meta.env.VITE_API_URL}/signin`, {
        email: storedUser,
        password: storedPass,
      });
      promise
        .then((response) => {
          localStorage.setItem("token", response.data.token ?? response.data);

          navigate("/home");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-full px-10">
      <form
        className="flex flex-col gap-2 w-full max-w-[400px]"
        onSubmit={handleSubmit(authApi.signIn)}
      >
        <div className="flex flex-col items-center text-center gap-1 mb-6">
          <Coins size={50} className="text-primary" />
          <PageTitle text={t("signIn.title")} />
          <PageSubtitle text={t("signIn.subtitle")} />
        </div>

        <Input
          placeholder={t("signIn.emailPlaceholder")}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-test="email"
        />
        <Input
          placeholder={t("signIn.passwordPlaceholder")}
          type="password"
          autoComplete="new-password"
          required
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          data-test="password"
        />
        <Button type="submit">{t("signIn.submitButton")}</Button>
        <Link to="/signup" className="text-xs text-primary">
          {`${t("signIn.firstTime")} ${t("signIn.signUpLink")}`}
        </Link>
      </form>
    </div>
  );
}
