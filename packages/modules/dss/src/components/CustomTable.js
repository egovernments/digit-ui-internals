import React, { Fragment, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { startOfMonth, endOfMonth, getTime, subYears } from "date-fns";
import { UpwardArrow, TextInput, Loader, Table, RemoveableTag, Rating, DownwardArrow } from "@egovernments/digit-ui-react-components";
import FilterContext from "./FilterContext";

const CustomTable = ({ data, onSearch }) => {
  const { id } = data;
  const [chartKey, setChartKey] = useState(id);
  const [filterStack, setFilterStack] = useState([{ id: chartKey }]);
  const { t } = useTranslation();
  const { value, setValue, ulbTenants } = useContext(FilterContext);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const dssTenants = Digit.SessionStorage.get("DSS_TENANTS");
  const lastYearDate = {
    startDate: subYears(value?.range?.startDate, 1).getTime(),
    endDate: subYears(value?.range?.endDate, 1).getTime(),
    interval: "month",
    title: "",
  };
  const { isLoading: isRequestLoading, data: lastYearResponse } = Digit.Hooks.dss.useGetChart({
    key: chartKey,
    type: "metric",
    tenantId,
    requestDate: lastYearDate,
    filters:
      id === chartKey ? value?.filters : { [filterStack[filterStack.length - 1]?.filterKey]: filterStack[filterStack.length - 1]?.filterValue },
  });
  const { isLoading, data: response } = Digit.Hooks.dss.useGetChart({
    key: chartKey,
    type: "metric",
    tenantId,
    requestDate: { ...value?.requestDate, startDate: value?.range?.startDate?.getTime(), endDate: value?.range?.endDate?.getTime() },
    filters:
      id === chartKey ? value?.filters : { [filterStack[filterStack.length - 1]?.filterKey]: filterStack[filterStack.length - 1]?.filterValue },
  });

  const renderHeader = (plot) => {
    const code = `DSS_HEADER_${plot?.name.toUpperCase()}`;
    const units = ["TotalSeptageDumped", "TotalSeptageCollected"];
    if (id === "fsmVehicleLogReportByDDR" && units.includes(plot?.name)) {
      return `${t(code)} (${t("DSS_KL")})`;
    }
    if (plot?.symbol === "amount") {
      return `${t(code)} ${value.denomination !== "Unit" ? `(${value.denomination})` : ""}`;
    }
    return t(code);
  };

  const getDrilldownCharts = (value, filterKey) => {
    if (response?.responseData?.drillDownChartId && response?.responseData?.drillDownChartId !== "none") {
      let currentValue = value;
      if (filterKey === "tenantId") {
        currentValue = dssTenants.filter((tenant) => tenant?.city?.ddrName === value || tenant?.code === value).map(tenant => tenant?.code);
        if (currentValue === undefined) return;
      }
      setFilterStack([...filterStack, { id: response?.responseData?.drillDownChartId, name: value, filterKey, filterValue: currentValue }]);
      setChartKey(response?.responseData?.drillDownChartId);
    }
  };

  const sortRows = useCallback((rowA, rowB, columnId) => {
    const firstCell = rowA.values[columnId];
    const secondCell = rowB.values[columnId];
    let value1, value2;
    value1 = typeof firstCell === "object" ? firstCell?.value : firstCell;
    value2 = typeof secondCell === "object" ? secondCell?.value : secondCell;
    return typeof value1 === "number" ? value1 - value2 : value1.localeCompare(value2);
  }, []);

  const tableColumns = useMemo(
    () =>
      response?.responseData?.data?.[0]?.plots?.map((plot) => ({
        Header: renderHeader(plot),
        accessor: plot?.name.replaceAll(".", " "),
        symbol: plot?.symbol,
        sortType: sortRows,
        Cell: (args) => {
          const { value, column, row } = args;
          if (typeof value === "object") {
            let { insight, value: rowValue } = value;
            if (column.symbol === "amount") {
              rowValue = convertDenomination(rowValue);
            }
            return (
              <span>
                {rowValue}
                {` `}
                {insight >= 0 ? <UpwardArrow /> : <DownwardArrow />}
                {` `}
                {`${Math.abs(insight)}%`}
              </span>
            );
          }
          const filter = response?.responseData?.filter.find((elem) => elem.column === column.id);
          if (response?.responseData?.drillDownChartId !== "none" && filter !== undefined) {
            return (
              <span style={{ color: "#F47738", cursor: "pointer" }} onClick={() => getDrilldownCharts(value, filter?.key)}>
                {t(value)}
              </span>
            );
          }
          if (column.id === "CitizenAverageRating") {
            return <Rating id={row.id} currentRating={Math.round(value * 10) / 10} styles={{ width: "unset", marginBottom: 0 }} starStyles={{ width: "25px" }} />;
          }
          if (column.symbol === "amount") {
            return String(convertDenomination(value));
          }
          return String(t(value));
        },
      })),
    [response, value?.denomination]
  );

  const convertDenomination = (val) => {
    const { denomination } = value;
    switch (denomination) {
      case "Unit":
        return val;
      case "Lac":
        return Number((val / 100000).toFixed(2));
      case "Cr":
        return Number((val / 10000000).toFixed(2));
    }
  };

  const tableData = useMemo(() => {
    if (!response || !lastYearResponse) return;
    return response?.responseData?.data?.map((rows, id) => {
      const lyData = lastYearResponse?.responseData?.data?.find((lyRow) => lyRow?.headerName === rows?.headerName);
      return rows?.plots?.reduce((acc, row, currentIndex) => {
        let value = row?.value !== null ? row?.value : row?.label || "";
        let insight = null;
        if ((row.symbol === "number" || row.symbol === "percentage" || row.symbol === "amount") && row.name !== "CitizenAverageRating" && lyData !== undefined) {
          let prevData = lyData.plots[currentIndex].value;
          if (prevData === value) insight = 0;
          else insight = prevData === 0 ? 100 : Math.round(((value - prevData) / prevData) * 100);
        }
        if (typeof value === "number" && !Number.isInteger(value)) {
          value = Math.round((value + Number.EPSILON) * 100) / 100;
        }
        acc[row.name.replaceAll(".", " ")] = insight !== null ? { value, insight } : row?.name === "S.N." ? id + 1 : value;
        return acc;
      }, {});
    });
  }, [response, lastYearResponse]);

  const removeULB = (id) => {
    const nextState = filterStack.filter((filter, index) => index < id);
    setFilterStack(nextState);
    setChartKey(nextState[nextState.length - 1]?.id);
  };

  if (isLoading || isRequestLoading) {
    return <Loader />;
  }
  if (!tableColumns || !tableData) {
    return (
      <div className="no-data">
        <p>{t("DSS_NO_DATA")}</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      {filterStack.length > 1 && (
        <div className="tag-container">
          <span style={{ marginTop: "20px" }}>{t("DSS_FILTERS_APPLIED")}: </span>
          {filterStack.map((filter, id) => (id > 0 ? <RemoveableTag key={id} text={t(filter?.name)} onClick={() => removeULB(id)} /> : null))}
        </div>
      )}
      <Table
        className="customTable"
        t={t}
        disableSort={false}
        autoSort={true}
        manualPagination={false}
        initSortId="S N "
        onSearch={onSearch}
        data={tableData}
        totalRecords={tableData?.length}
        columns={tableColumns}
        getCellProps={(cellInfo) => {
          return {
            style: {},
          };
        }}
      />
    </div>
  );
};

export default CustomTable;
