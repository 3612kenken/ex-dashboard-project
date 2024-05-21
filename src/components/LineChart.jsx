import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const LineChartComponent = ({ data, options }) => {
  return <Line data={data} options={options} />;
};

export default LineChartComponent;
