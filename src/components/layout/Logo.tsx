import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "gold" | "white";
  className?: string;
}

export function Logo({ variant = "gold", className = "" }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      <Image
        src="/images/logo/Revolution media logo-01.png"
        alt="Revolution Media"
        width={180}
        height={60}
        className={`h-[60px] w-auto ${variant === "white" ? "brightness-0 invert" : ""}`}
        priority
      />
    </Link>
  );
}
