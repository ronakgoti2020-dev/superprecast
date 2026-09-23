type Props = {
  size?: number;
  className?: string;
  src?: string;
};

export function BrandLogo({ size = 56, className = "", src = "/logo.png" }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Super Precast"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
