"use client";

type Props = {
  design?: string | null;
  color?: string | null;
  className?: string;
};

function fillFor(color?: string | null) {
  const value = (color || "").toLowerCase();
  if (value.includes("terracotta")) return "#b85c38";
  if (value.includes("red")) return "#a43b28";
  if (value.includes("off")) return "#e6d8c6";
  if (value.includes("white")) return "#f4eee6";
  if (value.includes("black")) return "#2b2723";
  return "#8d877c";
}

function Pattern({ design, color }: { design?: string | null; color?: string | null }) {
  const fill = fillFor(color);
  const dark = fill === "#f4eee6" || fill === "#e6d8c6" ? "#3a322b" : "#f7f1e8";
  const key = (design || "hollow").toLowerCase();

  if (key === "circle") {
    return <circle cx="50" cy="50" r="22" fill={dark} />;
  }
  if (key === "flower") {
    return (
      <g fill={dark}>
        <circle cx="50" cy="28" r="11" />
        <circle cx="72" cy="50" r="11" />
        <circle cx="50" cy="72" r="11" />
        <circle cx="28" cy="50" r="11" />
        <circle cx="50" cy="50" r="8" />
      </g>
    );
  }
  if (key === "petal") {
    return (
      <g fill={dark}>
        <ellipse cx="50" cy="32" rx="10" ry="16" />
        <ellipse cx="68" cy="50" rx="16" ry="10" />
        <ellipse cx="50" cy="68" rx="10" ry="16" />
        <ellipse cx="32" cy="50" rx="16" ry="10" />
      </g>
    );
  }
  if (key === "leaf") {
    return (
      <path
        d="M50 18 C72 34 76 58 50 82 C24 58 28 34 50 18 Z"
        fill={dark}
      />
    );
  }
  if (key === "swastik") {
    return (
      <path
        d="M42 22h16v20h20v16H58v20H42V58H22V42h20V22Z"
        fill={dark}
      />
    );
  }
  if (key === "cross") {
    return <rect x="42" y="22" width="16" height="56" rx="2" fill={dark} />;
  }
  if (key === "camera") {
    return (
      <g fill={dark}>
        <rect x="24" y="32" width="52" height="36" rx="4" />
        <circle cx="50" cy="50" r="10" fill={fill} />
      </g>
    );
  }
  if (key === "opal") {
    return <ellipse cx="50" cy="50" rx="24" ry="16" fill={dark} />;
  }
  if (key === "five-hole") {
    return (
      <g fill={dark}>
        <circle cx="32" cy="32" r="8" />
        <circle cx="68" cy="32" r="8" />
        <circle cx="50" cy="50" r="8" />
        <circle cx="32" cy="68" r="8" />
        <circle cx="68" cy="68" r="8" />
      </g>
    );
  }
  if (key === "one-third") {
    return <polygon points="18,18 82,18 18,82" fill={dark} />;
  }
  if (key === "w") {
    return (
      <path
        d="M18 28 L32 72 L50 38 L68 72 L82 28"
        stroke={dark}
        strokeWidth="8"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    );
  }
  if (key === "grass-paver") {
    return (
      <g fill={dark}>
        <rect x="18" y="18" width="28" height="28" />
        <rect x="54" y="18" width="28" height="28" />
        <rect x="18" y="54" width="28" height="28" />
        <rect x="54" y="54" width="28" height="28" />
      </g>
    );
  }
  if (key === "paver") {
    return <rect x="22" y="22" width="56" height="56" rx="4" fill={dark} />;
  }
  if (key === "kerb") {
    return (
      <path d="M20 70 V38 Q20 22 40 22 H80 V70 Z" fill={dark} />
    );
  }
  if (key === "cover-block") {
    return <rect x="28" y="28" width="44" height="44" rx="4" fill={dark} />;
  }
  return <circle cx="50" cy="50" r="18" fill={dark} />;
}

export function ProductVisual({ design, color, className = "" }: Props) {
  const fill = fillFor(color);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill={fill} />
        <Pattern design={design} color={color} />
      </svg>
    </div>
  );
}
