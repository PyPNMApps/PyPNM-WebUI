interface OFDMAActiveWindowDatum {
  label: string;
  zeroMhz: number;
  startMhz: number;
  endMhz: number;
}

interface OFDMAActiveWindowChartProps {
  title: string;
  values: OFDMAActiveWindowDatum[];
}

export function OFDMAActiveWindowChart({ title, values }: OFDMAActiveWindowChartProps) {
  if (!values.length) {
    return <p className="panel-copy">No OFDMA active window data available.</p>;
  }

  const width = 1100;
  const height = Math.max(220, 80 + values.length * 34);
  const left = 120;
  const top = 20;
  const usableWidth = width - 160;
  const rowHeight = 28;
  const minX = Math.min(...values.map((value) => value.startMhz));
  const maxX = Math.max(...values.map((value) => value.endMhz));

  return (
    <div className="chart-frame">
      <div className="chart-header">
        <div className="chart-title">{title}</div>
      </div>
      <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label={title}>
        {values.map((value, index) => {
          const y = top + index * rowHeight + 8;
          const zeroX = left + ((value.zeroMhz - minX) / (maxX - minX || 1)) * usableWidth;
          const x = left + ((value.startMhz - minX) / (maxX - minX || 1)) * usableWidth;
          const w = ((value.endMhz - value.startMhz) / (maxX - minX || 1)) * usableWidth;
          return (
            <g key={value.label}>
              <text x="10" y={y + 12} fill="#9eb0c9" fontSize="11">
                {value.label}
              </text>
              <rect x={left} y={y} width={usableWidth} height="16" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" />
              <line x1={zeroX} y1={y - 4} x2={zeroX} y2={y + 20} stroke="rgba(255, 214, 10, 0.95)" strokeWidth="1.5" strokeDasharray="3 2" />
              <rect x={x} y={y} width={Math.max(w, 4)} height="16" rx="8" fill="rgba(121, 169, 255, 0.45)" stroke="rgba(121, 169, 255, 0.95)" />
              <line x1={x} y1={y - 4} x2={x} y2={y + 20} stroke="rgba(121, 169, 255, 0.95)" strokeWidth="1.5" />
              <line x1={x + Math.max(w, 4)} y1={y - 4} x2={x + Math.max(w, 4)} y2={y + 20} stroke="rgba(121, 169, 255, 0.95)" strokeWidth="1.5" />
              <text x={zeroX} y={y + 30} fill="rgba(255, 214, 10, 0.98)" fontSize="10" textAnchor="middle" fontWeight="700">
                Zero
              </text>
              <text x={x + 2} y={y - 2} fill="#9eb0c9" fontSize="10">
                {value.startMhz.toFixed(3)}
              </text>
              <text x={x + Math.max(w, 4) - 2} y={y - 2} fill="#9eb0c9" fontSize="10" textAnchor="end">
                {value.endMhz.toFixed(3)}
              </text>
            </g>
          );
        })}
        <text x={left} y={height - 8} fill="#9eb0c9" fontSize="11">
          {minX.toFixed(3)} MHz
        </text>
        <text x={width - 92} y={height - 8} fill="#9eb0c9" fontSize="11">
          {maxX.toFixed(3)} MHz
        </text>
        <g transform={`translate(${width - 230}, ${height - 34})`}>
          <rect x="0" y="-14" width="210" height="24" rx="8" fill="rgba(10,20,32,0.78)" stroke="rgba(255,255,255,0.08)" />
          <line x1="12" y1="-2" x2="12" y2="10" stroke="rgba(255, 214, 10, 0.95)" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="22" y="7" fill="#9eb0c9" fontSize="10">
            Zero = subcarrier zero frequency
          </text>
        </g>
      </svg>
    </div>
  );
}
