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

  const programDS = restructureData(
    stackedData,
    'category',
    'year',
    'accreditationCount',
    bgColor
  );

  const invertedDS = restructureData(
    stackedData,
    'year',
    'category',
    'accreditationCount',
    bgColor
  );

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
        <Grid>
          <Grid container spacing={2}>
            <Grid item xs={6} md={6}>
              {loading ? (
                <Spinner />
              ) : error ? (
                <p>Error: {error.message}</p>
              ) : (
                <BarChart
                  data={{
                    labels: programDS.labels,
                    datasets: programDS.datasets,
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
                        text: 'Program Accreditation Status',
                      },
                    },
                    indexAxis: 'x',
                  }}
                />
              )}
            </Grid>
            <Grid item xs={6} md={6}>
              {loading ? (
                <Spinner />
              ) : error ? (
                <p>Error: {error.message}</p>
              ) : (
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
                        text: 'Program Accreditation Status by Year',
                      },
                    },
                    indexAxis: 'x',
                  }}
                />
              )}
            </Grid>
            <Grid item xs={12} md={6}>
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
                      maintainAspectRatio: false,
                      responsive: true,
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
            <Grid item xs={12} md={6}>
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
                    maintainAspectRatio: false,
                    responsive: true,
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
        </Grid>
      )}
    </div>
  );
}

export default ProgramOfferingPage;
