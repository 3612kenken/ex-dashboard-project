import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './LineChart.css';

const LineChartComponent = ({ data, options }) => {
  return <Line data={data} options={options} className='line-chart' />;
};

export default LineChartComponent;
