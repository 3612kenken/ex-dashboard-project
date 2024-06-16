import { useState, useEffect, useMemo } from 'react';
import Table from '../components/Table';
import { LineChart, BarChart, PieChart } from '../components/Charts';
import Spinner from '../components/Spinner';
import Grid from '@mui/material/Grid';
import { getQuery } from '../Queries/Queries';
import styles from './Graduates.module.css';

import React from 'react'

function GraduatesPage () {
  const [tableData, setTableData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [stackedData, setStackedData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bgColor = useMemo(
    () => [
      '#b3cc09',
      '#47a9ba',
      '#a031f3',
      '#d21fc4',
      '#28adbb',
      '#ec1348',
      '#54f02e',
      '#6d98d5',
    ],
    []
  );

  useEffect(() => {
    setLoading(true);
    getQuery(
      ['year', 'branch', 'graduateCount'],
      'getGraduationRates'
    )
      .then(setTableData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    getQuery(['year', 'graduateCount'], 'getGraduationRates', {
      groupBy: 'year',
    })
      .then(setLineChartData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    getQuery(['branch', 'graduateCount'], 'getGraduationRates', {
      groupBy: 'branch',
    })
      .then(setBarChartData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    getQuery(
      ['year', 'branch', 'graduateCount'],
      'getGraduationRates',
      {
        groupBy: ['branch', 'graduateCount', 'year'],
      }
    )
      .then(setStackedData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { field: 'year', headerName: 'Year' },
    { field: 'branch', headerName: 'Branch' },
    { field: 'graduateCount', headerName: 'Graduate Count' },
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
  
  const graduatesData = restructureData(
    stackedData,
    'year',
    'branch',
    'graduateCount',
    bgColor
  );

  const invertedDS = restructureData(
    stackedData,
    'branch',
    'year',
    'graduateCount',
    bgColor
  );


  return (
    <div>
      <h2 className='page-title '>
        Graduates <span className='text-gradient'> Profile</span>
      </h2>
      {loading ? (
        <>
          <Spinner />
        </>
      ) : error ? (
        <p>Error:{error.message}</p>
      ) : (
        <>
          <Grid container spacing={2} className='mb-1'>
            <Grid item center xs={12} md={6}>
              {/* <p className='page-label'>Total Enrollment Overtime</p> */}
              <LineChart
                data={{
                  labels: lineChartData.map((item) => item.year),
                  datasets: [
                    {
                      data: lineChartData.map((item) => item.graduateCount),
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
                      text: 'Total Graduates Overtime',
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
            <Grid item xs={12} md={6}>
              {/* <p className='page-label'>
                Total Enrollment Distribution by Campus
              </p> */}
              <PieChart
                data={{
                  labels: graduatesData.labels,
                  datasets: [
                    {
                      label: 'count',
                      data: barChartData.map((item) => item.graduateCount),
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
                      text: 'Average Graduates Distribution by Campus',
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
            <Grid item xs={12} md={6}>
              {/* <p className='page-label'>Year-over-Year Enrollment Growth</p> */}
              <BarChart
                data={{
                  labels: graduatesData.labels,
                  datasets: graduatesData.datasets,
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
                      text: 'Year-over-Year Graduates Growth by Campus',
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

export default GraduatesPage
