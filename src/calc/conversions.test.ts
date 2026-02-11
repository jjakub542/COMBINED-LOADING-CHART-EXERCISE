import { describe, it, expect } from 'vitest';
import { convertTorque, convertTension } from './conversions';

describe('Conversion Functions', () => {
  describe('convertTorque', () => {
    it('should convert to kftlb correctly', () => {
      expect(convertTorque(5000, 'kftlb')).toBe(5);
      expect(convertTorque(80000, 'kftlb')).toBe(80);
    });

    it('should convert to kNm correctly', () => {
      expect(convertTorque(737.562, 'kNm')).toBeCloseTo(1, 2);
      expect(convertTorque(50000, 'kNm')).toBeCloseTo(67.793, 2);
    });
  });

  describe('convertTension', () => {
    it('should convert to klb correctly', () => {
      expect(convertTension(5000, 'klb')).toBe(5);
      expect(convertTension(100000, 'klb')).toBe(100);
    });

    it('should convert to mT correctly', () => {
      expect(convertTension(2204.62262, 'mT')).toBeCloseTo(1, 2);
      expect(convertTension(50000, 'mT')).toBeCloseTo(22.679, 2);
    });
  });
});
