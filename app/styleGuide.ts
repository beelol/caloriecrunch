// Central style guide / design system for the CalorieCrunch app.
// Light + Dark tokens, type-safe helpers, and variant utilities.
// Usage example (in a component):
//   import { useThemedStyles, spacing, typography, colors } from "@/app/styleGuide";
//   const useStyles = useThemedStyles(t => ({
//     container: { flex: 1, padding: spacing(4), backgroundColor: t.colors.background },
//     title: typography.heading.lg,
//     primaryText: { ...typography.text.md, color: t.colors.text.primary },
//     button: t.components.button.variants.filled.primary,
//   }));
//   ... inside component ... const styles = useStyles();

import { ImageStyle, StyleSheet, TextStyle, useColorScheme, ViewStyle } from "react-native";

// ---- Types ----
export type ColorScale = {
  50: string; 100: string; 200: string; 300: string; 400: string; 500: string;
  600: string; 700: string; 800: string; 900: string; 950: string;
};

export interface ThemeColors {
  primary: ColorScale & { foreground: string }; // brand color + foreground text
  secondary: ColorScale & { foreground: string };
  success: ColorScale & { foreground: string };
  warning: ColorScale & { foreground: string };
  danger: ColorScale & { foreground: string };
  info: ColorScale & { foreground: string };
  neutral: ColorScale;
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  overlay: string;
  focus: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverted: string;
    link: string;
  };
  gradient: {
    primary: [string, string];
  };
}

export interface TypographyScale {
  fontFamily: string;
  text: Record<
    | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl",
    TextStyle
  >;
  heading: Record<"sm" | "md" | "lg" | "xl" | "2xl", TextStyle>;
  monospace: TextStyle;
}

export interface ComponentVariants {
  button: {
    base: ViewStyle & { label: TextStyle };
    sizes: Record<"sm" | "md" | "lg", { container: ViewStyle; label: TextStyle }>;
    variants: Record<
      "filled" | "outline" | "ghost",
      Record<
        "primary" | "secondary" | "danger" | "success" | "neutral",
        ViewStyle & { label: TextStyle }
      >
    >;
  };
  card: {
    base: ViewStyle;
    elevated: ViewStyle;
    outlined: ViewStyle;
  };
  badge: {
    base: ViewStyle & { label: TextStyle };
    tones: Record<
      "primary" | "secondary" | "success" | "warning" | "danger" | "info",
      ViewStyle & { label: TextStyle }
    >;
  };
}

export interface Theme {
  scheme: "light" | "dark";
  colors: ThemeColors;
  spacingScale: number[]; // raw scale
  radii: Record<"none" | "xs" | "sm" | "md" | "lg" | "xl" | "pill" | "full", number>;
  elevation: Record<"none" | "xs" | "sm" | "md" | "lg" | "xl", ViewStyle>;
  opacity: Record<"disabled" | "muted" | "overlay" | "transparent", number>;
  zIndex: Record<"base" | "dropdown" | "modal" | "toast" | "tooltip", number>;
  typography: TypographyScale;
  components: ComponentVariants;
  // helpers
  space: (n: number) => number;
  hairlineWidth: number;
}

// ---- Base Tokens (scheme agnostic) ----
const spacingScale = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72];
export const spacing = (n: number) => spacingScale[n] ?? n; // raw fallback

const radii = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 24,
  full: 9999,
} as const;

