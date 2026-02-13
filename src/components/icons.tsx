/**
 * Carbon icon wrappers.
 *
 * Every export keeps the original name so that consumer components don't
 * need any import changes.  Under the hood each icon is now an IBM Carbon
 * icon from @carbon/icons-react.
 *
 * The thin `wrapCarbon` helper translates the old SVG-style props
 * (width / height / style) to Carbon's API (size / style) so existing
 * call-sites work unchanged.
 */

import * as React from 'react';
import {
  ChatBot          as _ChatBot,
  Upload           as _Upload,
  Book             as _Book,
  Code             as _Code,
  ColorPalette     as _ColorPalette,
  ChartBar         as _ChartBar,
  Security         as _Security,
  Activity         as _Activity,
  Growth           as _Growth,
  Sun              as _Sun,
  Moon             as _Moon,
  ChevronDown      as _ChevronDown,
  Logout           as _Logout,
  LogoGithub       as _LogoGithub,
  LogoFigma        as _LogoFigma,
  SendAlt          as _SendAlt,
  AiAgentInvocation as _AiAgentInvocation,
  ThumbsUp         as _ThumbsUp,
  ThumbsDown       as _ThumbsDown,
  Calendar         as _Calendar,
  Subtract         as _Subtract,
  WarningAlt       as _WarningAlt,
  CheckmarkOutline as _CheckmarkOutline,
  Chat             as _Chat,
  Time             as _Time,
  UserMultiple     as _UserMultiple,
  Layers           as _Layers,
  Warning          as _Warning,
  MisuseOutline    as _MisuseOutline,
  Image            as _Image,
  Video            as _Video,
  Document         as _Document,
  ArrowUp          as _ArrowUp,
  ArrowDown        as _ArrowDown,
  Repeat           as _Repeat,
  StarFilled       as _StarFilled,
} from '@carbon/icons-react';

/* ------------------------------------------------------------------ */
/*  Wrapper helper                                                     */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CarbonIcon = React.ComponentType<any>;

interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Carbon-native size prop (takes priority over width / height). */
  size?: number | string;
  width?: number | string;
  height?: number | string;
}

/**
 * Creates a thin wrapper around a Carbon icon that accepts the old
 * width / height / style API used throughout the app.
 *
 * - `width` or `height` are forwarded as the Carbon `size` prop.
 * - `style` and `className` are passed through as-is.
 * - An optional `baseStyle` is merged *before* the caller's style so
 *   the caller can still override any property.
 */
function wrapCarbon(Icon: CarbonIcon, baseStyle?: React.CSSProperties) {
  const Wrapped = React.forwardRef<SVGSVGElement, IconProps>(
    ({ width, height, style, size: sizeProp, ...rest }, ref) => {
      const size =
        sizeProp ??
        (typeof width === 'number' || typeof width === 'string' ? width : undefined) ??
        (typeof height === 'number' || typeof height === 'string' ? height : undefined);

      const mergedStyle = baseStyle ? { ...baseStyle, ...style } : style;

      return <Icon ref={ref} size={size} style={mergedStyle} {...rest} />;
    }
  );

  Wrapped.displayName = Icon.displayName ?? 'WrappedCarbonIcon';
  return Wrapped;
}

/* ------------------------------------------------------------------ */
/*  Exported icons (same names as before)                              */
/* ------------------------------------------------------------------ */

// Chat / messaging
export const MessageSquare  = wrapCarbon(_ChatBot);
export const MessageCircle  = wrapCarbon(_Chat);
export const Send           = wrapCarbon(_SendAlt);

// AI / assistant
export const Sparkles       = wrapCarbon(_AiAgentInvocation);

// File / document
export const Upload         = wrapCarbon(_Upload);
export const BookOpen       = wrapCarbon(_Book);
export const FileCode       = wrapCarbon(_Document);
export const FileImage      = wrapCarbon(_Image);

// Code / design
export const Code2          = wrapCarbon(_Code);
export const Palette        = wrapCarbon(_ColorPalette);

// Charts / trends
export const BarChart3      = wrapCarbon(_ChartBar);
export const TrendingUp     = wrapCarbon(_Growth);
export const TrendingDown   = wrapCarbon(_Growth, { transform: 'scaleY(-1)' });

// Status / feedback
export const Activity       = wrapCarbon(_Activity);
export const Shield         = wrapCarbon(_Security);
export const AlertCircle    = wrapCarbon(_WarningAlt);
export const AlertTriangle  = wrapCarbon(_Warning);
export const AlertTriangleFill = wrapCarbon(_Warning);
export const CheckCircle    = wrapCarbon(_CheckmarkOutline);
export const CheckCircle2   = CheckCircle;
export const XCircle        = wrapCarbon(_MisuseOutline);
export const ThumbsUp       = wrapCarbon(_ThumbsUp);
export const ThumbsDown     = wrapCarbon(_ThumbsDown);

// Navigation / UI
export const ChevronDown    = wrapCarbon(_ChevronDown);
export const LogOut         = wrapCarbon(_Logout);
export const Minus          = wrapCarbon(_Subtract);
export const Layers         = wrapCarbon(_Layers);

// Time / calendar
export const Calendar       = wrapCarbon(_Calendar);
export const Clock          = wrapCarbon(_Time);

// People
export const Users          = wrapCarbon(_UserMultiple);

// Theme
export const Sun            = wrapCarbon(_Sun);
export const Moon           = wrapCarbon(_Moon);

// Brand logos
export const Github         = wrapCarbon(_LogoGithub);
export const Figma          = wrapCarbon(_LogoFigma);

// Media
export const Video          = wrapCarbon(_Video);

// Trend arrows
export const ArrowUp        = wrapCarbon(_ArrowUp);
export const ArrowDown      = wrapCarbon(_ArrowDown);
export const Repeat         = wrapCarbon(_Repeat);
export const StarFilled     = wrapCarbon(_StarFilled);
