import Grid from '@mui/material/Grid';
import { getQuery } from '../Queries/Queries';
import { useEffect, useState, useMemo } from 'react';
import { BarChart, PieChart, LineChart } from '../components/Charts';
import Spinner from '../components/Spinner';
import { plugins, scales } from 'chart.js';
import { BorderColor } from '@mui/icons-material';

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

  console.log(stackedData);

  const groupedData = stackedData.reduce((acc, cur) => {
    if (!acc[cur.category]) {
      acc[cur.category] = {};
    }
    if (!acc[cur.category][cur.year]) {
      acc[cur.category][cur.year] = 0;
    }
    acc[cur.category][cur.year] += cur.accreditationCount;
    return acc;
  }, {});

  const datasets = Object.keys(groupedData).map((category, index) => {
    return {
      label: category,
      data: Object.values(groupedData[category]),
      backgroundColor: bgColor[index],
    };
  });

  const labels = stackedData
    .map((item) => item.year)
    .filter((value, index, self) => self.indexOf(value) === index);

  // const trendData = stackedData.reduce((acc, cur) => {
  //   if (!acc[cur.program]) {
  //     acc[cur.program] = {};
  //   }
  //   if (!acc[cur.program][cur.year]) {
  //     acc[cur.program][cur.year] = 0;
  //   }
  //   acc[cur.program][cur.year] += cur.enrollmentRate;
  //   return acc;
  // }, {});

  // const trendDS = Object.keys(trendData).map((program, index) => {
  //   return {
  //     label: program,
  //     data: Object.values(trendData[program]),
  //     branches: Object.keys(trendData[program]),
  //     backgroundColor: bgColor[index],
  //   };
  // });

  // const trendLabels = trendData
  //   .map((item) => item.year)
  //   .filter((value, index, self) => self.indexOf(value) === index);

  return (
    <div>
      <h1 className='page-title'>
        <span className='text-gradient'>Profile</span> of Academic Programs
      </h1>
      {loading ? (
        <Spinner />
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <div>
          <Grid container spacing={2} margin={1}>
            <Grid item xs={12}>
              {loading ? (
                <Spinner />
              ) : error ? (
                <p>Error: {error.message}</p>
              ) : (
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
                        text: 'Programs by Accreditation Status',
                      },
                    },
                    indexAxis: 'x',
                  }}
                />
              )}
            </Grid>
            <Grid item xs={4}>
              {loading ? (
                <Spinner />
              ) : error ? (
                <p>Error: {error.message}</p>
              ) : (
                <>
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
                          text: 'Programs by Degree Level',
                        },
                      },
                    }}
                    bgColor={bgColor}
                  />
                </>
              )}
            </Grid>
            <Grid item xs={8}>
              {loading ? (
                <Spinner />
              ) : error ? (
                <p>Error: {error.message}</p>
              ) : (
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
                        text: 'Growth in Program Offerings Over Time',
                      },
                    },
                  }}
                  bgColor={bgColor}
                />
              )}
            </Grid>

            <Grid>
              <Grid>
                {loading ? (
                  <Spinner />
                ) : error ? (
                  <p>Error: {error.message}</p>
                ) : (
                  <>
                    {/* <LineChart
                    data={{
                      labels: labels,
                      datasets: datasets,
                    }}
                  /> */}
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={1} margin={1}>
            <Grid item xs={6} md={8}>
              {loading ? (
                <Spinner />
              ) : error ? (
                <p>Error: {error.message}</p>
              ) : (
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
                        text: 'Programs by Degree Level',
                      },
                    },
                  }}
                  bgColor={bgColor}
                />
              )}
            </Grid>
            <Grid item xs={6} md={4}>
              {loading ? (
                <Spinner />
              ) : error ? (
                <p>Error: {error.message}</p>
              ) : (
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
                        display: true,
                        position: 'right',
                      },
                      title: {
                        display: true,
                        text: 'Programs by Accreditation Status',
                      },
                    },
                    indexAxis: 'y',
                  }}
                />
              )}
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}

export default ProgramOfferingPage;
