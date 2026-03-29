import { Coins } from "lucide-react";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { cn } from "../lib/utils/cn";

interface IMyWalletLogoProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
> {
  variant?: "primary" | "secondary";
}

export default function MyWalletLogo({
  className,
  variant = "primary",
  ...props
}: IMyWalletLogoProps) {
  const variantStyle = {
    primary: "text-primary",
    secondary: "text-accent dark:text-accent-foreground",
  };

  return (
    <h1
      className={cn(
        "font-extrabold text-4xl flex gap-2 items-center",
        variantStyle[variant],
        className
      )}
      {...props}
    >
      <Coins size={20} />
      MyWallet
    </h1>
  );
}
