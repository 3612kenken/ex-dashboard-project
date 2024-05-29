import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import './Charts.css';
export function LineChart({ data, options, styles }) {
  return (
    <Chart
      data={data}
      options={options}
      type='line'
      className={`chart-container ${styles}`}
    />
  );
}

export function BarChart({ data, options, styles }) {
  return (
    <Chart
      data={data}
      options={options}
      type='bar'
      className={`chart-container ${styles}`}
    />
  );
}

export function PieChart({ data, options, styles }) {
  return (
    <Chart
      data={data}
      options={options}
      type='pie'
      className={`chart-container ${styles}`}
    />
  );
}
