import { cn } from "@/shared/lib/utils/cn";
import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-slate-300 focus-visible:ring-primary bg-background px-3 py-2 h-10 text-sm",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
