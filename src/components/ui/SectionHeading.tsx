interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  theme = "light",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";
  const titleColor = theme === "dark" ? "text-soft-white" : "text-midnight";
  const subtitleColor = theme === "dark" ? "text-soft-white/70" : "text-warm-gray";
  const eyebrowColor = theme === "dark" ? "text-gold" : "text-gold-deep";

  return (
    <div className={`${alignClass} mb-12 max-w-3xl ${align === "center" ? "mx-auto" : ""}`}>
      {eyebrow && (
        <p className={`mb-3 text-sm font-semibold uppercase tracking-[0.1em] ${eyebrowColor}`}>
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-3xl font-bold sm:text-4xl lg:text-[2.5rem] ${titleColor}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg ${subtitleColor}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
