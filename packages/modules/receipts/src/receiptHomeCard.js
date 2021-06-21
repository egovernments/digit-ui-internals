import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


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
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M0 0h24v24H0z" fill="none"></path>
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" fill="white"></path>
            </svg>
          </span>
          <span className="text">{t("ACTION_TEST_RECEIPTS")}</span>
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
