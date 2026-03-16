import type { ChartPoint, ChartSeries } from "@/features/analysis/types";

interface LineAnalysisChartProps {
  title: string;
  subtitle: string;
  yLabel: string;
  series: ChartSeries[];
  showLegend?: boolean;
  yPadding?: number;
  xDomain?: [number, number];
  yDomain?: [number, number];
}

function axisLabels(minValue: number, maxValue: number, count: number): number[] {
  const labels: number[] = [];
  const span = maxValue - minValue || 1;

  for (let index = 0; index <= count; index += 1) {
    labels.push(minValue + (span * index) / count);
  }

  return labels;
}

function buildPath(
  points: ChartPoint[],
  width: number,
  height: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
): string {
  const usableWidth = width - 64;
  const usableHeight = height - 44;
  const left = 44;
  const top = 16;

  return points
    .map((point: ChartPoint, index: number) => {
      const x = left + ((point.x - xMin) / (xMax - xMin || 1)) * usableWidth;
      const y = top + usableHeight - ((point.y - yMin) / (yMax - yMin || 1)) * usableHeight;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export function LineAnalysisChart({
  title,
  subtitle,
  yLabel,
  series,
  showLegend = true,
  yPadding = 0.35,
  xDomain,
  yDomain,
}: LineAnalysisChartProps) {
  const width = 1100;
  const height = 320;
  const allPoints = series.flatMap((item) => item.points);
  if (!allPoints.length) {
    return (
      <div className="chart-frame">
        <div className="chart-header">
          <div>
            <div className="chart-title">{title}</div>
            <div className="chart-meta">{subtitle}</div>
          </div>
        </div>
        <div className="panel-copy">No chart data available.</div>
      </div>
    );
  }
  const xValues = allPoints.map((point) => point.x);
  const yValues = allPoints.map((point) => point.y);
  const xMin = xDomain?.[0] ?? Math.min(...xValues);
  const xMax = xDomain?.[1] ?? Math.max(...xValues);
  const yMin = yDomain?.[0] ?? (Math.min(...yValues) - yPadding);
  const yMax = yDomain?.[1] ?? (Math.max(...yValues) + yPadding);
  const yTicks = axisLabels(yMin, yMax, 4);
  const xTicks = axisLabels(xMin, xMax, 6);

  return (
    <div className="chart-frame">
      <div className="chart-header">
        <div>
          <div className="chart-title">{title}</div>
          <div className="chart-meta">{subtitle}</div>
        </div>
        {showLegend ? (
          <div className="status-chip-row">
            {series.map((item) => (
              <span key={item.label} className="analysis-chip">
                <span className="analysis-swatch" style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label={title}>
        {yTicks.map((value) => {
          const y = 16 + (height - 44) - ((value - yMin) / (yMax - yMin || 1)) * (height - 44);
          return (
            <g key={`y-${value}`}>
              <line x1="44" y1={y} x2={width - 20} y2={y} stroke="rgba(255,255,255,0.10)" />
              <text x="8" y={y + 4} fill="#9eb0c9" fontSize="11">
                {value.toFixed(1)}
              </text>
            </g>
          );
        })}
        {xTicks.map((value) => {
          const x = 44 + ((value - xMin) / (xMax - xMin || 1)) * (width - 64);
          return (
            <g key={`x-${value}`}>
              <line x1={x} y1="16" x2={x} y2={height - 28} stroke="rgba(255,255,255,0.07)" />
              <text x={x - 10} y={height - 8} fill="#9eb0c9" fontSize="11">
                {Math.round(value)}
              </text>
            </g>
          );
        })}
        <line x1="44" y1={height - 28} x2={width - 20} y2={height - 28} stroke="rgba(255,255,255,0.20)" />
        <line x1="44" y1="16" x2="44" y2={height - 28} stroke="rgba(255,255,255,0.20)" />
        {series.map((item) => (
          <path
            key={item.label}
            d={buildPath(item.points, width, height, xMin, xMax, yMin, yMax)}
            fill="none"
            stroke={item.color}
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        <text x={width / 2 - 18} y={height - 2} fill="#9eb0c9" fontSize="11">
          MHz
        </text>
        <text x="10" y="12" fill="#9eb0c9" fontSize="11">
          {yLabel}
        </text>
      </svg>
    </div>
  );
}
