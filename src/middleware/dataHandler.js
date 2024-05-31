const dataHandler = (data, groupKey1, groupKey2, valueKey, colorArray) => {
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
};

export default dataHandler;
