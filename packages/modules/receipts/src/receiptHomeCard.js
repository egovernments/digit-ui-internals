import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRightInbox, Person } from "@egovernments/digit-ui-react-components";

const ArrowRight = ({ to }) => (
  <Link to={to}>
    <ArrowRightInbox />
  </Link>
);

const ReceiptsCard = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  // TODO: should be fetch
  // const { isLoading: hookLoading, isError, error, data, ...rest } = Digit.Hooks.hrms.useHRMSCount(tenantId);
  const total = 1;
  if (!Digit.Utils.mCollectAccess()) {
    return null;
  }
  return (
    <div className="employeeCard card-home card-home-receipts">
      <div className="complaint-links-container">
        <div className="header">
          <span className="logo">
            <Person />
          </span>
          <span className="text">{t("CR_RECEIPTS_HOME_LINK")}</span>
        </div>
        <div className="body">
          <div className="flex-fit">
            <div className="card-count">
              <div>
                {/* <span>{" " + data?.EmployeCount?.totalEmployee ? data?.EmployeCount?.totalEmployee : 0 || "-"}</span> */}
                <span>40(temp)</span>
              </div>
              <div>
                <Link to={`/digit-ui/employee/receipts/inbox`}>{t("CR_TOTAL_RECEIPTS")}</Link>
              </div>
            </div>
          </div>
          <span className="link">
            <Link to={`/digit-ui/employee/receipts/inbox`}>{t("CR_SEARCH_COMMON_HEADER")}</Link>
          </span>
          <span className="link">
            <Link to={`/digit-ui/employee/receipts/dashboard`}>{t("CR_HOME_HEADER_DASHBOARD")}</Link>
          </span>
          <span className="link">
            <Link to={`/digit-ui/employee/receipts/reports`}>{t("CR_HOME_HEADER_REPORT")}</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReceiptsCard;
