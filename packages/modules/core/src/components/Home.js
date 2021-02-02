import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

const allLinks = [
  { text: "Inbox", link: "/digit-ui/employee/pgr/inbox" },
  { text: "New Complaint", link: "/digit-ui/employee/pgr/complaint/create", accessTo: ["CSR"] },
];

const EmployeeHome = () => {
  const { t } = useTranslation();

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
                      <Link to={link.link}>{link.text}</Link>
                    </span>
                  );
                }
              })}
            </div>
          </div>
        </div>

        {/* FSM Card */}
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
              <span className="text">{t("ES_TITLE_FAECAL_SLUDGE_MGMT")}</span>
            </div>
            <div className="body">
              <span className="link">
                <Link to={`/digit-ui/employee/fsm/inbox`}>{t("ES_TITLE_INBOX")}</Link>
              </span>
              <span className="link">
                <Link to={`/digit-ui/employee/fsm/new-application`}>{t("ES_TITLE_NEW_DESULDGING_APPLICATION")}</Link>
              </span>
              <span className="link">
                <Link to={`/digit-ui/employee/fsm/application-audit`}>{t("ES_TITLE_APPLICATION_AUDIT")}</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AppHome = ({ userType, modules }) => {
  if (userType === "citizen") {
    return <CitizenHome modules={modules} />;
  }
  return <EmployeeHome />;
};
