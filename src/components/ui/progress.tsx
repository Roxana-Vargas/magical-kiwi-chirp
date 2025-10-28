import * as React from "react";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  className?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`relative w-full bg-gray-700 rounded-full overflow-hidden ${className}`}
      {...props}
    >
      <div
        className="h-full bg-[#38BDF8] transition-all duration-500"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          height: "100%",
        }}
      />
    </div>
  )
);
Progress.displayName = "Progress";