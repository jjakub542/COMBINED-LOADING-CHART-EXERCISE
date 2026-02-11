import type { PipeSize, NominalWeight, TensionPoint, TorqueUnit, TensionUnit } from './types';

export interface AppState {
  selectedPipe?: PipeSize;
  selectedWeight?: NominalWeight;
  results: TensionPoint[];
  safetyFactor: number; // percent: 0-90
  torqueUnit: TorqueUnit;
  tensionUnit: TensionUnit;
}

const initialState: AppState = {
  selectedPipe: undefined,
  selectedWeight: undefined,
  results: [],
  safetyFactor: 20,
  torqueUnit: 'kftlb',
  tensionUnit: 'klb'
};

type Listener = (state: AppState, prevState: AppState) => void;

const mergeState = (current: AppState, patch: Partial<AppState>): AppState => ({
  ...current,
  ...patch
});

class Store {
  private state: AppState = initialState;
  private listeners: Listener[] = [];

  getState(): AppState {
    return { ...this.state };
  }

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  setState(patch: Partial<AppState>): void {
    const prevState = { ...this.state };
    this.state = mergeState(this.state, patch);
    this.listeners.forEach(l => l(this.state, prevState));
  }
}

export const store = new Store();
