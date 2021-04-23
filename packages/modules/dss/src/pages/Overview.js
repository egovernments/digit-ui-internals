import React from "react";
import { useTranslation } from "react-i18next";
import { CardLabel, Header, Loader, Poll } from "@egovernments/digit-ui-react-components";
import Summary from "../components/Summary";
import Layout from "../components/Layout";

const response = [
  {
    title: "Total Collections",
    todayValue: 15012,
    monthValue: 15.2,
    target: "72%",
    task: 133,
    monthlyTask: 4500,
    sla: "91%",
    logo: <Poll />,
  },
  {
    title: "Property Tax",
    todayValue: 15012,
    monthValue: 15.2,
    target: "72%",
    task: 133,
    monthlyTask: 4500,
    sla: "91%",
    logo: <Poll />,
  },
  {
    title: "Trade License",
    todayValue: 15012,
    monthValue: 15.2,
    target: "72%",
    task: 133,
    monthlyTask: 4500,
    sla: "91%",
    logo: <Poll />,
  },
];
const Overview = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const moduleCode = "home";
  const { data: response, isLoading } = Digit.Hooks.dss.useDashboardConfig(moduleCode);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Header>{t(response?.[0]?.name)}</Header>
      {response?.responseData?.[0]?.visualizations.map((item, key) => (
        <Layout rowData={item} key={key} />
        // <Summary
        //   key={key}
        //   title={item.title}
        //   todayValue={item.todayValue}
        //   monthValue={item.monthValue}
        //   target={item.target}
        //   task={item.task}
        //   monthlyTask={item.monthlyTask}
        //   sla={item.sla}
        //   logo={item.logo}
        // />
      ))}
    </div>
  );
};

export default Overview;
