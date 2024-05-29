import { useState, useEffect, useMemo } from 'react';
import Table from '../components/Table';
import { LineChart, BarChart, PieChart } from '../components/Charts';
import Spinner from '../components/Spinner';
import Grid from '@mui/material/Grid';
import { getQuery } from '../Queries/Queries';
import './EnrollmentPage.css';

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

  // const groupedData = stackedData.reduce((acc, cur) => {
  //   if (!acc[cur.year]) {
  //     acc[cur.year] = {};
  //   }
  //   if (!acc[cur.year][cur.branch]) {
  //     acc[cur.year][cur.branch] = 0;
  //   }
  //   acc[cur.year][cur.branch] += cur.enrollmentRate;
  //   return acc;
  // }, {});

  // const datasets = Object.keys(groupedData).map((year, index) => {
  //   return {
  //     label: year,
  //     data: Object.values(groupedData[year]),
  //     backgroundColor: bgColor[index], // bgColor is an array of colors
  //   };
  // });

  const groupedData = stackedData.reduce((acc, cur) => {
    if (!acc[cur.year]) {
      acc[cur.year] = {};
    }
    if (!acc[cur.year][cur.branch]) {
      acc[cur.year][cur.branch] = 0;
    }
    acc[cur.year][cur.branch] += cur.enrollmentRate;
    return acc;
  }, {});

  const datasets = Object.keys(groupedData).map((year, index) => {
    return {
      label: year,
      data: Object.values(groupedData[year]),
      branches: Object.keys(groupedData[year]),
      backgroundColor: bgColor[index],
    };
  });

  const labels = stackedData
    .map((item) => item.branch)
    .filter((value, index, self) => self.indexOf(value) === index);

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
            <Grid item center xs={12}>
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
            <Grid item xs={6}>
              {/* <p className='page-label'>
                Total Enrollment Distribution by Campus
              </p> */}
              <BarChart
                data={{
                  labels: labels,
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
                      text: '    Total Enrollment Distribution by Campus',
                      position: 'bottom',
                    },
                    legend: {
                      display: false,
                      position: 'bottom',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              {/* <p className='page-label'>Year-over-Year Enrollment Growth</p> */}
              <BarChart
                data={{
                  labels: labels,
                  datasets: datasets,
                }}
                options={{
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
            {/* <Grid xs={12} className='mb-1'>
                <Table data={tableData} columns={columns} />
              </Grid> */}
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
