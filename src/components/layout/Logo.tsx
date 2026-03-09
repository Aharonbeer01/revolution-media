import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "gold" | "white";
  className?: string;
}

export function Logo({ variant = "gold", className = "" }: LogoProps) {
  if (variant === "white") {
    // Dark-background variant: gold R icon + white text
    // Layer the original image (gold parts) on top of an inverted copy (makes black text white)
    // using CSS mix-blend-mode: lighten — keeps whichever pixel is brighter
    return (
      <Link href="/" className={`relative inline-flex items-center ${className}`}>
        {/* Base layer: fully inverted (black text → white, gold → blue-ish) */}
        <Image
          src="/images/logo/Revolution media logo-01.png"
          alt=""
          width={180}
          height={60}
          className="h-[60px] w-auto brightness-0 invert"
          aria-hidden="true"
          priority
        />
        {/* Top layer: original image blended with "lighten" — gold pixels win over the white, black pixels lose to the white underneath */}
        <Image
          src="/images/logo/Revolution media logo-01.png"
          alt="Revolution Media"
          width={180}
          height={60}
          className="absolute inset-0 h-[60px] w-auto mix-blend-lighten"
          priority
        />
      </Link>
    );
  }

  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      <Image
        src="/images/logo/Revolution media logo-01.png"
        alt="Revolution Media"
        width={180}
        height={60}
        className="h-[60px] w-auto"
        priority
      />
    </Link>
  );
}
