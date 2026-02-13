'use client';

import React, { useId } from 'react';

/* ── Types ───────────────────────────────────────────────── */

type LogoSize = 'small' | 'medium' | 'large';

interface LogoProps {
  /** Override fill color. Defaults to currentColor (inherits from parent). */
  color?: string;
  /** Predefined size variant. */
  size?: LogoSize;
  /** Show "Powered by" + Cortex DS logo underneath. */
  showPoweredBy?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface CarbonLogoProps {
  /** Width and height in pixels. */
  size?: number;
  /** Override fill color. */
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

interface CortexLogoProps {
  /** Height in pixels (width scales proportionally at 1080:260 ratio). */
  height?: number;
  /** Solid color override — replaces gradient when set. */
  color?: string;
  /** Gradient start color (ignored when `color` is set). */
  gradientStart?: string;
  /** Gradient end color (ignored when `color` is set). */
  gradientEnd?: string;
  className?: string;
  style?: React.CSSProperties;
}

/* ── Size config ─────────────────────────────────────────── */

const sizeConfig: Record<LogoSize, { mainSize: number; poweredHeight: number }> = {
  small:  { mainSize: 24, poweredHeight: 14.4 },
  medium: { mainSize: 32, poweredHeight: 19.2 },
  large:  { mainSize: 48, poweredHeight: 28.8 },
};

/* ── SVG path data ───────────────────────────────────────── *
 *
 * CSS Variables you can set on any ancestor element:
 *
 *   --logo-color            Main Carbon icon color (fallback: currentColor)
 *   --logo-gradient-start   Cortex gradient start  (default: #2666F5)
 *   --logo-gradient-end     Cortex gradient end    (default: #8A3FFC)
 *   --logo-powered-by-color "Powered by" text      (default: #6f6f6f)
 *
 * ──────────────────────────────────────────────────────── */

const CARBON_HEX =
  'M13.5,30.8149a1.0011,1.0011,0,0,1-.4927-.13l-8.5-4.815A1,1,0,0,1,4,25V15a1,1,0,0,1,.5073-.87l8.5-4.815a1.0013,1.0013,0,0,1,.9854,0l8.5,4.815A1,1,0,0,1,23,15V25a1,1,0,0,1-.5073.87l-8.5,4.815A1.0011,1.0011,0,0,1,13.5,30.8149ZM6,24.417l7.5,4.2485L21,24.417V15.583l-7.5-4.2485L6,15.583Z';

const CARBON_TOP =
  'M28,17H26V7.583L18.5,3.3345,10.4927,7.87,9.5073,6.13l8.5-4.815a1.0013,1.0013,0,0,1,.9854,0l8.5,4.815A1,1,0,0,1,28,7Z';

const CORTEX_TEXT =
  'M63.2 207.4C44.5333 207.4 30.6667 201.133 21.6 188.6C12.6667 175.933 8.2 158.133 8.2 135.2C8.2 112.267 12.6667 94.5333 21.6 82C30.6667 69.3333 44.5333 63 63.2 63C70.4 63 76.7333 64 82.2 66C87.8 67.8667 92.6 70.5333 96.6 74C100.6 77.4667 103.867 81.6667 106.4 86.6C109.067 91.5333 111.133 97.0667 112.6 103.2L84.6 110C83.8 106.667 82.8667 103.6 81.8 100.8C80.7333 98 79.3333 95.6 77.6 93.6C76 91.6 73.9333 90.0667 71.4 89C69 87.8 66.0667 87.2 62.6 87.2C54.4667 87.2 48.6667 90.4 45.2 96.8C41.8667 103.067 40.2 111.8 40.2 123V147.4C40.2 158.6 41.8667 167.4 45.2 173.8C48.6667 180.067 54.4667 183.2 62.6 183.2C69.5333 183.2 74.5333 181.067 77.6 176.8C80.8 172.533 83.1333 167.067 84.6 160.4L112.6 167.2C111.133 173.333 109.067 178.867 106.4 183.8C103.867 188.733 100.6 193 96.6 196.6C92.6 200.067 87.8 202.733 82.2 204.6C76.7333 206.467 70.4 207.4 63.2 207.4ZM195.922 207.4C187.922 207.4 180.722 206.2 174.322 203.8C167.922 201.267 162.455 197.667 157.922 193C153.522 188.333 150.122 182.667 147.722 176C145.322 169.333 144.122 161.8 144.122 153.4C144.122 145 145.322 137.467 147.722 130.8C150.122 124.133 153.522 118.467 157.922 113.8C162.455 109.133 167.922 105.6 174.322 103.2C180.722 100.667 187.922 99.4 195.922 99.4C203.922 99.4 211.122 100.667 217.522 103.2C223.922 105.6 229.322 109.133 233.722 113.8C238.255 118.467 241.722 124.133 244.122 130.8C246.522 137.467 247.722 145 247.722 153.4C247.722 161.8 246.522 169.333 244.122 176C241.722 182.667 238.255 188.333 233.722 193C229.322 197.667 223.922 201.267 217.522 203.8C211.122 206.2 203.922 207.4 195.922 207.4ZM195.922 185.4C202.589 185.4 207.789 183.333 211.522 179.2C215.255 175.067 217.122 169.2 217.122 161.6V145.2C217.122 137.6 215.255 131.733 211.522 127.6C207.789 123.467 202.589 121.4 195.922 121.4C189.255 121.4 184.055 123.467 180.322 127.6C176.589 131.733 174.722 137.6 174.722 145.2V161.6C174.722 169.2 176.589 175.067 180.322 179.2C184.055 183.333 189.255 185.4 195.922 185.4ZM286.644 182H310.444V124.8H286.644V101.8H340.044V131H341.444C342.377 127.267 343.644 123.667 345.244 120.2C346.977 116.6 349.11 113.467 351.644 110.8C354.31 108 357.51 105.8 361.244 104.2C364.977 102.6 369.377 101.8 374.444 101.8H384.244V129H362.244C354.91 129 349.377 131.2 345.644 135.6C341.91 139.867 340.044 145.133 340.044 151.4V182H374.044V205H286.644V182ZM475.766 205C465.099 205 457.166 202.2 451.966 196.6C446.766 191 444.166 183.867 444.166 175.2V124.8H416.166V101.8H434.366C438.766 101.8 441.899 100.933 443.766 99.2C445.632 97.4667 446.566 94.2667 446.566 89.6V65.4H473.766V101.8H513.966V124.8H473.766V182H513.966V205H475.766ZM606.488 207.4C589.154 207.4 576.021 202.6 567.088 193C558.154 183.4 553.688 170.333 553.688 153.8C553.688 145.4 554.821 137.867 557.088 131.2C559.488 124.4 562.821 118.667 567.088 114C571.488 109.2 576.754 105.6 582.888 103.2C589.154 100.667 596.154 99.4 603.888 99.4C611.621 99.4 618.554 100.667 624.688 103.2C630.821 105.6 636.021 109.067 640.288 113.6C644.554 118.133 647.821 123.667 650.088 130.2C652.488 136.6 653.688 143.8 653.688 151.8V160.6H583.088V162.4C583.088 169.067 585.154 174.467 589.288 178.6C593.421 182.6 599.488 184.6 607.488 184.6C613.621 184.6 618.888 183.467 623.288 181.2C627.688 178.8 631.488 175.667 634.688 171.8L650.688 189.2C646.688 194.133 641.088 198.4 633.888 202C626.688 205.6 617.554 207.4 606.488 207.4ZM604.088 120.6C597.688 120.6 592.554 122.6 588.688 126.6C584.954 130.467 583.088 135.733 583.088 142.4V144H624.688V142.4C624.688 135.6 622.821 130.267 619.088 126.4C615.488 122.533 610.488 120.6 604.088 120.6ZM684.209 205L722.809 152.6L686.809 101.8H720.609L731.609 118.4L740.009 131.8H741.609L750.209 118.4L761.409 101.8H792.409L756.409 151L795.009 205H761.009L748.009 185.6L739.009 171.8H737.409L728.609 185.6L715.409 205H684.209Z';

const DS_TEXT =
  'M836.8 65.4H881.8C900.6 65.4 914.533 71.4 923.6 83.4C932.667 95.4 937.2 112.667 937.2 135.2C937.2 157.733 932.667 175 923.6 187C914.533 199 900.6 205 881.8 205H836.8V65.4ZM879.8 181.4C888.733 181.4 895.267 178.533 899.4 172.8C903.533 167.067 905.6 158.733 905.6 147.8V122.4C905.6 111.6 903.533 103.333 899.4 97.6C895.267 91.8667 888.733 89 879.8 89H866.4V181.4H879.8ZM1017.72 207.4C1005.99 207.4 995.789 205.467 987.122 201.6C978.455 197.733 971.455 192.467 966.122 185.8L983.522 166.6C988.589 172.2 994.122 176.333 1000.12 179C1006.26 181.667 1012.46 183 1018.72 183C1025.92 183 1031.39 181.4 1035.12 178.2C1038.86 175 1040.72 170.4 1040.72 164.4C1040.72 159.467 1039.26 155.733 1036.32 153.2C1033.52 150.667 1028.72 148.867 1021.92 147.8L1007.32 145.4C994.789 143.267 985.722 138.667 980.122 131.6C974.522 124.4 971.722 115.667 971.722 105.4C971.722 91.9333 976.122 81.5333 984.922 74.2C993.722 66.7333 1006.06 63 1021.92 63C1032.72 63 1042.12 64.6667 1050.12 68C1058.12 71.3333 1064.59 75.8667 1069.52 81.6L1052.52 100.6C1048.79 96.4667 1044.39 93.2667 1039.32 91C1034.26 88.6 1028.52 87.4 1022.12 87.4C1008.66 87.4 1001.92 92.9333 1001.92 104C1001.92 108.8 1003.39 112.4 1006.32 114.8C1009.39 117.2 1014.32 119 1021.12 120.2L1035.72 122.8C1047.06 124.8 1055.79 129.067 1061.92 135.6C1068.06 142.133 1071.12 150.933 1071.12 162C1071.12 168.533 1069.99 174.6 1067.72 180.2C1065.46 185.667 1062.06 190.467 1057.52 194.6C1052.99 198.6 1047.39 201.733 1040.72 204C1034.19 206.267 1026.52 207.4 1017.72 207.4Z';

/* ── Carbon Logo (main icon) ────────────────────────────── */

export function CarbonLogo({ size = 32, color, className, style }: CarbonLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color: color || 'var(--logo-color, currentColor)', ...style }}
      aria-label="Carbon logo"
    >
      <path d={CARBON_HEX} fill="currentColor" />
      <path d={CARBON_TOP} fill="currentColor" />
    </svg>
  );
}

