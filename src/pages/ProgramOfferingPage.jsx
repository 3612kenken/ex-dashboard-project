import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import Grid from '@mui/material/Grid';
import PieChart from '../components/PieChart';
import { getQuery } from '../Queries/Queries';
import { useEffect, useState, useMemo } from 'react';
import { layouts } from 'chart.js';
import { idID } from '@mui/material/locale';

function ProgramOfferingPage() {
  const [tableData, setTableData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [stackedData, setStackedData] = useState([]); // [ { program: 'BSIT', category: 'Undergraduate', accreditationCount: 5 }, ...
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bgColor = useMemo(
    () => [
      '#003f5c',
      '#2f4b7c',
      '#665191',
      '#a05195',
      '#d45087',
      '#f95d6a',
      '#ff7c43',
      '#ffa600',
    ],
    []
  );

  useEffect(() => {
    setLoading(true);
    getQuery(['year', 'count'], 'getProgramOfferingsProfile', {
      groupBy: 'year',
    })
      .then(setTableData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    getQuery(['type', 'count'], 'getProgramOfferingsProfile', {
      groupBy: 'type',
    })
      .then(setPieData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    getQuery(
      ['program', 'category', 'year', 'accreditationCount'],
      'getAccreditationProfile',
      {
        groupBy: ['program', 'category', 'year'],
      }
    )
      .then(setStackedData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const groupedData = stackedData.reduce((acc, cur) => {
    if (!acc[cur.program]) {
      acc[cur.program] = {};
    }
    if (!acc[cur.program][cur.category]) {
      acc[cur.program][cur.category] = 0;
    }
    acc[cur.program][cur.category] += cur.accreditationCount;
    return acc;
  }, {});

  const datasets = Object.keys(groupedData).map((program, index) => {
    return {
      label: program,
      data: Object.values(groupedData[program]),
      backgroundColor: bgColor[index],
    };
  });

  const labels = stackedData
    .map((item) => item.category)
    .filter((value, index, self) => self.indexOf(value) === index);

  return (
    <div>
      <h1 className='page-title'>
        <span className='text-gradient'>Profile</span> of Academic Programs
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <BarChart
              data={{
                labels: tableData.map((data) => data.year),
                datasets: [
                  {
                    label: 'Number of Programs',
                    data: tableData.map((data) => data.count),
                    backgroundColor: bgColor,
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
                indexAxis: 'y',
                plugins: {
                  legend: {
                    display: false,
                    position: 'bottom',
                  },
                  title: {
                    display: true,
                    text: 'Lorem Ipsum Dolor Sit Amet',
                  },
                },
              }}
              bgColor={bgColor}
            />
          </Grid>
          <Grid item xs={4}>
            <BarChart
              data={{
                labels: labels,
                datasets: datasets,
              }}
              options={{
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                    position: 'bottom',
                  },
                  title: {
                    display: true,
                    text: 'Lorem Ipsum Dolor Sit Amet',
                  },
                },
                indexAxis: 'y',
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <PieChart
              data={{
                labels: pieData.map((data) =>
                  data.type
                    .split(' ')
                    .map((word) => word[0].toUpperCase() + word.slice(1))
                    .join('')
                ),
                datasets: [
                  {
                    data: pieData.map((data) => data.count),
                    backgroundColor: bgColor,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Lorem Ipsum Dolor Sit Amet',
                  },
                },
              }}
              bgColor={bgColor}
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default ProgramOfferingPage;
