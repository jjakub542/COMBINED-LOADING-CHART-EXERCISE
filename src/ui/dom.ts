import type { PipeSize, NominalWeight } from '../types';
import { PIPE_SPECS } from '../specs';

/**
 * DOM element cache for direct access
 */
export const el = {
  pipe: document.getElementById('pipe') as HTMLSelectElement,
  weight: document.getElementById('weight') as HTMLSelectElement,
  sf: document.getElementById('sf') as HTMLSelectElement,
  torqueUnit: document.getElementById('torque-unit') as HTMLSelectElement,
  tensionUnit: document.getElementById('tension-unit') as HTMLSelectElement,
  calcBtn: document.getElementById('calc') as HTMLButtonElement,
  canvas: document.getElementById('chart') as HTMLCanvasElement,
  status: document.getElementById('status') as HTMLElement
};

/**
 * Create an option element for dropdowns
 */
const createOption = (label: string, value: string): HTMLOptionElement => {
  const o = document.createElement('option');
  o.textContent = label;
  o.value = value;
  return o;
};

/**
 * Initialize pipe size dropdown with available options
 */
export const initializePipeDropdown = () => {
  Object.keys(PIPE_SPECS).forEach(p => {
    el.pipe.appendChild(createOption(p, p));
  });
};

/**
 * Update weight dropdown for selected pipe size
 */
export const updateWeightDropdown = (pipe: PipeSize): NominalWeight => {
  el.weight.innerHTML = '';
  const weights = PIPE_SPECS[pipe].weights;
  weights.forEach(w => {
    el.weight.appendChild(createOption(`${w.weight} lb/ft`, JSON.stringify(w)));
  });
  return weights[0];
};

/**
 * Initialize safety factor dropdown (0-90% in 5% increments)
 */
export const initializeSafetyFactorDropdown = () => {
  for (let p = 0; p <= 90; p += 5) {
    el.sf.appendChild(createOption(`${p}`, `${p}`));
  }
};

/**
 * Mark calculations as out of sync with UI
 */
export const markNotUpToDate = () => {
  el.calcBtn.disabled = false;
  el.status.textContent = 'Calculations NOT up to date';
  el.status.className = 'status-notready';
};

/**
 * Mark calculations as current with UI
 */
export const markUpToDate = () => {
  el.calcBtn.disabled = true;
  el.status.textContent = 'Calculations up to date';
  el.status.className = 'status-ready';
};
