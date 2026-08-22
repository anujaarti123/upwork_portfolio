import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
}

function Badge({ className, color, style, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        className
      )}
      style={{
        borderColor: color ? `${color}40` : undefined,
        backgroundColor: color ? `${color}15` : undefined,
        color: color ?? undefined,
        ...style,
      }}
      {...props}
    />
  );
}

export { Badge };
