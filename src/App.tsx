import { useState, useEffect } from 'react';

import {
  Card,
  Title,
  LineChart
} from "@tremor/react";

import './App.css'

function App() {
  const [lineChartData, setLineChartData] = useState([]);
  const [lineChartData2, setLineChartData2] = useState([]);

  const apiUrl = 'https://backend-arce.onrender.com/api/cumulative';
  const apiUrl2 = 'https://backend-arce.onrender.com/api/success';

  useEffect(() => {
    // Fetch data for the first LineChart from apiUrl
    fetch(apiUrl)
      .then((response) => response.json())
      .then((responseData) => {
        setLineChartData(responseData.lineChartData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    // Fetch data for the second LineChart from apiUrl2
    fetch(apiUrl2)
      .then((response) => response.json())
      .then((responseData) => {
        setLineChartData2(responseData.lineChartData2);
      })
      .catch((error) => {
        console.error('Error fetching data for the second chart:', error);
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

      <Card>
        <Title>Percentage of Successful Companies Over Time</Title>
        <LineChart
          className="h-72 mt-4"
          data={lineChartData2}
          index="Month"
          categories={["Success Percentage"]}
          colors={["blue", "red"]}
          yAxisWidth={40}
          connectNulls={true}
        />
      </Card>
    </>
  );
}

export default App;
