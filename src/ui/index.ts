import { store } from '../store';
import type { PipeSize } from '../types';
import {
  el,
  initializePipeDropdown,
  updateWeightDropdown,
  initializeSafetyFactorDropdown,
  markNotUpToDate
} from './dom';
import { setupEventHandlers } from './handlers';

export const initializeUI = () => {
  initializePipeDropdown();
  initializeSafetyFactorDropdown();

  // Set initial state
  const state = store.getState();
  el.pipe.selectedIndex = 0;
  const firstPipe = el.pipe.value as PipeSize;
  const firstWeight = updateWeightDropdown(firstPipe);

  store.setState({
    selectedPipe: firstPipe,
    selectedWeight: firstWeight
  });

  // Set UI to match store state
  el.sf.value = String(state.safetyFactor);
  el.torqueUnit.value = state.torqueUnit;
  el.tensionUnit.value = state.tensionUnit;

  setupEventHandlers();
  markNotUpToDate();
};

export { el, updateWeightDropdown, markNotUpToDate, markUpToDate } from './dom';
