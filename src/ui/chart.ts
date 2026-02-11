import Chart from 'chart.js/auto';
import type { TensionPoint, TorqueUnit, TensionUnit } from '../types';
import { convertTorque, convertTension } from '../calc/conversions';

let chart: Chart | null = null;

export const renderChart = (
  resultsWithoutSF: TensionPoint[],
  resultsWithSF: TensionPoint[],
  torqueUnit: TorqueUnit,
  tensionUnit: TensionUnit,
  safetyFactor: number,
  canvas: HTMLCanvasElement
) => {
  const displayResultsWithoutSF = resultsWithoutSF.map(r => ({
    tq: convertTorque(r.tq, torqueUnit),
    tension: convertTension(r.Tmax, tensionUnit)
  }));

  const displayResultsWithSF = resultsWithSF.map(r => ({
    tq: convertTorque(r.tq, torqueUnit),
    tension: convertTension(r.Tmax, tensionUnit)
  }));

  const data = {
    labels: displayResultsWithoutSF.map(r => r.tq.toFixed(1)),
    datasets: [
      {
        label: `Max Allowable Tension (No SF)`,
        data: displayResultsWithoutSF.map(r => r.tension),
        borderWidth: 2,
        tension: 0.35,
        fill: false,
        borderColor: '#9333ea',
        pointRadius: 0
      },
      {
        label: `Max Allowable Tension (${safetyFactor}% SF)`,
        data: displayResultsWithSF.map(r => r.tension),
        borderWidth: 2,
        tension: 0.35,
        fill: false,
        borderColor: '#2563eb',
        pointRadius: 0
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: true, position: 'top' as const } },
    scales: {
      x: {
        title: { display: true, text: `Torque (${torqueUnit})` },
        type: 'linear' as const
      },
      y: {
        title: { display: true, text: `Tension (${tensionUnit})` }
      }
    }
  };

  if (chart) {
    chart.data = data as any;
    chart.options = options as any;
    chart.update();
  } else {
    chart = new Chart(canvas, {
      type: 'line' as const,
      data: data as any,
      options: options as any
    });
  }
};
