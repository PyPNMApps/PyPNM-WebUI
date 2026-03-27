import type { SpectrumSelectionRange } from "@/lib/spectrumPower";
import { selectionToZoomDomain } from "@/lib/spectrumZoom";

export function SpectrumSelectionActions({
  selection,
  hasZoomDomain,
  onApplyZoom,
  onResetZoom,
}: {
  selection: SpectrumSelectionRange | null;
  hasZoomDomain: boolean;
  onApplyZoom: (domain: [number, number]) => void;
  onResetZoom: () => void;
}) {
  const normalizedSelection = selectionToZoomDomain(selection);

  return (
    <div className="status-chip-row">
      <button type="button" className="analysis-chip-button" disabled={!normalizedSelection}>
        Integrated Power
      </button>
      <button
        type="button"
        className="analysis-chip-button"
        disabled={!normalizedSelection}
        onClick={() => {
          if (normalizedSelection) {
            onApplyZoom(normalizedSelection);
          }
        }}
      >
        Zoom
      </button>
      <button type="button" className="analysis-chip-button" disabled={!hasZoomDomain} onClick={onResetZoom}>
        Reset Zoom
      </button>
    </div>
  );
}
