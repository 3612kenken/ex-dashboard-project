import { useState, useEffect, useMemo } from 'react';
import Table from '../components/Table';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { getQuery } from '../Queries/Queries';
import './EnrollmentPage.css';

function EnrollmentPage() {
  const [tableData, setTableData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
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
    getQuery(['semester', 'enrollmentRate'], 'getEnrollmentRates', {
      groupBy: 'semester',
    })
      .then(setPieData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { field: 'year', headerName: 'Year' },
    { field: 'branch', headerName: 'Branch' },
    { field: 'semester', headerName: 'Semester' },
    { field: 'enrollmentRate', headerName: 'Enrollment Rate' },
  ];
  const data = {
    labels: pieData.map((item) => item.semester || ''),
    datasets: [
      {
        label: 'Enrollment Rate by Semester',
        data: pieData.map((item) => item.enrollmentRate || 0),
        backgroundColor: bgColor,
        borderWidth: 1,
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  return (
    <div>
      {loading ? (
        <>
          <p>Loading...</p>
        </>
      ) : error ? (
        <p>Error :</p>
      ) : (
        <>
          <h2 className='page-title '>
            Enrollment <span className='text-gradient'> Profile</span>
          </h2>
          <Grid container spacing={1} className='mb-1'>
            <Grid item center xs={5}>
              <p className='page-label'>Placeholder</p>
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
                    responsive: true,
                  },
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <p className='page-label'>Placeholder</p>
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
              <p className='page-label'>Placeholder</p>
              <PieChart
                data={{
                  labels: pieData.map((item) => item.semester || ''),
                  datasets: [
                    {
                      labels: pieData.map((item) => item.semester || ''),
                      data: pieData.map((item) => item.enrollmentRate),
                      fill: false,
                      backgroundColor: bgColor,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
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
                      display: true,
                      position: 'bottom',
                    },
                  },
                }}
              />
            </Grid>
            {/* <Grid xs={12} className='mb-1'>
                <Table data={tableData} columns={columns} />
              </Grid> */}
          </Grid>

          <h3 className='page-subtitle '>
            Lorem <span className='text-gradient'> Ipsum</span>
          </h3>
        </>
      )}
    </div>
  );
}

export default EnrollmentPage;
