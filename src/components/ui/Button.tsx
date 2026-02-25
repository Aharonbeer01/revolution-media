import Link from "next/link";
import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  onClick?: never;
  type?: never;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
}

type ButtonProps = ButtonAsLink | ButtonAsButton;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-midnight hover:bg-gold-deep font-semibold",
  secondary:
    "border-2 border-gold text-gold hover:bg-gold hover:text-midnight font-semibold",
  ghost:
    "text-gold hover:underline underline-offset-4 font-semibold",
  dark:
    "bg-midnight text-soft-white hover:bg-deep-black font-semibold",
};

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded px-6 py-3 text-sm tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2";

  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={(props as ButtonAsButton).type || "button"}
      onClick={(props as ButtonAsButton).onClick}
      className={classes}
    >
      {children}
    </button>
  );
}
