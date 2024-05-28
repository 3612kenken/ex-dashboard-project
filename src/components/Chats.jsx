import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

export function LineChart({ data, options, styles }) {
  return <Chart data={data} options={options} type='line' className={styles} />;
}

export function BarChart({ data, options }) {
  return <Chart data={data} options={options} type='bar' className={styles} />;
}

export function PieChart({ data, options }) {
  return <Chart data={data} options={options} type='pie' className={styles} />;
}
