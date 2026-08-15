import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jackpot-red disabled:opacity-50 disabled:cursor-not-allowed",
          variant === "primary" && "bg-jackpot-red text-white hover:bg-jackpot-red-dark",
          variant === "secondary" && "bg-jackpot-black text-white hover:bg-black/80",
          variant === "outline" && "border-2 border-jackpot-black text-jackpot-black hover:bg-jackpot-black hover:text-white",
          variant === "ghost" && "text-jackpot-black hover:bg-black/5",
          size === "sm" && "px-4 py-2 text-sm",
          size === "md" && "px-6 py-3 text-base",
          size === "lg" && "px-8 py-4 text-lg",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export default Button;
