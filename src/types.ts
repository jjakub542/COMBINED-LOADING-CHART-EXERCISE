export type PipeSize = '4"' | '5"' | '5 7/8"';

export interface NominalWeight {
  wall: number; // inches
  weight: number; // lb/ft
}

export interface PipeSpec {
  od: number; // outer diameter in inches
  yieldPsi: number; // yield strength in PSI
  weights: NominalWeight[];
}

export type PipeSpecs = Record<PipeSize, PipeSpec>;

export type TensionPoint = {
  tq: number; // torque in ft-lb
  Tmax: number; // max tension in lbf
};

// UI unit selections
export type TorqueUnit = 'kftlb' | 'kNm';
export type TensionUnit = 'klb' | 'mT';
