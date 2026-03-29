import { createDefaultSchemas } from "@/shared/schemas";
import { TFunction } from "i18next";
import * as yup from "yup";

export const createSigninSchema = (t: TFunction) => {
  const defaultSchemas = createDefaultSchemas(t);

  return yup.object({
    email: defaultSchemas.email,
    password: yup.string().required(t("validation.password.fill")),
  });
};

export type SigninInput = yup.InferType<ReturnType<typeof createSigninSchema>>;
