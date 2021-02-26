import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FsmCard = () => {
  const { t } = useTranslation();
  const DSO = Digit.UserService.hasAccess("FSM_DSO") || false;
  const COLLECTOR = Digit.UserService.hasAccess("FSM_COLLECTOR") || false;
  const FSM_EDITOR = Digit.UserService.hasAccess("FSM_EDITOR_EMP") || false;
  
  const isFSTPOperator = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;

  if(isFSTPOperator) {
    return <div className="employeeCard card-home">
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
                <span className="text">{t("ES_TITLE_VEHICLE_LOG")}</span>
              </div>
              <div className="body">
                <span className="link">
                  <Link to={`/digit-ui/employee/fsm/fstp-inbox`}>{t("ES_TITLE_INBOX")}</Link>
                </span>
              </div>
            </div>
          </div>
  }
  return <div className="employeeCard card-home">
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
          {!DSO && !COLLECTOR && !FSM_EDITOR && (
            <React.Fragment>
              <span className="link">
                <Link to={`/digit-ui/employee/fsm/new-application`}>{t("ES_TITLE_NEW_DESULDGING_APPLICATION")}</Link>
              </span>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
}
export default FsmCard