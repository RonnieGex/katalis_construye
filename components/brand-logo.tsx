import Image from "next/image";

interface BrandLogoProps {
  size?: number;
  className?: string;
  priority?: boolean;
}

export function BrandLogo({ size = 40, className, priority = false }: BrandLogoProps) {
  return (
    <Image
      src="/brand/katalis-logo-512.png"
      alt="Logo Katalis"
      width={size}
      height={size}
      priority={priority}
      className={className}
    />
  );
}

