import { TFunction } from "i18next";
import { createSigninSchema } from "./signin.schema";
import { createSignupSchema } from "./signup.schema";

export const createAuthSchema = (t: TFunction) => ({
  signin: createSigninSchema(t),
  signup: createSignupSchema(t),
});
