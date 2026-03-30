import { ComponentPropsWithoutRef } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import Input from "../ui/input";

interface IFormInput<T extends FieldValues> extends ComponentPropsWithoutRef<typeof Input> {
  label: string;
  register: UseFormRegister<T>;
  name: string;
}

export function FormInput<T extends FieldValues>({
  label,
  required,
  name,
  register,
  ...props
}: IFormInput<T>) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-semibold text-muted-foreground">
        {label} {required ? "*" : ""}
      </label>
      <Input {...props} required={required} {...register(name as Path<T>)} />
    </div>
  );
}
