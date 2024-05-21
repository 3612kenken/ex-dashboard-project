import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `http://localhost:4000/graphql`;

const executeQuery = async (query) => {
  const response = await axios.post(API_URL, { query });
  const data = response.data.data;
  return data;
};

export const GET_ENROLLMENT_DATA = async () => {
  const query = `
    query {
      getEnrollmentRates {
        id
        year
        branch
        semester
        enrollmentRate
      }
    }
  `;
  const data = await executeQuery(query);
  return data.getEnrollmentRates;
};

export const GET_ENROLLMENT_TREND = async () => {
  const query = `
    query {
      getEnrollmentRates(groupBy: "year") {
        year
        enrollmentRate
      }
    }
  `;
  const data = await executeQuery(query);
  return data.getEnrollmentRates;
};

export const GET_ENROLLMENT_DATA_BY_BRANCH = async () => {
  const query = `
    query {
      getEnrollmentRates(groupBy: "branch") {
        branch
        enrollmentRate
      }
    }
  `;
  const data = await executeQuery(query);
  return data.getEnrollmentRates;
};
