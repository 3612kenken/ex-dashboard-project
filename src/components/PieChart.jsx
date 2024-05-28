import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './PieChart.css';

const PieChartComponent = ({ data, options }) => {
  return <Pie data={data} options={options} className='chart-container' />;
};

export default PieChartComponent;
