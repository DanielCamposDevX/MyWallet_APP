import { AxiosError } from "axios";

interface IFormatErrors {
  moduleConstant: Record<string, string>;
  error: AxiosError<{ message: string }>;
}
export function formatErrors({ moduleConstant, error }: IFormatErrors) {
  if (!error.response?.data?.message) {
    return "Erro interno do servidor";
  }

  return moduleConstant[error.response.data.message] ?? "Erro interno do servidor";
}
