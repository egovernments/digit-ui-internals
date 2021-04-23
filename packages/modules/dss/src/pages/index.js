import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Header, Loader } from "@egovernments/digit-ui-react-components";
import config from "../chartconfig.json";
import CustomAreaChart from "../components/CustomAreaChart";
import CustomBarChart from "../components/CustomBarChart";
import CustomPieChart from "../components/CustomPieChart";
import Filters from "../components/Filters";
import GenericChart from "../components/GenericChart";
import MetricChart from "../components/MetricChart";
import Layout from "../components/Layout";
import Summary from "../components/Summary";

const DashBoard = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const stateCode = tenantId.split(".")[0];
  const moduleCode = "fsm";
  // const moduleCode = "propertytax";
  const mdmsType = "dss-dashboard";
  // const { data: dashData } = Digit.Hooks.dss.useDSSDashboard(stateCode, mdmsType, moduleCode);
  const { data: screenConfig } = Digit.Hooks.dss.useMDMS(stateCode, "dss-dashboard", "DssDashboard");
  const { data: response, isLoading } = Digit.Hooks.dss.useDashboardConfig(moduleCode);
  // console.log("find all data here", dashData, screenConfig);
  if (isLoading) {
    return <Loader />;
  }

  const dashboardConfig = response?.responseData;
  return (
    <>
      <Filters />
      <div style={{ marginLeft: "264px" }}>
        <Header>{t(dashboardConfig?.[0]?.name)}</Header>
        {dashboardConfig?.[0]?.visualizations.map((row, key) => (
          <Layout rowData={row} key={key} />
        ))}
      </div>
    </>
  );
};

export default DashBoard;
