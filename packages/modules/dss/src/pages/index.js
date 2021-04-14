import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
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
  const {} = Digit.Hooks.dss.useMDMS(stateCode, "dss-dashboard", "DssDashboard");
  const {} = Digit.Hooks.dss.useDashboardConfig();
  const dashboardConfig = config?.responseData;
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

export default DashBoard