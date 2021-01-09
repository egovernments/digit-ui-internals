import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { PGRLinks } from "@egovernments/digit-ui-module-pgr/src/Module";
import { FSMLinks } from "@egovernments/digit-ui-module-fsm/src/Module";
import ActionCard from "./dashboardCards/ActionCard";
import useDashboardData from "./hooks/useDashboardData";

const CitizenHome = ({ modules }) => {
  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const registry = useContext(ComponentProvider);

  return (
    <React.Fragment>
      {modules.map(({ code }, index) => {
        const Links = registry.getComponent(`${code}Links`);
        return <Links key={index} matchPath={`/digit-ui/citizen/${code.toLowerCase()}`} userType={"citizen"} />;
      })}
    </React.Fragment>
  );
};

const links = [{ text: "New Complaint", link: "/digit-ui/employee/pgr/complaint/create", accessTo: "CSR" }];

const EmployeeHome = ({ stats }) => <ActionCard type="dashboard" header="COMPLAINTS" links={links} stats={stats} />;

export const AppHome = ({ userType }) => {
  let data = useDashboardData();
  let { count } = data.count;
  let stats = { total: { text: "Total", count: count }, remaining: { text: "Nearing SLA", count: "24" }, inbox: 12 };

  if (userType === "citizen") {
    return <CitizenHome modules={modules} />;
  }
  return <EmployeeHome stats={stats} />;
};
