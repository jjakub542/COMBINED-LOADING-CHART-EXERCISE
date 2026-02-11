import type { TorqueUnit, TensionUnit } from '../types';

/**
 * Convert torque from internal units (ft-lb) to display units.
 * @param ftlb - Torque in foot-pounds
 * @param unit - Target unit ('kftlb' for 1000 ft-lb, 'kNm' for kilonewton-meters)
 * @returns Converted torque value
 */
export const convertTorque = (ftlb: number, unit: TorqueUnit): number =>
  unit === 'kftlb' ? ftlb / 1000 : ftlb / 737.562;

/**
 * Convert tension from internal units (lbf) to display units.
 * @param lbf - Tension in pounds-force
 * @param unit - Target unit ('klb' for 1000 lbf, 'mT' for metric tons)
 * @returns Converted tension value
 */
export const convertTension = (lbf: number, unit: TensionUnit): number =>
  unit === 'klb' ? lbf / 1000 : lbf / 2204.62262;
