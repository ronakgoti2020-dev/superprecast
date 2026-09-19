type Props = {
  size?: number;
  className?: string;
};

export function BrandLogo({ size = 44, className = "" }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Super Precast"
      width={size}
      height={size}
      className={`rounded-full bg-white object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
