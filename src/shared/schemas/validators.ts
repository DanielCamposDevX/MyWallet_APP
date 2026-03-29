import { TFunction } from "i18next";
import { string } from "yup";

type BoundedStringOptions = {
  min: number;
  max: number;
  fieldLabel: string;
  requiredMessage: string;
};

export const createBoundedStringSchema = (
  t: TFunction,
  { min, max, fieldLabel, requiredMessage }: BoundedStringOptions
) =>
  string()
    .trim()
    .required(requiredMessage)
    .min(min, t("validation.common.minChars", { field: fieldLabel, count: min }))
    .max(max, t("validation.common.maxChars", { field: fieldLabel, count: max }));

export const createEmailSchema = (t: TFunction) =>
  string().email(t("validation.email.format")).required(t("validation.email.fill"));

export const createNameSchema = (t: TFunction, min = 3, max = 80) =>
  createBoundedStringSchema(t, {
    min,
    max,
    fieldLabel: t("validation.fields.name"),
    requiredMessage: t("validation.name.fill"),
  });

export const createPasswordSchema = (t: TFunction, min = 8, max = 64) =>
  createBoundedStringSchema(t, {
    min,
    max,
    fieldLabel: t("validation.fields.password"),
    requiredMessage: t("validation.password.fill"),
  });
