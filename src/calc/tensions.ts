/**
  * Calculalte inside diameter from outside diameter and wall thickness.
  * @param od - Outer diameter [in]
  * @param wall - Wall thickness [in]
  * @returns Inside diameter [in]
 */
export const insideDiameter = (od: number, wall: number): number =>
  od - 2 * wall;

/**
 * Calculate cross-sectional area of a hollow circular section.
 * @param od - Outer diameter [in]
 * @param id - Inner diameter [in]
 * @returns Area [in²]
 */
export const area = (od: number, id: number): number =>
  Math.PI * (od ** 2 - id ** 2) / 4;

/**
 * Calculate moment of inertia for a hollow circular section.
 * @param od - Outer diameter [in]
 * @param id - Inner diameter [in]
 * @returns Moment of inertia [in⁴]
 */
export const inertia = (od: number, id: number): number =>
  Math.PI * (od ** 4 - id ** 4) / 32;

/**
 * Calculate torsional stress from torque.
 * @param tq - Torque [ft·lb]
 * @param od - Outer diameter [in]
 * @param I - Moment of inertia [in⁴]
 * @returns Torsional stress [psi]
 */
export const torsionalStress = (tq: number, od: number, I: number): number =>
  (tq * od) / (0.09167 * I);

/**
 * Calculate max allowable tension given torque.
 * @param A - Cross-sectional area [in²]
 * @param yieldPsi - Yield Strength [psi]
 * @param tq - Torque [ft·lb]
 * @param od - Outside diameter [in]
 * @param I - Moment of inertia [in⁴]
 * @returns Maximum allowable tension [lbf], or null if torque exceeds limit
 */
export const maxTension = (
  A: number,
  yieldPsi: number,
  tq: number,
  od: number,
  I: number
): number | null => {
  const tau = torsionalStress(tq, od, I);
  const insideRoot = yieldPsi ** 2 -  tau ** 2;

  if (insideRoot <= 0) return null;

  return A * Math.sqrt(insideRoot);
};

/**
 * Apply safety factor (reduce allowable tension).
 * @param tension - Tension [lbf]
 * @param safetyFactor - Safety factor as decimal (0.2 for 20% SF)
 * @returns Tension with SF applied [lbf], minimum 0
 */
export const applySafetyFactor = (tension: number, safetyFactor: number): number =>
  Math.max(0, tension * (1 - safetyFactor));

/**
 * Generate array of values from start to end with given step.
 * @param start - Starting value
 * @param end - Ending value
 * @param step - Increment step
 * @returns Array of numbers from start to end with given step
 */
export const generateTorqueRange = (start: number, end: number, step: number): number[] => {
  const result: number[] = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
};

/**
 * Calculate tension curve across torque range.
 * @param od - Outer diameter [in]
 * @param wall - Wall thickness [in]
 * @param yieldPsi - Yield Strength [psi]
 * @param step - Torque increment [ft·lb]
 * @param maxTorque - Maximum torque [ft·lb]
 * @returns Array of {tq, Tmax} points for the curve
 */
export const calculateTensions = (
  od: number,
  wall: number,
  yieldPsi: number,
  step = 500,
  maxTorque = 80000
): Array<{ tq: number; Tmax: number }> => {
  const id = insideDiameter(od, wall);
  const A = area(od, id);
  const I = inertia(od, id);

  return generateTorqueRange(0, maxTorque, step)
    .map((tq): { tq: number; Tmax: number } | null => {
      const Tmax = maxTension(A, yieldPsi, tq, od, I);
      return Tmax === null ? null : { tq, Tmax };
    })
    .filter((item): item is { tq: number; Tmax: number } => item !== null);
};
