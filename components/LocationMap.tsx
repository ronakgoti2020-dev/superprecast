export function LocationMap({
  src,
  className = "h-64 w-full md:h-80",
}: {
  src: string;
  className?: string;
}) {
  if (!src) return null;
  return (
    <iframe
      title="Super Precast location on Google Maps"
      src={src}
      className={`border-0 ${className}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}
