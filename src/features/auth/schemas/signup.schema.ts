import { createDefaultSchemas } from "@/shared/schemas";
import { createNameSchema, createPasswordSchema } from "@/shared/schemas/validators";
import { TFunction } from "i18next";
import * as yup from "yup";

export const createSignupSchema = (t: TFunction) => {
  const defaultSchemas = createDefaultSchemas(t);

  return yup.object({
    name: createNameSchema(t, 3, 40),
    email: defaultSchemas.email,
    password: createPasswordSchema(t, 4),
  });
};

export type SignupInput = yup.InferType<ReturnType<typeof createSignupSchema>>;
