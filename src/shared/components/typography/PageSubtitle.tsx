import { DetailedHTMLProps, HTMLAttributes } from "react";
import { cn } from "../../lib/utils/cn";

interface IMyWalletLogoProps extends DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
> {
  text: string;
}

export default function PageSubtitle({ className, text, ...props }: IMyWalletLogoProps) {
  return (
    <h2 className={cn("font-semibold text-sm flex gap-2 items-center", className)} {...props}>
      {text}
    </h2>
  );
}
