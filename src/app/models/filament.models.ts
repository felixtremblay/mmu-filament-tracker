export interface FilamentType {
  id: string;
  brand: string;
  type: string;
  fullName?: string; // Optional as it can be computed
}

export interface FilamentColor {
  id: string;
  filamentTypeId: string;
  filamentType: FilamentType;
  colorName: string;
  color: string; // hex color code
}

export interface PurgeMatrix {
  fromColorId: string;
  toColorId: string;
  purgeVolume: number; // in mm³
}

export interface PurgeMatrixData {
  matrix: PurgeMatrix[];
  colors: FilamentColor[];
}
