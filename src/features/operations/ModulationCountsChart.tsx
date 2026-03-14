interface ModulationCountsChartProps {
  title: string;
  counts: Record<string, number> | undefined;
}

interface ModulationEntry {
  key: string;
  label: string;
  bits: number | null;
  value: number;
  order: number;
}

function toEntries(counts: Record<string, number> | undefined): ModulationEntry[] {
  if (!counts) {
    return [];
  }

  return Object.keys(counts)
    .map((key) => {
      const match = /^qam[_-]?(\d+)$/i.exec(String(key));
      const qamOrder = match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
      const bits = match && qamOrder > 0 ? Math.round(Math.log2(qamOrder)) : null;

      return {
        key,
        label: match ? `QAM ${match[1]}` : key,
        bits,
        order: qamOrder,
        value: Number(counts[key] ?? 0),
      };
    })
    .sort((left, right) => {
      if (left.order !== right.order) {
        return left.order - right.order;
      }
      return left.key.localeCompare(right.key);
    });
}

export function ModulationCountsChart({ title, counts }: ModulationCountsChartProps) {
  const entries = toEntries(counts);

  if (!entries.length) {
    return null;
  }

  const width = 1100;
  const height = 300;
  const left = 44;
  const top = 16;
  const usableWidth = width - 64;
  const usableHeight = height - 48;
  const maxValue = Math.max(...entries.map((entry) => entry.value), 1);
  const yMax = Math.ceil(maxValue / 100) * 100 || maxValue;
  const yTicks = 4;
  const points = entries.map((entry, index) => {
    const x = left + (usableWidth / Math.max(entries.length, 1)) * (index + 0.5);
    const y = top + usableHeight - (entry.value / yMax) * usableHeight;
    return { x, y, entry };
  });
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");

  return (
    <div className="chart-frame">
      <div className="chart-header">
        <div className="chart-title">{title}</div>
      </div>
      <svg className="chart-svg chart-svg-short" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label={title}>
        {Array.from({ length: yTicks + 1 }, (_, index) => {
          const value = (yMax / yTicks) * index;
          const y = top + usableHeight - (value / yMax) * usableHeight;
          return (
            <g key={`y-${value}`}>
              <line x1={left} y1={y} x2={width - 20} y2={y} stroke="rgba(255,255,255,0.10)" />
              <text x="8" y={y + 4} fill="#9eb0c9" fontSize="11">
                {Math.round(value)}
              </text>
            </g>
          );
        })}
        <line x1={left} y1={height - 32} x2={width - 20} y2={height - 32} stroke="rgba(255,255,255,0.20)" />
        <line x1={left} y1={top} x2={left} y2={height - 32} stroke="rgba(255,255,255,0.20)" />

        <path d={path} fill="none" stroke="#58d0a7" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((point) => (
          <g key={point.entry.key}>
            <circle cx={point.x} cy={point.y} r="2.2" fill="#58d0a7" />
            <text
              x={point.x - 20}
              y={height - 10}
              fill="#9eb0c9"
              fontSize="10"
              transform={`rotate(45 ${point.x - 20} ${height - 10})`}
            >
              {point.entry.label}
            </text>
          </g>
        ))}

        <text x={width / 2 - 70} y={height - 2} fill="#9eb0c9" fontSize="11">
          Modulation (QAM / bit-sym)
        </text>
        <text x="10" y="12" fill="#9eb0c9" fontSize="11">
          Carrier Count
        </text>
      </svg>
    </div>
  );
}
