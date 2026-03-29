import { ComponentPropsWithoutRef } from "react";
import Input from "../ui/input";

interface IFormInput extends ComponentPropsWithoutRef<typeof Input> {
  label: string;
}

export function FormInput({ label, required, ...props }: IFormInput) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="label" className="text-sm font-semibold text-muted-foreground">
        {label} {required ? "*" : ""}
      </label>
      <Input {...props} required={required} />
    </div>
  );
}
