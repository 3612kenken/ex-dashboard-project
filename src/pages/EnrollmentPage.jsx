import { useState, useEffect } from 'react';
import Table from '../components/Table';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import Grid from '@mui/material/Grid';
import { getQuery } from '../Queries/Queries';
import Skeleton from '@mui/material/Skeleton';

import './EnrollmentPage.css';
import { scales } from 'chart.js';
import { color } from 'chart.js/helpers';

let delayed = false;
function EnrollmentPage() {
  const [tableData, setTableData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [hbarChartData, setHbarChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const bgColor = [
    '#003f5c',
    '#2f4b7c',
    '#665191',
    '#a05195',
    '#d45087',
    '#f95d6a',
    '#ff7c43',
    '#ffa600',
  ];

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getQuery(
        ['year', 'branch', 'semester', 'enrollmentRate'],
        'getEnrollmentRates'
      ),
      getQuery(['year', 'enrollmentRate'], 'getEnrollmentRates', {
        groupBy: 'year',
      }),
      getQuery(['branch', 'enrollmentRate'], 'getEnrollmentRates', {
        groupBy: 'branch',
      }),
      getQuery(['semester', 'enrollmentRate'], 'getEnrollmentRates', {
        groupBy: 'semester',
      }),
    ])
      .then(([tableData, lineChartData, barChartData, hbarChartData]) => {
        setTableData(tableData);
        setLineChartData(lineChartData);
        setBarChartData(barChartData);
        setHbarChartData(hbarChartData);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setError(true);
        setLoading(false);
      });
  }, []);

  const columns = [
    { field: 'year', headerName: 'Year' },
    { field: 'branch', headerName: 'Branch' },
    { field: 'semester', headerName: 'Semester' },
    { field: 'enrollmentRate', headerName: 'Enrollment Rate' },
  ];

  return (
    <div className='page-title'>
      {loading ? (
        <>
          <Skeleton variant='rectangular' height={200} />
          <Skeleton variant='rectangular' height={200} />
          <Skeleton variant='rectangular' height={200} />
        </>
      ) : error ? (
        <p>Error :</p>
      ) : (
        <>
          <h2 className='page-title '>
            Enrollment <span className='text-gradient'> Profile</span>
          </h2>
          <Grid container maxWidth='xl' spacing={2}>
            <Grid item center xs={'auto'}>
              <p className='page-label'>Yearly Enrollment Growth</p>
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
                      display: false,
                      text: 'Enrollment Rate by Year',
                      position: 'bottom',
                      color: 'black',
                    },
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={'auto'}>
              <p className='page-label'>Enrollment Rate by Branch</p>
              <BarChart
                data={{
                  labels: barChartData.map((item) => item.branch),
                  datasets: [
                    {
                      labels: barChartData.map((item) => item.branch),
                      data: barChartData.map((item) => item.enrollmentRate),
                      fill: false,
                      backgroundColor: bgColor,
                    },
                  ],
                }}
                options={{
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
                      display: false,
                      text: 'Enrollment Rate by Branch',
                      position: 'bottom',
                      color: 'black',
                    },
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={'auto'}>
              <p className='page-label'>Enrollment Rate by Semester</p>
              <BarChart
                data={{
                  labels: hbarChartData.map((item) => item.semester),
                  datasets: [
                    {
                      labels: hbarChartData.map((item) => item.semester),
                      data: hbarChartData.map((item) => item.enrollmentRate),
                      fill: false,
                      backgroundColor: bgColor,
                    },
                  ],
                }}
                options={{
                  indexAxis: 'y',
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
                      display: false,
                      text: 'Enrollment Rate by Semester',
                      position: 'bottom',
                      color: 'black',
                    },
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </Grid>
            <Grid xs={3}></Grid>
            {/* <Table data={tableData} columns={columns} /> */}
          </Grid>
        </>
      )}
    </div>
  );
}

export default EnrollmentPage;
