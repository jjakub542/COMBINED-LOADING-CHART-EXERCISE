import { describe, it, expect } from 'vitest';
import {
  insideDiameter,
  area,
  inertia,
  torsionalStress,
  maxTension,
  applySafetyFactor,
  generateTorqueRange,
  calculateTensions
} from './tensions';

describe('Geometric Calculations', () => {
  describe('insideDiameter', () => {
    it('should calculate correctly for various pipe sizes', () => {
      expect(insideDiameter(5, 0.25)).toBe(4.5);
      expect(insideDiameter(4, 0.213)).toBeCloseTo(3.574, 3);
      expect(insideDiameter(5, 0.258)).toBeCloseTo(4.484, 3);
    });
  });

  describe('area', () => {
    it('should calculate cross-sectional area', () => {
      expect(area(4, 3.574)).toBeCloseTo(2.534, 2);
      expect(area(10, 8)).toBeCloseTo(28.274, 2);
      expect(area(10, 0)).toBeCloseTo(78.54, 1);
    });
  });

  describe('inertia', () => {
    it('should calculate moment of inertia', () => {
      expect(inertia(4, 3.574)).toBeCloseTo(9.114, 2);
      expect(inertia(10, 8)).toBeCloseTo(579.7, 0);
    });

    it('should be zero when diameters are equal', () => {
      expect(inertia(5, 5)).toBe(0);
    });

    it('should increase with larger diameter', () => {
      expect(inertia(6, 5)).toBeGreaterThan(inertia(5, 4));
    });
  });
});

describe('Stress Calculations', () => {
  describe('torsionalStress', () => {
    it('should calculate torsional stress', () => {
      expect(torsionalStress(10000, 4, 9.114)).toBeCloseTo(47876.65, 1);
    });

    it('should be proportional to torque and diameter', () => {
      const tau1 = torsionalStress(5000, 4, 3.886);
      const tau2 = torsionalStress(10000, 4, 3.886);
      expect(tau2).toBeCloseTo(tau1 * 2, 1);
    });

    it('should be inversely proportional to inertia', () => {
      expect(torsionalStress(10000, 4, 3.886)).toBeGreaterThan(
        torsionalStress(10000, 4, 5)
      );
    });
  });

  describe('maxTension', () => {
    it('should calculate max tension given torque', () => {
      const Tmax = maxTension(2.534, 35000, 5000, 4, 9.114);
      expect(Tmax).not.toBeNull();
      expect(Tmax).toBeGreaterThan(0);
    });

    it('should equal A×yield when torque is zero', () => {
      const A = 2.534;
      const yieldPsi = 35000;
      const Tmax = maxTension(A, yieldPsi, 0, 4, 9.114);
      expect(Tmax).toBeCloseTo(A * yieldPsi, 0);
    });

    it('should return null when stress exceeds yield', () => {
      expect(maxTension(2.534, 35000, 1000000, 4, 9.114)).toBeNull();
    });

    it('should decrease as torque increases', () => {
      const T1 = maxTension(2.534, 35000, 5000, 4, 9.114);
      const T2 = maxTension(2.534, 35000, 10000, 4, 9.114);
      if (T1 && T2) expect(T2).toBeLessThan(T1);
    });
  });
});

describe('Safety Factor', () => {
  describe('applySafetyFactor', () => {
    it('should reduce tension correctly', () => {
      expect(applySafetyFactor(10000, 0.2)).toBe(8000);
      expect(applySafetyFactor(5000, 0.35)).toBeCloseTo(3250, 1);
    });

    it('should not go below zero', () => {
      expect(applySafetyFactor(1000, 1.5)).toBe(0);
    });

    it('should return original for zero safety factor', () => {
      expect(applySafetyFactor(10000, 0)).toBe(10000);
    });
  });
});

describe('Range Generation', () => {
  describe('generateTorqueRange', () => {
    it('should generate correct range with given step', () => {
      expect(generateTorqueRange(0, 1000, 250)).toEqual([0, 250, 500, 750, 1000]);
      expect(generateTorqueRange(0, 10, 3)).toEqual([0, 3, 6, 9]);
      expect(generateTorqueRange(-10, 10, 5)).toEqual([-10, -5, 0, 5, 10]);
    });

    it('should handle large ranges', () => {
      const range = generateTorqueRange(0, 80000, 10000);
      expect(range[0]).toBe(0);
      expect(range[range.length - 1]).toBe(80000);
      expect(range.length).toBe(9);
    });
  });
});

describe('calculateTensions - Integration Tests', () => {
  const od = 4;
  const wall = 0.213;
  const yieldPsi = 35000;

  it('should generate valid tension curve', () => {
    const results = calculateTensions(od, wall, yieldPsi, 1000, 5000);
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    
    // Check properties
    results.forEach(point => {
      expect(point).toHaveProperty('tq');
      expect(point).toHaveProperty('Tmax');
      expect(typeof point.tq).toBe('number');
      expect(typeof point.Tmax).toBe('number');
      expect(point.Tmax).toBeGreaterThan(0);
    });
  });

  it('should start at zero torque with max tension', () => {
    const results = calculateTensions(od, wall, yieldPsi, 1000, 5000);
    const firstPoint = results[0];
    expect(firstPoint.tq).toBe(0);
    
    const id = insideDiameter(od, wall);
    const A = area(od, id);
    expect(firstPoint.Tmax).toBeCloseTo(A * yieldPsi, 0);
  });

  it('should have decreasing tension with increasing torque', () => {
    const results = calculateTensions(od, wall, yieldPsi, 1000, 5000);
    for (let i = 1; i < results.length; i++) {
      expect(results[i].Tmax).toBeLessThanOrEqual(results[i - 1].Tmax);
    }
  });

  it('should respect custom parameters', () => {
    const step = 500;
    const maxTorque = 5000;
    const results = calculateTensions(od, wall, yieldPsi, step, maxTorque);
    
    expect(results.length).toBe(Math.trunc(maxTorque / step) + 1);
    expect(results[results.length - 1].tq).toBeLessThanOrEqual(maxTorque);
  });

  it('should work with different pipe sizes', () => {
    const results1 = calculateTensions(4, 0.213, 35000, 1000, 5000);
    const results2 = calculateTensions(5, 0.258, 35000, 1000, 5000);
    
    expect(results1.length).toBeGreaterThan(0);
    expect(results2.length).toBeGreaterThan(0);
    // Larger pipe should have higher capacity
    expect(results2[0].Tmax).toBeGreaterThan(results1[0].Tmax);
  });
});
