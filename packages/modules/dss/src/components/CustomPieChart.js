import React, { useContext } from "react";
import { startOfMonth, endOfMonth, getTime } from "date-fns";
import { ResponsiveContainer, Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { Card, Loader } from "@egovernments/digit-ui-react-components";
import FilterContext from "./FilterContext";

const data = [
  {
    headerName: "DSS_PT_COLLECTION_BY_USAGE_TYPE",
    headerValue: 6.5472716e7,
    headerSymbol: "amount",
    insight: null,
    plots: [
      {
        label: null,
        name: "Residential",
        value: 1.2734823e7,
        strValue: null,
        symbol: "amount",
      },
      {
        label: null,
        name: "Commercial",
        value: 5.2730168e7,
        strValue: null,
        symbol: "amount",
      },
      {
        label: null,
        name: "Industrial",
        value: 3.2730168e7,
        strValue: null,
        symbol: "amount",
      },
      {
        label: null,
        name: "Institutional",
        value: 4.2730168e7,
        strValue: null,
        symbol: "amount",
      },
      {
        label: null,
        name: "Mixed",
        value: 0.0,
        strValue: null,
        symbol: "amount",
      },
      {
        label: null,
        name: "Other Non-Residential",
        value: 0.0,
        strValue: null,
        symbol: "amount",
      },
    ],
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const CustomPieChart = ({ dataKey = "value", data }) => {
  const { id } = data;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { value } = useContext(FilterContext)
  const requestDate = {
    startDate: value?.range?.startDate,
    endDate: value?.range?.endDate,
    interval: "month",
    title: "",
  };
  const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
    key: id,
    type: "metric",
    tenantId,
    requestDate,
  });

  if (isLoading) {
    return <Loader />;
  }
  return (
    <ResponsiveContainer width="99%" height={300}>
      <PieChart>
        <Pie
          data={response?.responseData?.data?.[0]?.plots}
          dataKey={dataKey}
          cy={100}
          innerRadius={40}
          outerRadius={60}
          margin={{ bottom: 0, top: 5 }}
          fill="#8884d8"
          label={true}
          labelLine={false}
        >
          {response?.responseData?.data?.[0]?.plots.map((entry, index) => (
            <Cell key={`cell-`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="vertical" align="bottom" iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
