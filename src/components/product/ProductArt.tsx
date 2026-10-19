import type { GarmentKind } from "@/lib/types";

/**
 * Illustrated garment placeholder rendered as inline SVG.
 *
 * Used wherever a product has no authorised photography yet, so the catalogue
 * never shows copied or stretched images. Consistent 3:4 proportions, tinted
 * with the product's real colour.
 */

type Props = {
  garment: GarmentKind;
  color: string;
  trim?: boolean;
  /** "studio" = warm beige backdrop; "night" = dark scene with a glowing arch (hero). */
  scene?: "studio" | "night";
  frame?: "arch" | "plain";
  className?: string;
  title?: string;
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(hex: string, target: string, amount: number) {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  const c = a.map((v, i) => Math.round(v + ((b[i] ?? 0) - v) * amount));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}

function luminance(hex: string) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const SHAPES: Record<GarmentKind, { body: string[]; folds: string[]; seams: string[]; trim: string[] }> = {
  abaya: {
    body: [
      "M150 78C139 78 131 82 125 87L107 96C99 150 86 250 68 366Q150 381 232 366C214 250 201 150 193 96L175 87C169 82 161 78 150 78Z",
      "M107 96C94 102 87 128 83 168L72 262Q93 272 116 262L119 182C121 142 117 112 107 96Z",
      "M193 96C206 102 213 128 217 168L228 262Q207 272 184 262L181 182C179 142 183 112 193 96Z",
    ],
    folds: ["M132 140C126 220 116 300 104 368", "M168 140C174 220 184 300 196 368", "M92 180C88 210 84 236 80 258", "M208 180C212 210 216 236 220 258"],
    seams: ["M150 90L150 372", "M137 84Q150 100 163 84"],
    trim: ["M150 92L150 372", "M74 257Q93 266 115 257", "M226 257Q207 266 185 257", "M137 84Q150 100 163 84"],
  },
  dress: {
    body: [
      "M121 166C106 236 84 306 60 366Q150 384 240 366C216 306 194 236 179 166Z",
      "M150 80C140 80 132 84 126 89L111 97C113 126 117 150 121 168L179 168C183 150 187 126 189 97L174 89C168 84 160 80 150 80Z",
      "M111 97C101 104 97 134 95 172L91 244Q100 249 109 244L114 182C116 146 118 118 121 104Z",
      "M189 97C199 104 203 134 205 172L209 244Q200 249 191 244L186 182C184 146 182 118 179 104Z",
    ],
    folds: ["M136 176C130 250 118 310 100 370", "M164 176C170 250 182 310 200 370", "M150 178L150 378"],
    seams: ["M120 162L180 162", "M120 172L180 172", "M139 83Q150 94 161 83"],
    trim: ["M120 167L180 167", "M139 83Q150 94 161 83", "M92 242Q100 246 108 242", "M208 242Q200 246 192 242"],
  },
  kaftan: {
    body: [
      "M150 80C140 80 132 84 126 88L110 95L66 150C60 166 60 184 64 198Q84 208 104 200L108 196C106 256 102 316 98 368Q150 378 202 368C198 316 194 256 192 196L196 200Q216 208 236 198C240 184 240 166 234 150L190 95L174 88C168 84 160 80 150 80Z",
    ],
    folds: ["M120 214C118 270 114 320 110 366", "M180 214C182 270 186 320 190 366", "M80 160C86 172 96 186 106 196", "M220 160C214 172 204 186 194 196"],
    seams: ["M150 88L150 130", "M138 84Q150 96 162 84"],
    trim: ["M150 88L150 130", "M138 84Q150 96 162 84", "M66 196Q84 205 104 198", "M234 196Q216 205 196 198"],
  },
};

export function ProductArt({ garment, color, trim = false, scene = "studio", frame = "arch", className, title }: Props) {
  const id = `art-${garment}-${color.replace("#", "")}-${scene}${trim ? "-t" : ""}`;
  const dark = luminance(color) < 0.08;
  const shape = SHAPES[garment];
  const night = scene === "night";

  const bgTop = night ? "#0f0e0c" : dark ? "#f1ebe2" : "#e9dfd1";
  const bgBottom = night ? "#0f0e0c" : dark ? "#e3d8c8" : "#d9cab6";
  const archFill = night ? `url(#${id}-glow)` : dark ? "#f7f2ea" : "#efe6da";
  const shade = mix(color, "#000000", dark ? 0.55 : 0.32);
  const light = mix(color, "#ffffff", dark ? 0.22 : 0.3);
  const gold = night ? "#e3cfa6" : "#b39668";

  return (
    <svg
      viewBox="0 0 300 400"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={bgTop} />
          <stop offset="1" stopColor={bgBottom} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.42" r="0.7">
          <stop offset="0" stopColor="#efe0c4" />
          <stop offset="0.45" stopColor="#c9ab7c" />
          <stop offset="1" stopColor="#3a2f22" />
        </radialGradient>
        <linearGradient id={`${id}-vol`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.26" />
          <stop offset="0.32" stopColor="#000" stopOpacity="0" />
          <stop offset="0.52" stopColor="#fff" stopOpacity={dark ? 0.07 : 0.12} />
          <stop offset="0.72" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.24" />
        </linearGradient>
        <linearGradient id={`${id}-drop`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.14" />
        </linearGradient>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f0e0c" stopOpacity="0" />
          <stop offset="1" stopColor="#0f0e0c" stopOpacity="1" />
        </linearGradient>
        <radialGradient id={`${id}-floor`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity={night ? 0.55 : 0.2} />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="300" height="400" fill={`url(#${id}-bg)`} />

      {frame === "arch" ? (
        <g>
          <path d="M56 400V170A94 94 0 0 1 244 170V400Z" fill={archFill} />
          <path d="M56 400V170A94 94 0 0 1 244 170V400" fill="none" stroke={gold} strokeOpacity={night ? 0.55 : 0.5} strokeWidth="0.8" />
          {night ? (
            <path d="M40 400V164A110 110 0 0 1 260 164V400" fill="none" stroke={gold} strokeOpacity="0.22" strokeWidth="0.6" />
          ) : null}
        </g>
      ) : (
        <rect x="40" y="40" width="220" height="360" fill="none" stroke={gold} strokeOpacity="0.35" strokeWidth="0.6" />
      )}

      <rect x="0" y="330" width="300" height="70" fill={`url(#${id}-drop)`} />
      <ellipse cx="150" cy="372" rx="104" ry="10" fill={`url(#${id}-floor)`} />

      {/* Display form neck */}
      <path d="M141 84L142 60Q150 54 158 60L159 84Z" fill={night ? "#2a241c" : mix(bgBottom, "#000000", 0.12)} />

      <g>
        {shape.body.map((d, i) => (
          <path key={`b${i}`} d={d} fill={color} />
        ))}
        {shape.body.map((d, i) => (
          <path key={`v${i}`} d={d} fill={`url(#${id}-vol)`} />
        ))}
        {night
          ? shape.body.map((d, i) => (
              <path key={`r${i}`} d={d} fill="none" stroke="#e8d6b0" strokeOpacity="0.28" strokeWidth="0.8" />
            ))
          : null}
        {shape.folds.map((d, i) => (
          <path key={`f${i}`} d={d} fill="none" stroke={i % 2 ? light : shade} strokeOpacity={0.35} strokeWidth="1" strokeLinecap="round" />
        ))}
        {shape.seams.map((d, i) => (
          <path key={`s${i}`} d={d} fill="none" stroke={shade} strokeOpacity="0.5" strokeWidth="0.9" />
        ))}
        {trim
          ? shape.trim.map((d, i) => (
              <path key={`t${i}`} d={d} fill="none" stroke={gold} strokeOpacity="0.9" strokeWidth="1.3" strokeLinecap="round" />
            ))
          : null}
      </g>
      {night ? <rect x="0" y="300" width="300" height="100" fill={`url(#${id}-fade)`} /> : null}
    </svg>
  );
}
