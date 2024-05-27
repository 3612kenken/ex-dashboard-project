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
          <h2 className='page-title '>Enrollment Profile</h2>
          <Grid container maxWidth='xl' spacing={1}>
            <Grid item md={6}>
              <LineChart
                data={{
                  labels: lineChartData.map((item) => item.year),
                  datasets: [
                    {
                      data: lineChartData.map((item) => item.enrollmentRate),
                      fill: false,
                      backgroundColor: 'rgb(255, 99, 132)',
                      borderColor: 'rgba(255, 99, 132, 0.2)',
                      borderWidth: 8,
                    },
                  ],
                }}
                options={{
                  scales: {
                    x: {
                      ticks: {
                        color: 'white',
                      },
                    },
                    y: {
                      ticks: {
                        color: 'white',
                        fontSize: 14,
                      },
                    },
                  },
                  plugins: {
                    title: {
                      display: false,
                      text: 'Enrollment Rate by Year',
                      position: 'bottom',
                      color: 'white',
                    },
                    legend: {
                      display: false,
                    },
                  },
                }}
              />

              <p className='page-label'>Enrollment Rate by Year</p>
            </Grid>
            <Grid item xs={6}>
              <BarChart
                data={{
                  labels: barChartData.map((item) => item.branch),
                  datasets: [
                    {
                      labels: barChartData.map((item) => item.branch),
                      data: barChartData.map((item) => item.enrollmentRate),
                      fill: false,
                      backgroundColor: [
                        'rgba(255, 99, 132,0.5)',
                        'rgba(54, 162, 235,0.5)',
                        'rgba(255, 206, 86,0.5)',
                        'rgba(75, 192, 192,0.5)',
                        'rgba(153, 102, 255,0.5)',
                        'rgba(255, 159, 64,0.5)',
                      ],
                    },
                  ],
                }}
                options={{
                  scales: {
                    x: {
                      ticks: {
                        color: 'white',
                      },
                    },
                    y: {
                      ticks: {
                        color: 'white',
                        fontSize: 14,
                      },
                    },
                  },

                  plugins: {
                    title: {
                      display: false,
                      text: 'Enrollment Rate by Branch',
                      position: 'bottom',
                      color: 'white',
                    },
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
              <p className='page-label'>Enrollment Rate by Branch</p>
            </Grid>
            <Grid item xs={6}>
              <BarChart
                data={{
                  labels: hbarChartData.map((item) => item.semester),
                  datasets: [
                    {
                      labels: hbarChartData.map((item) => item.semester),
                      data: hbarChartData.map((item) => item.enrollmentRate),
                      fill: false,
                      backgroundColor: [
                        'rgba(255, 99, 132,0.5)',
                        'rgba(54, 162, 235,0.5)',
                        'rgba(255, 206, 86,0.5)',
                        'rgba(75, 192, 192,0.5)',
                        'rgba(153, 102, 255,0.5)',
                        'rgba(255, 159, 64,0.5)',
                      ],
                    },
                  ],
                }}
                options={{
                  indexAxis: 'y',
                  scales: {
                    x: {
                      ticks: {
                        color: 'white',
                      },
                    },
                    y: {
                      ticks: {
                        color: 'white',
                        fontSize: 14,
                      },
                    },
                  },

                  plugins: {
                    title: {
                      display: false,
                      text: 'Enrollment Rate by Semester',
                      position: 'bottom',
                      color: 'white',
                    },
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
              <p className='page-label'>Enrollment Rate by Semester</p>
            </Grid>
            {/* <Table data={tableData} columns={columns} /> */}
          </Grid>
        </>
      )}
    </div>
  );
}

export default EnrollmentPage;
