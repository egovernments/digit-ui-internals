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
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  // TODO: should be fetch
  const { isLoading: hookLoading, isError, error, data, ...rest } = Digit.Hooks.hrms.useHRMSCount(tenantId);
  const total = 1;

  return (
    <div className="employeeCard card-home-hrms">
      <div className="complaint-links-container">
        <div className="header">
          <span className="logo">
            <Person />
          </span>
          <span className="text">{t("HRMS")}</span>
        </div>
        <div className="body">
          <div className="flex-fit">
            <div className="card-count">
              <div>
                <span>{" " + data?.EmployeCount?.totalEmployee ? data?.EmployeCount?.totalEmployee : 0 || "-"}</span>
              </div>
              <div>
                <Link to={`/digit-ui/employee/hrms/inbox`}>{t("TOTAL_EMPLOYEES")}</Link>
              </div>
            </div>
            <div>
              <div>
                <span>{" " + data?.EmployeCount?.activeEmployee ? data?.EmployeCount?.activeEmployee : 0 || "-"}</span>
              </div>
              <div>
                <Link to={`/digit-ui/employee/hrms/inbox`}>{t("ACTIVE_EMPLOYEES")}</Link>
              </div>
            </div>
          </div>
          <span className="link">
            <Link to={`/digit-ui/employee/hrms/inbox`}>{t("HR_HOME_SEARCH_RESULTS_HEADING")}</Link>
          </span>
          <span className="link">
            <Link to={`/digit-ui/employee/hrms/create`}>{t("HR_COMMON_CREATE_EMPLOYEE_HEADER")}</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default HRMSCard;
