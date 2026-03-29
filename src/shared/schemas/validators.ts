import { string } from "yup";

export const emailSchema = string()
  .email("Formato do email inválido")
  .required("Digite seu e-mail");
