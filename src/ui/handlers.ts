import { store } from '../store';
import { PIPE_SPECS } from '../specs';
import { calculateTensions, applySafetyFactor } from '../calc/tensions';
import type { PipeSize, NominalWeight, TorqueUnit, TensionUnit } from '../types';
import {
  el,
  updateWeightDropdown,
  markNotUpToDate,
  markUpToDate
} from './dom';
import { renderChart } from './chart';

/**
 * Handlers for user interactions
 */
export const setupEventHandlers = () => {
  el.pipe.addEventListener('change', () => {
    const pipe = el.pipe.value as PipeSize;
    const firstWeight = updateWeightDropdown(pipe);
    store.setState({ selectedPipe: pipe, selectedWeight: firstWeight });
    markNotUpToDate();
  });

  el.weight.addEventListener('change', () => {
    store.setState({ selectedWeight: JSON.parse(el.weight.value) as NominalWeight });
    markNotUpToDate();
  });

  el.sf.addEventListener('change', () => {
    store.setState({ safetyFactor: Number(el.sf.value) });
    markNotUpToDate();
  });

  el.torqueUnit.addEventListener('change', () => {
    store.setState({ torqueUnit: el.torqueUnit.value as TorqueUnit });
    markNotUpToDate();
  });

  el.tensionUnit.addEventListener('change', () => {
    store.setState({ tensionUnit: el.tensionUnit.value as TensionUnit });
    markNotUpToDate();
  });

  el.calcBtn.addEventListener('click', () => {
    const state = store.getState();
    const { selectedPipe, selectedWeight, safetyFactor, torqueUnit, tensionUnit } = state;

    if (!selectedPipe || !selectedWeight) return;

    const spec = PIPE_SPECS[selectedPipe];
    const results = calculateTensions(spec.od, selectedWeight.wall, spec.yieldPsi);

    const sf = safetyFactor / 100;
    const adjustedResults = results.map(r => ({
      tq: r.tq,
      Tmax: applySafetyFactor(r.Tmax, sf)
    }));

    store.setState({ results: adjustedResults });
    renderChart(results, adjustedResults, torqueUnit, tensionUnit, safetyFactor, el.canvas);
    markUpToDate();
  });
};