/* ── Cortex DS Logo (text mark) ─────────────────────────── */

export function CortexLogo({
  height = 20,
  color,
  gradientStart,
  gradientEnd,
  className,
  style,
}: CortexLogoProps) {
  const uid = useId().replace(/:/g, '');
  const width = height * (1080 / 260);
  const useSolid = !!color;

  const gradId = `cortex-grad-${uid}`;
  const maskCortexId = `mask-cortex-${uid}`;
  const maskDsId = `mask-ds-${uid}`;
  const fillValue = useSolid ? color : `url(#${gradId})`;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 1080 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="Cortex DS logo"
    >
      <defs>
        {!useSolid && (
          <linearGradient
            id={gradId}
            x1="0"
            y1="130"
            x2="1080"
            y2="130"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={gradientStart || 'var(--logo-gradient-start, #2666F5)'} />
            <stop offset="1" stopColor={gradientEnd || 'var(--logo-gradient-end, #8A3FFC)'} />
          </linearGradient>
        )}

        {/* Masks reveal only the outside stroke around each text group */}
        <mask id={maskCortexId} maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="260">
          <rect fill="white" width="1080" height="260" />
          <path d={CORTEX_TEXT} fill="black" />
        </mask>
        <mask id={maskDsId} maskUnits="userSpaceOnUse" x="0" y="0" width="1080" height="260">
          <rect fill="white" width="1080" height="260" />
          <path d={DS_TEXT} fill="black" />
        </mask>
      </defs>

      {/* "Cortex" — outlined text (mask hides interior, showing only outside stroke) */}
      <path
        d={CORTEX_TEXT}
        fill={fillValue}
        stroke={fillValue}
        strokeWidth="8"
        strokeLinejoin="round"
        mask={`url(#${maskCortexId})`}
      />

      {/* "DS" — solid fill */}
      <path d={DS_TEXT} fill={fillValue} />

      {/* "DS" — outside outline (same mask technique) */}
      <path
        d={DS_TEXT}
        fill={fillValue}
        stroke={fillValue}
        strokeWidth="8"
        strokeLinejoin="round"
        mask={`url(#${maskDsId})`}
      />
    </svg>
  );
}

/* ── Combined Logo ───────────────────────────────────────── */

export function Logo({
  color,
  size = 'medium',
  showPoweredBy = false,
  className,
  style,
}: LogoProps) {
  const { mainSize, poweredHeight } = sizeConfig[size];

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        ...style,
      }}
    >
      <CarbonLogo size={mainSize} color={color} />
      {showPoweredBy && (
        <>
          <span
            style={{
              fontSize: 12,
              lineHeight: 1,
              color: 'var(--logo-powered-by-color, #6f6f6f)',
              fontFamily: 'var(--carbon-font-family, inherit)',
            }}
          >
            Powered by
          </span>
          <CortexLogo height={poweredHeight} color={color} />
        </>
      )}
    </div>
  );
}

export default Logo;
