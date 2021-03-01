import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const CitizenHome = ({ modules }) => {
  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const registry = useContext(ComponentProvider);

  console.log(registry);
  const paymentModule = modules.filter(({ code }) => code === "Payment")[0];
  const moduleArr = modules.filter(({ code }) => code !== "Payment");
  const moduleArray = [paymentModule, ...moduleArr];

  return (
    <React.Fragment>
      {moduleArray.map(({ code }, index) => {
        //console.log("in module map", code);
        const Links = Digit.ComponentRegistryService.getComponent(`${code}Links`) || (() => <React.Fragment />);
        return <Links key={index} matchPath={`/digit-ui/citizen/${code.toLowerCase()}`} userType={"citizen"} />;
      })}
    </React.Fragment>
  );
};

const allLinks = [
  { text: "ES_TITLE_INBOX", link: "/digit-ui/employee/pgr/inbox" },
  { text: "ES_TITLE_NEW_DESULDGING_APPLICATION", link: "/digit-ui/employee/pgr/complaint/create", accessTo: ["CSR"] },
];

const EmployeeHome = ({ modules }) => {
  const allModules = modules.filter(({ code }) => code === "FSM");
  const moduleCards = allModules.map((module) => Digit.ComponentRegistryService.getComponent(`${module.code}Card`));

  const addModuleCards = () => {
    return moduleCards.map((Card) => {
      return <Card />;
    });
  };

  return (
    <div className="employee-app-container">
      <div className="ground-container">
        {/* PGR Card */}
        <div className="employeeCard card-home">
          <div className="complaint-links-container">
            <div className="header">
              <span className="logo">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                  <path d="M0 0h24v24H0z" fill="none"></path>
                  <path
                    d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"
                    fill="white"
                  ></path>
                </svg>
              </span>
              <span className="text">Complaints</span>
            </div>
            <div className="body">
              {allLinks.map((link, index) => {
                if (!link.accessTo || Digit.UserService.hasAccess(link.accessTo)) {
                  return (
                    <span className="link" key={index}>
                      <Link to={link.link}>{t(link.text)}</Link>
                    </span>
                  );
                }
              })}
            </div>
          </div>
        </div>
        {addModuleCards()}
      </div>
    </div>
  );
};

export const AppHome = ({ userType, modules }) => {
  if (userType === "citizen") {
    return <CitizenHome modules={modules} />;
  }
  return <EmployeeHome modules={modules} />;
};
