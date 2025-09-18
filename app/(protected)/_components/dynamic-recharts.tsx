/* eslint-disable @typescript-eslint/no-explicit-any */
// components/DynamicRecharts.tsx
import dynamic from "next/dynamic";
import type {
  BarProps,
  XAxisProps,
  YAxisProps,
  CartesianGridProps,
  TooltipProps,
  ResponsiveContainerProps,
  CellProps,
  AreaProps,
  LineProps,
  DotProps,
  LabelProps,
  ReferenceLineProps
} from "recharts";

// Each dynamic import disables SSR to save memory during build
export const ResponsiveContainer = dynamic<ResponsiveContainerProps>(
  () =>
    import("recharts").then(
      (mod) =>
        mod.ResponsiveContainer as React.ComponentType<ResponsiveContainerProps>
    ),
  { ssr: false }
);

export const BarChart = dynamic(
  () =>
    import("recharts").then((mod) => mod.BarChart as React.ComponentType<any>),
  { ssr: false }
);

export const Bar = dynamic<BarProps>(
  () =>
    import("recharts").then((mod) => mod.Bar as React.ComponentType<BarProps>),
  { ssr: false }
);

export const XAxis = dynamic<XAxisProps>(
  () =>
    import("recharts").then(
      (mod) => mod.XAxis as React.ComponentType<XAxisProps>
    ),
  { ssr: false }
);

export const YAxis = dynamic<YAxisProps>(
  () =>
    import("recharts").then(
      (mod) => mod.YAxis as React.ComponentType<YAxisProps>
    ),
  { ssr: false }
);

export const CartesianGrid = dynamic<CartesianGridProps>(
  () =>
    import("recharts").then(
      (mod) => mod.CartesianGrid as React.ComponentType<CartesianGridProps>
    ),
  { ssr: false }
);

export const Tooltip = dynamic<TooltipProps<any, any>>(
  () =>
    import("recharts").then(
      (mod) => mod.Tooltip as React.ComponentType<TooltipProps<any, any>>
    ),
  { ssr: false }
);

export const Cell = dynamic<CellProps>(
  () =>
    import("recharts").then(
      (mod) => mod.Cell as React.ComponentType<CellProps>
    ),
  { ssr: false }
);

// ✅ Area chart
export const Area = dynamic<AreaProps>(
  () =>
    import("recharts").then(
      (mod) => mod.Area as React.ComponentType<AreaProps>
    ),
  { ssr: false }
);

// ✅ Line chart components
export const LineChart = dynamic(
  () =>
    import("recharts").then((mod) => mod.LineChart as React.ComponentType<any>),
  { ssr: false }
);

export const Line = dynamic<LineProps>(
  () =>
    import("recharts").then(
      (mod) => mod.Line as React.ComponentType<LineProps>
    ),
  { ssr: false }
);

// (optional custom dots via DotProps typing)
export type { DotProps };

// ✅ ReferenceLine
export const ReferenceLine = dynamic<ReferenceLineProps>(
  () =>
    import("recharts").then(
      (mod) => mod.ReferenceLine as React.ComponentType<ReferenceLineProps>
    ),
  { ssr: false }
);

// ✅ Label
export const Label = dynamic<LabelProps>(
  () =>
    import("recharts").then(
      (mod) => mod.Label as React.ComponentType<LabelProps>
    ),
  { ssr: false }
);
