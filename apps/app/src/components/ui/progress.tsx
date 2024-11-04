"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import * as ProgressPrimitive from "@radix-ui/react-progress";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full border-[#192D59]",
      className,
    )}
    style={{
      background: `linear-gradient(to bottom, #0B1938 50%, #0A132A 50%)`,
      borderWidth: "3px",
    }}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 transition-all"
      style={{
        background: `linear-gradient(to bottom, #FF5A39 50%, #E83D21 50%)`,
        transform: `translateX(-${100 - (value ?? 0)}%)`,
      }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
