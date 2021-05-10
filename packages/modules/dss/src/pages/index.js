import React, { Fragment, useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import { Header, Loader, ShareIcon, DownloadIcon, FilterIcon } from "@egovernments/digit-ui-react-components";
import { startOfYear, endOfYear, getTime, format, addMonths } from "date-fns";
import Filters from "../components/Filters";
import Layout from "../components/Layout";
import FilterContext from "../components/FilterContext";

const getInitialRange = () => {
  const startDate = addMonths(startOfYear(new Date()), 3);
  const endDate = addMonths(endOfYear(new Date()), 3);
  const title = `${format(startDate, "MMM d, yy")} - ${format(endDate, "MMM d, yy")}`;
  const duration = Digit.Utils.dss.getDuration(startDate, endDate);
  return { startDate, endDate, title, duration };
};

const DashBoard = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const [filters, setFilters] = useState((data) => ({
    denomination: data?.denomination || "Unit",
    range: data?.range || getInitialRange(),
    requestDate: {
      startDate: data?.range?.startDate.getTime() || getInitialRange().startDate.getTime(),
      endDate: data?.range?.endDate.getTime() || getInitialRange().endDate.getTime(),
      interval: "month",
      title: "",
    },
    filters: {
      tenantId: data?.filters?.tenantId || [],
    },
  }));
  const provided = useMemo(
    () => ({
      value: filters,
      setValue: setFilters,
    }),
    [filters]
  );
  const stateCode = tenantId.split(".")[0];
  const moduleCode = "fsm";
  // const moduleCode = "propertytax";
  const mdmsType = "dss-dashboard";
  // const { data: dashData } = Digit.Hooks.dss.useDSSDashboard(stateCode, mdmsType, moduleCode);
  const { data: screenConfig } = Digit.Hooks.dss.useMDMS(stateCode, "dss-dashboard", "DssDashboard");
  const { data: response, isLoading } = Digit.Hooks.dss.useDashboardConfig(moduleCode);
  const { data: ulbTenants } = Digit.Hooks.useModuleTenants("FSM");
  const fullPageRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => fullPageRef.current,
  });

  if (isLoading) {
    return <Loader />;
  }

  const dashboardConfig = response?.responseData;
  return (
    <FilterContext.Provider value={provided}>
      <div className="chart-wrapper" ref={fullPageRef}>
        <div className="options">
          <div className="mrlg">
            <ShareIcon className="mrsm" />
            {t(`ES_DSS_SHARE`)}
          </div>
          <div className="mrsm" onClick={handlePrint}>
            <DownloadIcon className="mrsm" />
            {t(`ES_DSS_DOWNLOAD`)}
          </div>
        </div>
        <Header>{t(dashboardConfig?.[0]?.name)}</Header>
        <Filters t={t} ulbTenants={ulbTenants} />
        <div className="options-m">
          <div>
            <FilterIcon style />
          </div>
          <div>
            <ShareIcon />
            {t(`ES_DSS_SHARE`)}
          </div>
          <div>
            <DownloadIcon />
            {t(`ES_DSS_DOWNLOAD`)}
          </div>
        </div>
        {dashboardConfig?.[0]?.visualizations.map((row, key) => {
          if (row.row === 4) return null;
          return <Layout rowData={row} key={key} />;
        })}
      </div>
    </FilterContext.Provider>
  );
};

export default DashBoard;
