import React from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardHeader, Loader } from "@egovernments/digit-ui-react-components";
import { startOfMonth, endOfMonth, sub, getTime } from "date-fns";

const getValue = (plot) => plot.value;

const CustomAreaChart = ({ xDataKey = "name", yDataKey = getValue, data }) => {
  const { id } = data;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const requestDate = {
    startDate: getTime(sub(startOfMonth(new Date()), { months: 12 })),
    endDate: getTime(endOfMonth(new Date())),
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
      <AreaChart width="100%" height="100%" data={response?.responseData?.data?.[0]?.plots}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF0000" stopOpacity={1} />
            <stop offset="95%" stopColor="#F89462" stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid />
        <Tooltip />
        <XAxis dataKey={xDataKey} />
        <YAxis dataKey={yDataKey} />
        <Legend verticalAlign="bottom" />
        <Area type="monotone" dataKey={yDataKey} stroke="#8884d8" fill="url(#colorUv)" dot={true} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CustomAreaChart;
