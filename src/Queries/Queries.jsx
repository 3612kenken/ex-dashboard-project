import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || `http://localhost:4000/graphql`;

const stringifyValue = (value, isEnum = false) => {
  if (typeof value === 'string') {
    return isEnum ? value : `"${value}"`;
  } else if (Array.isArray(value)) {
    return `[${value.map((v) => stringifyValue(v, isEnum)).join(', ')}]`;
  } else if (typeof value === 'object' && value !== null) {
    return `{${Object.entries(value)
      .map(([k, v]) => `${k}: ${stringifyValue(v, isEnum)}`)
      .join(', ')}}`;
  } else {
    return JSON.stringify(value);
  }
};

const buildQuery = (fields, queryName, args = {}) => {
  let argsString = '';
  if (Object.keys(args).length > 0) {
    argsString =
      '(' +
      Object.entries(args)
        .map(
          ([key, value]) =>
            `${key}: ${stringifyValue(value, key === 'groupBy')}`
        )
        .join(', ') +
      ')';
  }

  return `
    query {
      ${queryName}${argsString} {
        ${fields.join(' ')}
      }
    }
  `;
};

const buildMutation = (fields, mutationName, input, args = {}) => {
  let argsString = '';
  if (Object.keys(args).length > 0) {
    argsString =
      ', ' +
      Object.entries(args)
        .map(
          ([key, value]) =>
            `${key}: ${stringifyValue(value, key === 'groupBy')}`
        )
        .join(', ');
  }

  return `
    mutation {
      ${mutationName}(${input}${argsString}) {
        ${fields.join(' ')}
      }
    }
  `;
};
const getQuery = async (fields, queryName, args = {}) => {
  const query = buildQuery(fields, queryName, args);
  const response = await axios.post(API_URL, { query });
  return response.data.data[queryName];
};

const getMutation = async (fields, mutationName, input, args) => {
  const query = buildMutation(fields, mutationName, input, args);
  const response = await axios.post(API_URL, { query });
  return response.data.data[mutationName];
};

export { getQuery, getMutation };
