type Props = {
  size?: number;
  className?: string;
};

export function BrandLogo({ size = 56, className = "" }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Super Precast"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
