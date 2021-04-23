import React, { Fragment } from "react";
import { Card, CardSubHeader } from "@egovernments/digit-ui-react-components";
import { startOfMonth, endOfMonth, getTime } from "date-fns";

const MetricData = ({ data }) => {
  const displaySymbol = (type) => {
    switch (type) {
      case "Amount":
        return "₹";
      case "number":
        return "";
      default:
        return "";
    }
  };

  return (
    <div>
      <p className="heading-m" style={{ textAlign: "right", paddingTop: "0px" }}>{`${displaySymbol(data.headerSymbol)} ${+data.headerValue.toFixed(
        1
      )}`}</p>
      {data.insight && (
        <div>
          <p className={`${data.insight.colorCode}`}>{data.insight.value}</p>
        </div>
      )}
    </div>
  );
};

const res = {
  headerName: "DSS_TOTAL_COLLECTION",
  headerValue: 0.0,
  headerSymbol: "Amount",
  insight: {
    name: "INSIGHTS",
    value: "-100% than last year",
    indicator: "lower_red",
    colorCode: "lower_red",
  },
  plots: [],
};

const MetricChartRow = ({ data }) => {
  const { id, chartType } = data;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const requestDate = {
    startDate: getTime(startOfMonth(new Date())),
    endDate: getTime(endOfMonth(new Date())),
    interval: "month",
    title: "",
  };
  const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
    key: id,
    type: chartType,
    tenantId,
    requestDate,
  });

  if (isLoading) {
    return false;
  }

  return (
    <div className="row">
      <div>{data.name}</div>
      <MetricData data={response?.responseData?.data?.[0]} />
      {/* <div>{`${displaySymbol(response.headerSymbol)} ${response.headerValue}`}</div> */}
    </div>
  );
};

const MetricChart = ({ data }) => {
  const { charts } = data;

  return (
    <>
      {charts.map((chart, index) => (
        <MetricChartRow data={chart} />
      ))}
    </>
  );
};

export default MetricChart;
