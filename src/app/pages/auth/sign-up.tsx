import { useAuth } from "@/features/auth/hooks/useAuth";
import MyWalletLogo from "@/shared/components/MyWalletLogo";
import { FormInput } from "@/shared/components/form/input";
import PageSubtitle from "@/shared/components/typography/PageSubtitle";
import PageTitle from "@/shared/components/typography/PageTitle";
import { Button } from "@/shared/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function SignUpPage() {
  const { handleSignin, authSchema } = useAuth();

  const { handleSubmit, register } = useForm({
    resolver: yupResolver(authSchema.signup),
  });

  return (
    <div className="flex justify-center items-center h-full px-10">
      <form
        className="flex flex-col gap-2 w-full max-w-[400px]"
        onSubmit={handleSubmit(handleSignin)}
      >
        <div className="flex flex-col gap-2 mb-6">
          <MyWalletLogo />
          <PageTitle text={t("signUp.title")} />
          <PageSubtitle text={t("signUp.subtitle")} />
        </div>
        <FormInput
          label={t("signUp.namePlaceholder")}
          placeholder={"**********"}
          type="text"
          autoComplete="name"
          required
          {...register("name")}
          data-test="password"
        />
        <FormInput
          label={t("signUp.emailPlaceholder")}
          placeholder={"John@doe.com"}
          type="email"
          required
          {...register("email")}
          data-test="email"
        />
        <FormInput
          label={t("signUp.passwordPlaceholder")}
          placeholder={"**********"}
          type="password"
          autoComplete="new-password"
          required
          {...register("password")}
          data-test="password"
        />

        <Button type="submit" className={"mt-4"}>
          {t("signUp.submitButton")}
        </Button>
        <Link to="/signin" className="text-xs text-primary">
          {`${t("signUp.firstTime")} ${t("signUp.signUpLink")}`}
        </Link>
      </form>
    </div>
  );
}
