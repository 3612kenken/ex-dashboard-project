import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

function ColumChart({ data, options }) {
  return <Chart type='column' data={data} options={options} />;
}

export default ColumChart;
