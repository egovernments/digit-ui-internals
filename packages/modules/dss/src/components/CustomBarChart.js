import React, { Fragment } from "react";
import { ResponsiveContainer, Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardHeader } from "@egovernments/digit-ui-react-components";

const data = [
  {
    headerName: "Rank",
    headerValue: 1,
    headerSymbol: "percentage",
    insight: null,
    plots: [
      {
        label: "DSS_TARGET_ACHIEVED",
        name: "pg.citya",
        value: 93,
        strValue: null,
        symbol: "percentage",
      },
      {
        label: "DSS_TARGET_ACHIEVED",
        name: "pg.cityb",
        value: 65,
        strValue: null,
        symbol: "percentage",
      },
      {
        label: "DSS_TARGET_ACHIEVED",
        name: "pg.cityc",
        value: 43,
        strValue: null,
        symbol: "percentage",
      },
    ],
  },
];

const CustomLabel = ({ x, y, name, stroke, value }) => {
  return (
    <>
      <text x={x} y={y} dx={-60} fill={stroke}>
        {`${value.toFixed(2)}%`}
      </text>
      <text x={x} y={y} dx={-150} fill={stroke}>
        {name}
      </text>
    </>
  );
};

const CustomBarChart = ({
  xDataKey = "value",
  xAxisType = "number",
  yAxisType = "category",
  yDataKey = "name",
  hideAxis = true,
  layout = "vertical",
  fillColor = "#00703C",
  showGrid = false,
}) => {
  return (
    <ResponsiveContainer width="99%" height={200}>
      <BarChart width="100%" height="100%" data={data?.[0]?.plots} layout={layout} maxBarSize={10} margin={{ left: 150 }}>
        {showGrid && <CartesianGrid />}
        <XAxis hide={hideAxis} dataKey={xDataKey} type={xAxisType} />
        <YAxis dataKey={yDataKey} hide={hideAxis} type={yAxisType} />
        <Bar dataKey={xDataKey} fill={fillColor} label={<CustomLabel />} radius={[10, 10, 10, 10]} stackId="x" />
        <Bar dataKey={(val) => 100} fill="#D6D5D4" label={false} radius={[0, 10, 10, 0]} stackId="x" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
