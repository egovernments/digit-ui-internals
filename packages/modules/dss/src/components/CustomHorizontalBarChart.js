import { ResponseComposer } from "@egovernments/digit-ui-react-components";
import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
  },
];

const CustomHorizontalBarChart = () => {
  return (
    <ResponsiveContainer width="99%" height={200}>
      <BarChart width="100%" height="100%" layout="vertical" data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis dataKey="name" type="category" />
        <XAxis type="number" />
        <Bar dataKey="uv" fill="#61A0FF" />
        <Bar dataKey="pv" fill="#F47738" />
        <Tooltip />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomHorizontalBarChart;
