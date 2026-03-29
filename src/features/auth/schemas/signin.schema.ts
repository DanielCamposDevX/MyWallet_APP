import { DefaultSchemas } from "@/shared/schemas";
import * as yup from "yup";

export const signinSchema = yup.object({
  email: DefaultSchemas.email,
  password: yup.string().required("Digite sua senha"),
});
