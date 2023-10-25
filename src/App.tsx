import { useState, useEffect } from 'react';

import {
  Card,
  Title,
  LineChart
} from "@tremor/react";

import './App.css'

function App() {
  const [lineChartData, setLineChartData] = useState([]);

  const apiUrl = 'https://backend-arce.onrender.com/api/cumulative';

  useEffect(() => {
    // Fetch data from the API
    fetch(apiUrl)
      .then((response) => response.json())
      .then((responseData) => {
        setLineChartData(responseData.lineChartData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <>
      <Card>
        <Title>Cumulative Weekly Counts</Title>
        <LineChart
          className="h-72 mt-4"
          data={lineChartData}
          index="Week"
          categories={["Cumulative Count"]}
          colors={["emerald", "gray"]}
          yAxisWidth={40}
          connectNulls={true}
        />
      </Card>

    </>
  );
}

export default App;