const elevationShadows = (c: string): Theme["elevation"] => ({
  none: {},
  xs: { shadowColor: c, shadowOpacity: 0.08, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  sm: { shadowColor: c, shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  md: { shadowColor: c, shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  lg: { shadowColor: c, shadowOpacity: 0.16, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  xl: { shadowColor: c, shadowOpacity: 0.2, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 10 },
});

// Build typography with adaptive text color for readability on both schemes.
const buildTypography = (c: ThemeColors): TypographyScale => ({
  fontFamily: "SpaceMono",
  text: {
    xs: { fontSize: 12, lineHeight: 16, fontFamily: "SpaceMono", color: c.text.primary },
    sm: { fontSize: 14, lineHeight: 18, fontFamily: "SpaceMono", color: c.text.primary },
    md: { fontSize: 16, lineHeight: 22, fontFamily: "SpaceMono", color: c.text.primary },
    lg: { fontSize: 20, lineHeight: 26, fontFamily: "SpaceMono", color: c.text.primary },
    xl: { fontSize: 24, lineHeight: 30, fontFamily: "SpaceMono", color: c.text.primary },
    "2xl": { fontSize: 30, lineHeight: 36, fontFamily: "SpaceMono", color: c.text.primary },
    "3xl": { fontSize: 36, lineHeight: 44, fontFamily: "SpaceMono", color: c.text.primary },
  },
  heading: {
    sm: { fontSize: 18, lineHeight: 24, fontWeight: "600", fontFamily: "SpaceMono", color: c.text.primary },
    md: { fontSize: 22, lineHeight: 28, fontWeight: "600", fontFamily: "SpaceMono", color: c.text.primary },
    lg: { fontSize: 26, lineHeight: 32, fontWeight: "700", fontFamily: "SpaceMono", color: c.text.primary },
    xl: { fontSize: 32, lineHeight: 38, fontWeight: "700", fontFamily: "SpaceMono", color: c.text.primary },
    "2xl": { fontSize: 40, lineHeight: 48, fontWeight: "800", fontFamily: "SpaceMono", color: c.text.primary },
  },
  monospace: { fontFamily: "SpaceMono", color: c.text.primary },
});

// Helper to build a color scale from a base hue. (Simple static manual scale here.)
const makeScale = (scale: Partial<ColorScale> & { 500: string }): ColorScale => ({
  50: scale[50] ?? scale[100] ?? scale[500],
  100: scale[100] ?? scale[200] ?? scale[500],
  200: scale[200] ?? scale[300] ?? scale[500],
  300: scale[300] ?? scale[400] ?? scale[500],
  400: scale[400] ?? scale[500],
  500: scale[500],
  600: scale[600] ?? scale[500],
  700: scale[700] ?? scale[600] ?? scale[500],
  800: scale[800] ?? scale[700] ?? scale[500],
  900: scale[900] ?? scale[800] ?? scale[500],
  950: scale[950] ?? scale[900] ?? scale[500],
});

// ---- Color Schemes ----
const lightColors: ThemeColors = {
  primary: { ...makeScale({ 50: "#eef6ff", 100: "#d9ecff", 200: "#b3d9ff", 300: "#84c2ff", 400: "#4fa6ff", 500: "#1d87ff", 600: "#006be6", 700: "#0055b4", 800: "#004086", 900: "#002e60", 950: "#001a36" }), foreground: "#ffffff" },
  secondary: { ...makeScale({ 50: "#f5f5ff", 100: "#ebebff", 200: "#d6d6ff", 300: "#b3b3ff", 400: "#8a8aff", 500: "#6262ff", 600: "#4d4dd6", 700: "#3a3aaa", 800: "#29297a", 900: "#1a1a52", 950: "#0f0f33" }), foreground: "#ffffff" },
  success: { ...makeScale({ 50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b", 950: "#022c22" }), foreground: "#ffffff" },
  warning: { ...makeScale({ 50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d", 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309", 800: "#92400e", 900: "#78350f", 950: "#451a03" }), foreground: "#000000" },
  danger: { ...makeScale({ 50: "#fef2f2", 100: "#fee2e2", 200: "#fecaca", 300: "#fca5a5", 400: "#f87171", 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c", 800: "#991b1b", 900: "#7f1d1d", 950: "#450a0a" }), foreground: "#ffffff" },
  info: { ...makeScale({ 50: "#f0f9ff", 100: "#e0f2fe", 200: "#bae6fd", 300: "#7dd3fc", 400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1", 800: "#075985", 900: "#0c4a6e", 950: "#082f49" }), foreground: "#ffffff" },
  neutral: makeScale({ 50: "#fafafa", 100: "#f5f5f5", 200: "#e5e5e5", 300: "#d4d4d4", 400: "#a3a3a3", 500: "#737373", 600: "#525252", 700: "#404040", 800: "#262626", 900: "#171717", 950: "#0a0a0a" }),
  background: "#ffffff",
  surface: "#ffffff",
  surfaceAlt: "#f5f7fa",
  border: "#e2e8f0",
  overlay: "rgba(0,0,0,0.4)",
  focus: "#1d87ff",
  text: {
    primary: "#111827",
    secondary: "#374151",
    muted: "#6b7280",
    inverted: "#ffffff",
    link: "#1d87ff",
  },
  gradient: { primary: ["#1d87ff", "#6262ff"] },
};

const darkColors: ThemeColors = {
  primary: { ...makeScale({ 50: "#0f1b2a", 100: "#132338", 200: "#17304c", 300: "#1d3f62", 400: "#215079", 500: "#1d87ff", 600: "#5aa6ff", 700: "#8ac1ff", 800: "#bbdcff", 900: "#e1f2ff", 950: "#f2f9ff" }), foreground: "#ffffff" },
  secondary: { ...makeScale({ 50: "#161629", 100: "#1f1f38", 200: "#27274a", 300: "#2f2f5d", 400: "#3f3f79", 500: "#6262ff", 600: "#8a8aff", 700: "#b3b3ff", 800: "#d6d6ff", 900: "#ebebff", 950: "#f5f5ff" }), foreground: "#ffffff" },
  success: { ...makeScale({ 50: "#082c24", 100: "#0f3d32", 200: "#115445", 300: "#0d6b58", 400: "#0a866d", 500: "#10b981", 600: "#34d399", 700: "#6ee7b7", 800: "#a7f3d0", 900: "#d1fae5", 950: "#ecfdf5" }), foreground: "#ffffff" },
  warning: { ...makeScale({ 50: "#341a04", 100: "#4a2607", 200: "#67340b", 300: "#85410e", 400: "#a35313", 500: "#f59e0b", 600: "#fbbf24", 700: "#fcd34d", 800: "#fde68a", 900: "#fef3c7", 950: "#fffbeb" }), foreground: "#000000" },
  danger: { ...makeScale({ 50: "#2d0b0b", 100: "#430f0f", 200: "#5c1414", 300: "#771919", 400: "#9a2020", 500: "#ef4444", 600: "#f87171", 700: "#fca5a5", 800: "#fecaca", 900: "#fee2e2", 950: "#fef2f2" }), foreground: "#ffffff" },
  info: { ...makeScale({ 50: "#082133", 100: "#0c314b", 200: "#0e4060", 300: "#115074", 400: "#13618a", 500: "#0ea5e9", 600: "#38bdf8", 700: "#7dd3fc", 800: "#bae6fd", 900: "#e0f2fe", 950: "#f0f9ff" }), foreground: "#ffffff" },
  neutral: makeScale({ 50: "#0a0a0a", 100: "#171717", 200: "#262626", 300: "#404040", 400: "#525252", 500: "#737373", 600: "#a3a3a3", 700: "#d4d4d4", 800: "#e5e5e5", 900: "#f5f5f5", 950: "#fafafa" }),
  background: "#0c1117",
  surface: "#161b22",
  surfaceAlt: "#1e2530",
  border: "#2d3742",
  overlay: "rgba(0,0,0,0.5)",
  focus: "#1d87ff",
  text: {
    primary: "#f1f5f9",
    secondary: "#cbd5e1",
    muted: "#94a3b8",
    inverted: "#0c1117",
    link: "#62b0ff",
  },
  gradient: { primary: ["#1d87ff", "#6262ff"] },
};

// ---- Component Variant Builders ----
const buildComponentVariants = (c: ThemeColors, typography: TypographyScale): ComponentVariants => ({
  button: {
    base: {
      borderRadius: radii.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing(2),
      paddingHorizontal: spacing(4),
      label: { ...typography.text.md, fontWeight: "600" },
    },
    sizes: {
      sm: { container: { paddingVertical: spacing(1), paddingHorizontal: spacing(3) }, label: { fontSize: 14 } },
      md: { container: { paddingVertical: spacing(2), paddingHorizontal: spacing(4) }, label: { fontSize: 16 } },
      lg: { container: { paddingVertical: spacing(3), paddingHorizontal: spacing(5) }, label: { fontSize: 18 } },
    },
    variants: {
      filled: {
        primary: { backgroundColor: c.primary[500], label: { color: c.primary.foreground } },
        secondary: { backgroundColor: c.secondary[500], label: { color: c.secondary.foreground } },
        danger: { backgroundColor: c.danger[500], label: { color: c.danger.foreground } },
        success: { backgroundColor: c.success[500], label: { color: c.success.foreground } },
        neutral: { backgroundColor: c.neutral[300], label: { color: c.text.primary } },
      },
      outline: {
        primary: { borderWidth: 1, borderColor: c.primary[500], backgroundColor: "transparent", label: { color: c.primary[500] } },
        secondary: { borderWidth: 1, borderColor: c.secondary[500], backgroundColor: "transparent", label: { color: c.secondary[500] } },
        danger: { borderWidth: 1, borderColor: c.danger[500], backgroundColor: "transparent", label: { color: c.danger[500] } },
        success: { borderWidth: 1, borderColor: c.success[500], backgroundColor: "transparent", label: { color: c.success[500] } },
        neutral: { borderWidth: 1, borderColor: c.neutral[400], backgroundColor: "transparent", label: { color: c.text.primary } },
      },
      ghost: {
        primary: { backgroundColor: "transparent", label: { color: c.primary[500] } },
        secondary: { backgroundColor: "transparent", label: { color: c.secondary[500] } },
        danger: { backgroundColor: "transparent", label: { color: c.danger[500] } },
        success: { backgroundColor: "transparent", label: { color: c.success[500] } },
        neutral: { backgroundColor: "transparent", label: { color: c.text.primary } },
      },
    },
  },
  card: {
    base: {
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      padding: spacing(4),
    },
    elevated: {
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      padding: spacing(4),
      ...elevationShadows(c.neutral[900]).sm,
    },
    outlined: {
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      padding: spacing(4),
      borderWidth: 1,
      borderColor: c.border,
    },
  },
  badge: {
    base: { borderRadius: radii.pill, paddingHorizontal: spacing(2), paddingVertical: spacing(1), label: { ...typography.text.xs, fontWeight: "600" } },
    tones: {
      primary: { backgroundColor: c.primary[500], label: { color: c.primary.foreground } },
      secondary: { backgroundColor: c.secondary[500], label: { color: c.secondary.foreground } },
      success: { backgroundColor: c.success[500], label: { color: c.success.foreground } },
      warning: { backgroundColor: c.warning[400], label: { color: c.warning.foreground } },
      danger: { backgroundColor: c.danger[500], label: { color: c.danger.foreground } },
      info: { backgroundColor: c.info[500], label: { color: c.info.foreground } },
    },
  },
});

// ---- Theme Factory ----
export function makeTheme(scheme: "light" | "dark"): Theme {
  const colors = scheme === "light" ? lightColors : darkColors;
  const elevation = elevationShadows(scheme === "light" ? colors.neutral[900] : colors.neutral[900]);
  const typography = buildTypography(colors);
  return {
    scheme,
    colors,
    spacingScale,
    radii,
    elevation,
    opacity: {
      disabled: 0.4,
      muted: 0.7,
      overlay: 0.5,
      transparent: 0,
    },
    zIndex: { base: 0, dropdown: 10, modal: 100, toast: 200, tooltip: 300 },
    typography,
    components: buildComponentVariants(colors, typography),
    space: spacing,
    hairlineWidth: 1 / 3,
  };
}

// Default (light) export for non-hook usage
export const themeLight = makeTheme("light");
export const themeDark = makeTheme("dark");

// ---- Hooks & Utilities ----
export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === "dark" ? themeDark : themeLight;
}

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

// create a themed styles hook with memoization
export function useThemedStyles<T extends NamedStyles<T> | NamedStyles<any>>(factory: (t: Theme) => T): () => T {
  const t = useTheme();
  // naive memoization: regenerate each render; for heavy styles consider useMemo.
  return () => StyleSheet.create(factory(t));
}

// Direct token re-exports (functional style)
export const colors = themeLight.colors; // prefer useTheme for dynamic switching
export const typographyTokens = themeLight.typography;
// spacing already exported above

// ---- Helper Functions ----
export function contrastText(bg: string): string {
  // Simple relative luminance heuristic
  const hex = bg.replace('#', '');
  if (hex.length === 3) {
    const [r,g,b] = hex.split('').map(c => parseInt(c + c, 16));
    const l = 0.299*r + 0.587*g + 0.114*b;
    return l > 140 ? '#000000' : '#ffffff';
  }
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0,2),16);
    const g = parseInt(hex.substring(2,4),16);
    const b = parseInt(hex.substring(4,6),16);
    const l = 0.299*r + 0.587*g + 0.114*b;
    return l > 140 ? '#000000' : '#ffffff';
  }
  return '#ffffff';
}

// Build a linear gradient spec (e.g., for expo-linear-gradient) from theme
export function primaryGradient(t: Theme) {
  return { colors: t.colors.gradient.primary, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };
}

// ---- Example Derived Utility Styles (optional) ----
export const utility = {
  flexCenter: { justifyContent: 'center', alignItems: 'center' } as ViewStyle,
  screen: (t: Theme): ViewStyle => ({ flex: 1, backgroundColor: t.colors.background }),
};

// ---- Accessibility Guidance (comments only) ----
// - Ensure interactive elements have min touch area of spacing(6) (~48px) square.
// - Maintain contrast ratio ~4.5:1 for body text over background; use contrastText helper when dynamic.
// - Avoid using color alone to convey state (combine with iconography or text).
// - Reserve red solely for destructive or error actions; success states use green scale.

// ---- Future Extensions ----
// - Add dynamic font scaling via react-native's AccessibilityInfo.
// - Add motion tokens for animation durations/easings.
// - Integrate with a context provider for runtime theming overrides.

export default themeLight;
