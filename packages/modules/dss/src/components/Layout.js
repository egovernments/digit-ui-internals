import React, { Fragment } from "react";
import CustomAreaChart from "./CustomAreaChart";
import CustomBarChart from "./CustomBarChart";
import CustomHorizontalBarChart from "./CustomHorizontalBarChart";
import CustomPieChart from "./CustomPieChart";
import CustomTable from "./CustomTable";
import GenericChart from "./GenericChart";
import MetricChart from "./MetricChart";
import Summary from "./Summary";

let index = 1;

const Layout = ({ rowData }) => {
  const renderChart = (chart, key) => {
    switch (chart.chartType) {
      case "table":
        return <CustomTable />;
      case "donut":
        return <CustomPieChart data={chart} />;
      case "line":
        return <CustomAreaChart data={chart} />;
      case "horizontalBar":
        return <CustomHorizontalBarChart />;
      default:
        return <CustomTable />;
    }
  };

  const renderVisualizer = (visualizer, key) => {
    switch (visualizer.vizType) {
      case "metric-collection":
        return (
          <GenericChart header={visualizer.name} className="metricsTable">
            <MetricChart data={visualizer} />
          </GenericChart>
        );
      case "chart":
        return (
          <GenericChart
            header={visualizer.name}
            showDownload={visualizer?.charts?.[0].chartType === "table"}
            showSearch={visualizer?.charts?.[0].chartType === "table"}
          >
            {/* {visualizer.charts.map((chart, key) => renderChart(chart, key))} */}
            {renderChart(visualizer?.charts?.[0])}
          </GenericChart>
        );
      case "performing-metric":
        return (
          <GenericChart header={visualizer.name}>
            <CustomBarChart fillColor={index++ % 2 ? "#00703C" : "#D4351C"} />
          </GenericChart>
        );
      case "collection":
      case "module":
        return <Summary key={key} ttile={visualizer.name} data={visualizer} />;
      case "pie":
        return (
          <GenericChart header={visualizer.name}>
            <CustomPieChart />
          </GenericChart>
        );
      case "table":
        return (
          <GenericChart header={visualizer.name} showSearch={true} showDownload={true}>
            <CustomTable />
          </GenericChart>
        );
    }
  };
  return <div className="chart-row">{rowData.vizArray.map((chart, key) => renderVisualizer(chart, key))}</div>;
};

export default Layout;
