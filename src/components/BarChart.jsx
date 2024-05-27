import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './BarChart.css';

const BarChartComponent = ({ data, options }) => {
  return <Bar data={data} options={options} className='bar-chart' />;
};

export default BarChartComponent;
