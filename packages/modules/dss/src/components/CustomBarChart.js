import React, { Fragment, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { startOfMonth, endOfMonth, getTime } from "date-fns";
import { Loader } from "@egovernments/digit-ui-react-components";
import { ResponsiveContainer, Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import FilterContext from "./FilterContext";

const CustomLabel = ({ x, y, name, stroke, value }) => {
  const { t } = useTranslation();
  return (
    <>
      <text x={x} y={y} dx={-65} dy={10} fill={stroke} width="30">
        {`${value.toFixed(2)}%`}
      </text>
      <text x={x} y={y} dx={-170} dy={10}>
        {t(name)}
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
  data,
}) => {
  const { id } = data;
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
    key: id,
    type: "metric",
    tenantId,
    requestDate: value?.requestDate,
    filters: value?.filters,
  });

  const chartData =  useMemo(() => {
    if (!response) return null;
    return response?.responseData?.data?.map((bar) => {
      return {
        name: t(bar?.plots?.[0].name),
        value: bar?.plots?.[0].value
      }
    })
  }, [response])
  if (isLoading) {
    return <Loader />;
  }
  return (
    <ResponsiveContainer width="99%" height={320}>
      <BarChart width="100%" height="100%" data={chartData} layout={layout} maxBarSize={10} margin={{ left: 170 }} barGap={70}>
        {showGrid && <CartesianGrid />}
        <XAxis hide={hideAxis} dataKey={xDataKey} type={xAxisType} domain={[0, 100]} />
        <YAxis dataKey={yDataKey} hide={hideAxis} type={yAxisType} padding={{ right: 40 }} />
        <Bar
          dataKey={xDataKey}
          fill={fillColor}
          background={{ fill: "#D6D5D4", radius: 10 }}
          label={<CustomLabel stroke={fillColor} />}
          radius={[10, 10, 10, 10]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
