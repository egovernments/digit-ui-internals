import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRightInbox, Person } from "@egovernments/digit-ui-react-components";

const ArrowRight = ({ to }) => (
  <Link to={to}>
    <ArrowRightInbox />
  </Link>
);

const HRMSCard = () => {
  const ADMIN = Digit.Utils.hrmsAccess();

  if (!ADMIN) {
    return null;
  }
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const { t } = useTranslation();
  // TODO: should be fetch
  const { isLoading: hookLoading, isError, error, data, ...rest } = Digit.Hooks.hrms.useHRMSCount(tenantId);
  const total = 1;

  return (
    <div className="employeeCard card-home-hrms" style={{ display: "inline-block" }}>
      <div className="complaint-links-container">
        <div className="header">
          <span className="logo">
            <svg width="24" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M25.6667 10.3333C28.4334 10.3333 30.65 8.1 30.65 5.33333C30.65 2.56666 28.4334 0.333328 25.6667 0.333328C22.9 0.333328 20.6667 2.56666 20.6667 5.33333C20.6667 8.1 22.9 10.3333 25.6667 10.3333ZM12.3334 10.3333C15.1 10.3333 17.3167 8.1 17.3167 5.33333C17.3167 2.56666 15.1 0.333328 12.3334 0.333328C9.56669 0.333328 7.33335 2.56666 7.33335 5.33333C7.33335 8.1 9.56669 10.3333 12.3334 10.3333ZM12.3334 13.6667C8.45002 13.6667 0.666687 15.6167 0.666687 19.5V23.6667H24V19.5C24 15.6167 16.2167 13.6667 12.3334 13.6667ZM25.6667 13.6667C25.1834 13.6667 24.6334 13.7 24.05 13.75C25.9834 15.15 27.3334 17.0333 27.3334 19.5V23.6667H37.3334V19.5C37.3334 15.6167 29.55 13.6667 25.6667 13.6667Z"
                fill="white"
              />
            </svg>
          </span>
          <span className="text">{t("HRMS")}</span>
        </div>
        <div className="body" style={{ margin: "0px", padding: "0px" }}>
          <div
            className="flex-fit"
            style={{
              borderBottom: "1px solid #d6d5d4",
              padding: "15px 10px 10px",
              width: "100%",
              paddingLeft: "3rem",
              paddingBottom: "1rem",
            }}
          >
            <div className="card-count">
              <div>
                <span style={{ fontWeight: "800" }}>{" " + data?.EmployeCount?.totalEmployee ? data?.EmployeCount?.totalEmployee : 0 || "-"}</span>
              </div>
              <div>
                <Link to={`/digit-ui/employee/hrms/inbox`}>{t("TOTAL_EMPLOYEES")}</Link>
              </div>
            </div>
            <div>
              <div>
                <span style={{ fontWeight: "800" }}>{" " + data?.EmployeCount?.activeEmployee ? data?.EmployeCount?.activeEmployee : 0 || "-"}</span>
              </div>
              <div>
                <Link to={`/digit-ui/employee/hrms/inbox`}>{t("ACTIVE_EMPLOYEES")}</Link>
              </div>
            </div>
          </div>
          <div style={{ paddingLeft: "3rem", paddingBottom: "1rem" }}>
            <span className="link">
              <Link to={`/digit-ui/employee/hrms/inbox`}>{t("HR_HOME_SEARCH_RESULTS_HEADING")}</Link>
            </span>
            <span className="link">
              <Link to={`/digit-ui/employee/hrms/create`}>{t("HR_COMMON_CREATE_EMPLOYEE_HEADER")}</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRMSCard;
