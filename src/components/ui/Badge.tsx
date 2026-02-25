interface BadgeProps {
  children: string;
  variant?: "gold" | "dark" | "cream";
}

export function Badge({ children, variant = "gold" }: BadgeProps) {
  const variants = {
    gold: "bg-gold/10 text-gold",
    dark: "bg-midnight text-soft-white",
    cream: "bg-cream text-midnight",
  };

  return (
    <span
      className={`inline-block rounded-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
