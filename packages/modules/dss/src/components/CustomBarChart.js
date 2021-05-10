import React, { Fragment, useContext } from "react";
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
    <ResponsiveContainer width="99%" height={200}>
      <BarChart width="100%" height="100%" data={response?.responseData?.data?.[0]?.plots} layout={layout} maxBarSize={10} margin={{ left: 170 }}>
        {showGrid && <CartesianGrid />}
        <XAxis hide={hideAxis} dataKey={xDataKey} type={xAxisType} />
        <YAxis dataKey={yDataKey} hide={hideAxis} type={yAxisType} padding={{ right: 40 }} />
        <Bar dataKey={xDataKey}
          fill={fillColor}
          background={{ fill: "#D6D5D4", radius: 10  }}
          label={<CustomLabel stroke={fillColor} />}
          radius={[10, 10, 10, 10]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
