import { useState, useEffect } from 'react';
import Table from '../components/Table';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import Grid from '@mui/material/Grid';
import {
  GET_ENROLLMENT_DATA,
  GET_ENROLLMENT_TREND,
  GET_ENROLLMENT_DATA_BY_BRANCH,
} from '../Queries/Queries';

function EnrollmentPage() {
  const [tableData, setTableData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const enrollmentData = await GET_ENROLLMENT_DATA();
        const enrollmentTrend = await GET_ENROLLMENT_TREND();
        const enrollmentDataByBranch = await GET_ENROLLMENT_DATA_BY_BRANCH();
        setTableData(enrollmentData);
        setLineChartData(enrollmentTrend);
        setBarChartData(enrollmentDataByBranch);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        setError(true);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: 'year', headerName: 'Year' },
    { field: 'branch', headerName: 'Branch' },
    { field: 'semester', headerName: 'Semester' },
    { field: 'enrollmentRate', headerName: 'Enrollment Rate' },
  ];

  return (
    <div>
      <h3>Enrollment Profile</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error :</p>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <LineChart
                data={{
                  labels: lineChartData.map((item) => item.year),
                  datasets: [
                    {
                      label: 'Enrollment Rate',
                      data: lineChartData.map((item) => item.enrollmentRate),
                      fill: false,
                      backgroundColor: 'rgb(255, 99, 132)',
                      borderColor: 'rgba(255, 99, 132, 0.2)',
                    },
                  ],
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <BarChart
                data={{
                  labels: barChartData.map((item) => item.branch),
                  datasets: [
                    {
                      label: 'Enrollment Rate',
                      data: barChartData.map((item) => item.enrollmentRate),
                      fill: false,
                      backgroundColor: 'rgb(255, 99, 132)',
                      borderColor: 'rgba(255, 99, 132, 0.2)',
                    },
                  ],
                }}
              />
            </Grid>
            <Table data={tableData} columns={columns} />
          </Grid>
        </>
      )}
    </div>
  );
}

export default EnrollmentPage;
