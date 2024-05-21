import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const BarChartComponent = ({ data, options }) => {
  return <Bar data={data} options={options} />;
};

export default BarChartComponent;
