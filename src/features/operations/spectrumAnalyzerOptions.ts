export interface SpectrumAnalyzerOption {
  value: number;
  label: string;
}

export const spectrumAnalyzerWindowFunctionOptions: SpectrumAnalyzerOption[] = [
  { value: 0, label: "Other" },
  { value: 1, label: "Hann" },
  { value: 2, label: "Blackman Harris" },
  { value: 3, label: "Rectangular" },
  { value: 4, label: "Hamming" },
  { value: 5, label: "Flat Top" },
  { value: 6, label: "Gaussian" },
  { value: 7, label: "Chebyshev" },
];

export const spectrumAnalyzerRetrievalTypeOptions: SpectrumAnalyzerOption[] = [
  { value: 1, label: "PNM File" },
  { value: 2, label: "SNMP" },
];

export const spectrumAnalyzerDirectionOptions = [
  { value: "downstream", label: "Downstream" },
  { value: "upstream", label: "Upstream" },
] as const;

export const defaultSpectrumAnalyzerWindowFunction = 1;
export const defaultSpectrumAnalyzerRetrievalType = 1;
export const defaultSpectrumAnalyzerDirection = "downstream";
export const defaultSpectrumAnalyzerNumberOfAverages = 1;
