export interface IFlatGauge {
  colorCode: string;
  value: number;
  height?: string;
}

export interface IDynamicGaugeSVGProps {
  colorCode: string;
  value: number;
  confidence_value?: number | null;
  height?: number;
  width?: number | string;
  className?: string;
}
