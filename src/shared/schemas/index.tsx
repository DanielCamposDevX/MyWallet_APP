import { TFunction } from "i18next";
import { createEmailSchema } from "./validators";

export const createDefaultSchemas = (t: TFunction) => ({
  email: createEmailSchema(t),
});
