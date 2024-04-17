import styles from "@/styles/progress.module.css";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export function CircularProgress({
  size = 250,
  progress,
  showPercentage = true,
  className,
}: {
  size: number;
  progress: number;
  showPercentage?: boolean;
  className?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  const halfSize = size / 2;
  const strokeWidth = Math.max(size * 0.08, 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI * 2;
  const dash = (progress * circumference) / 100;
  const fontSize = size / 5;

  useEffect(() => {
    if (!svgRef.current) return;
    const element = svgRef.current;

    element.style.setProperty("--size", `${size}px`);
    element.style.setProperty("--progress", progress.toString());
    element.style.setProperty("--radius", `${radius}px`);
    element.style.setProperty("--circumference", `${circumference}px`);
    element.style.setProperty("--dash", `${dash}px`);
    element.style.setProperty("--half-size", `${halfSize}px`);
    element.style.setProperty("--stroke-width", `${strokeWidth}px`);
  }, [circumference, dash, halfSize, progress, radius, size, strokeWidth]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn(styles.circularProgress, className)}
      style={{
        minWidth: size,
        minHeight: size,
      }}
    >
      <circle
        className={styles.bg}
        cx={halfSize}
        cy={halfSize}
        r={halfSize - strokeWidth}
        strokeWidth={strokeWidth}
      />
      <circle
        className={styles.fg}
        cx={halfSize}
        cy={halfSize}
        r={halfSize - strokeWidth}
        strokeWidth={strokeWidth}
      />
      {showPercentage && (
        <text
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
          fontSize={fontSize}
          className="fill-foreground"
        >
          {`${progress}%`}
        </text>
      )}
    </svg>
  );
}
