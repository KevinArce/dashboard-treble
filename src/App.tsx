import { useState, useEffect } from 'react';
import { Card, Title, LineChart } from "@tremor/react";
import Chart from 'react-apexcharts';
import { ApexOptions } from "apexcharts";
import './App.css';

// Define the structure for a series item in the stacked bar chart
interface StackedBarSeriesItem {
  name: string;
  data: number[];
}

// Define the structure for the stacked bar chart data
interface StackedBarChartData {
  options: ApexOptions;
  series: StackedBarSeriesItem[];
}
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

if (!API_URL) {
  throw new Error("VITE_REACT_APP_API_URL is not defined in your .env file");
}

function App() {
  const [lineChartData, setLineChartData] = useState([]);
  const [lineChartData2, setLineChartData2] = useState([]);
  const [stackedBarChartData, setStackedBarData] = useState<StackedBarChartData>({
    options: {
      chart: {
        height: 350,
        type: 'bar',
        stacked: true,
        stackType: '100%',
      },
      plotOptions: {
        bar: {
          horizontal: true, // set to false if you want vertical bars
        },
      },
      xaxis: {
        categories: [], // to be filled with 'Cohort Month' entries
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
      },
    },
    series: [] // This will be populated with data from the API
  });

  const apiUrl = API_URL + 'cumulative';
  const apiUrl2 = API_URL + 'success';
  const apiUrl3 = API_URL + 'stackedBarChartData';

  useEffect(() => {
    // Fetch data for the first LineChart from apiUrl
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setLineChartData(data.lineChartData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    // Fetch data for the second LineChart from apiUrl2
    fetch(apiUrl2)
      .then((response) => response.json())
      .then((data) => {
        setLineChartData2(data.lineChartData2);
      })
      .catch((error) => {
        console.error('Error fetching data for the second chart:', error);
      });

    // Fetch data for the stacked bar chart from apiUrl3
    fetch(apiUrl3)
      .then(response => response.json())
      .then(data => {
        // Assuming data is the array of objects as shown in your example JSON

        // First, categorize the data based on 'Month' and 'Invoice Month'
        const categories: any[] = []; // For the 'Month' field
        const seriesData: any = {}; // To hold our series data

        data.stackedBarChartData.forEach((item: { [x: string]: string | number; Month: any; Revenue: any; }) => {
          // Extract categories from 'Month'
          if (!categories.includes(item.Month)) {
            categories.push(item.Month);
          }

          // Prepare the dataset
          if (!seriesData[item['Invoice Month']]) {
            seriesData[item['Invoice Month']] = [];
          }
          seriesData[item['Invoice Month']].push(item.Revenue);
        });

        // Convert seriesData into the format required by ApexCharts
        const series = Object.keys(seriesData).map(key => {
          return {
            name: key,
            data: seriesData[key]
          };
        });

        // Update state with the new formatted data
        setStackedBarData(prevState => ({
          ...prevState,
          options: {
            ...prevState.options,
            xaxis: {
              ...prevState.options.xaxis,
              categories: categories, // Updating categories
            },
          },
          series: series, // Updating series
        }));
      })
      .catch(error => console.error('Error fetching data for the stacked bar chart:', error));
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

      <Card>
        <Title>Companies Revenue per Month</Title>
        <Chart
          options={stackedBarChartData.options}
          series={stackedBarChartData.series}
          type="bar"
          height={350}
        />

      </Card>
    </>
  );
}

export default App;