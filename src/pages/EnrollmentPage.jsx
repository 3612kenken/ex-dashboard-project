import { useState, useEffect, useMemo } from 'react';
import Table from '../components/Table';
import { LineChart, BarChart, PieChart } from '../components/Charts';
import Spinner from '../components/Spinner';
import Grid from '@mui/material/Grid';
import { getQuery } from '../Queries/Queries';
import styles from './Enrollment.module.css';
import MuiDrawer from '@mui/material/Drawer';

function EnrollmentPage() {
  const [tableData, setTableData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [stackedData, setStackedData] = useState([]);
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
    getQuery(
      ['year', 'branch', 'semester', 'enrollmentRate'],
      'getEnrollmentRates'
    )
      .then(setTableData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    getQuery(['year', 'enrollmentRate'], 'getEnrollmentRates', {
      groupBy: 'year',
    })
      .then(setLineChartData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    getQuery(['branch', 'enrollmentRate'], 'getEnrollmentRates', {
      groupBy: 'branch',
    })
      .then(setBarChartData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    getQuery(
      ['semester', 'branch', 'year', 'enrollmentRate'],
      'getEnrollmentRates',
      {
        groupBy: ['branch', 'semester', 'year'],
      }
    )
      .then(setStackedData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { field: 'year', headerName: 'Year' },
    { field: 'branch', headerName: 'Branch' },
    { field: 'semester', headerName: 'Semester' },
    { field: 'enrollmentRate', headerName: 'Enrollment Rate' },
  ];
  function restructureData(data, groupKey1, groupKey2, valueKey, colorArray) {
    const groupedData = data.reduce((acc, cur) => {
      if (!acc[cur[groupKey1]]) {
        acc[cur[groupKey1]] = {};
      }
      if (!acc[cur[groupKey1]][cur[groupKey2]]) {
        acc[cur[groupKey1]][cur[groupKey2]] = 0;
      }
      acc[cur[groupKey1]][cur[groupKey2]] += cur[valueKey];
      return acc;
    }, {});

    const datasets = Object.keys(groupedData).map((key, index) => {
      return {
        label: key,
        data: Object.values(groupedData[key]),
        branches: Object.keys(groupedData[key]),
        backgroundColor: colorArray[index],
      };
    });

    const labels = data
      .map((item) => item[groupKey2])
      .filter((value, index, self) => self.indexOf(value) === index);

    return { datasets, labels };
  }

  const enrollmentData = restructureData(
    stackedData,
    'year',
    'branch',
    'enrollmentRate',
    bgColor
  );

  const invertedDS = restructureData(
    stackedData,
    'branch',
    'year',
    'enrollmentRate',
    bgColor
  );

  return (
    <div>
      <h2 className='page-title '>
        Enrollment <span className='text-gradient'> Profile</span>
      </h2>
      {loading ? (
        <>
          <Spinner />
        </>
      ) : error ? (
        <p>Error:{error.message}</p>
      ) : (
        <>
          <Grid container spacing={1} className='mb-1'>
            <Grid item xs={12} md={8} lg={9}>
              {/* <p className='page-label'>Total Enrollment Overtime</p> */}
              <LineChart
                data={{
                  labels: lineChartData.map((item) => item.year),
                  datasets: [
                    {
                      data: lineChartData.map((item) => item.enrollmentRate),
                      fill: false,
                      backgroundColor: '#ffa600',
                      borderColor: 'rgba(255, 99, 132, 0.2)',
                      borderWidth: 8,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: {
                    x: {
                      ticks: {
                        color: 'black',
                      },
                    },
                    y: {
                      ticks: {
                        color: 'black',
                        fontSize: 14,
                      },
                    },
                  },
                  plugins: {
                    title: {
                      display: true,
                      text: 'Total Enrollment Overtime',
                      position: 'bottom',
                      color: 'black',
                    },
                    legend: {
                      display: false,
                    },
                    responsive: true,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              {/* <p className='page-label'>
                Total Enrollment Distribution by Campus
              </p> */}
              <PieChart
                data={{
                  labels: enrollmentData.labels,
                  datasets: [
                    {
                      label: 'count',
                      data: barChartData.map((item) => item.enrollmentRate),
                      fill: false,
                      backgroundColor: bgColor,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: {
                    x: {
                      ticks: {
                        color: 'black',
                      },
                    },
                    y: {
                      ticks: {
                        color: 'black',
                        fontSize: 14,
                      },
                    },
                  },

                  plugins: {
                    title: {
                      display: true,
                      text: 'Average Enrollment Distribution by Campus',
                      position: 'bottom',
                    },
                    legend: {
                      display: true,
                      position: 'bottom',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4} lg={6}>
              {/* <p className='page-label'>Year-over-Year Enrollment Growth</p> */}
              <BarChart
                data={{
                  labels: enrollmentData.labels,
                  datasets: enrollmentData.datasets,
                }}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: {
                    x: {
                      stacked: false,
                    },
                    y: {
                      stacked: false,
                    },
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'right',
                    },
                    title: {
                      display: true,
                      text: 'Year-over-Year Enrollment Growth by Campus',
                      position: 'bottom',
                    },
                  },
                  indexAxis: 'x',
                }}
              />
            </Grid>
            <Grid item xs={12} md={8} lg={6}>
              {/* <p className='page-label'>Year-over-Year Enrollment Growth</p> */}
              <BarChart
                data={{
                  labels: invertedDS.labels,
                  datasets: invertedDS.datasets,
                }}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: {
                    x: {
                      stacked: false,
                    },
                    y: {
                      stacked: false,
                    },
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'right',
                    },
                    title: {
                      display: true,
                      text: 'Year-over-Year Enrollment Growth',
                      position: 'bottom',
                    },
                  },
                  indexAxis: 'x',
                }}
              />
            </Grid>
          </Grid>

          {/* <h3 className='page-subtitle '>
            Lorem <span className='text-gradient'> Ipsum</span>
          </h3> */}
        </>
      )}
    </div>
  );
}

export default EnrollmentPage;
