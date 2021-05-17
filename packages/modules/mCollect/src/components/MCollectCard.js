import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRightInbox, PropertyHouse } from "@egovernments/digit-ui-react-components";

const ArrowRight = ({ to }) => (
  <Link to={to}>
    <ArrowRightInbox />
  </Link>
);

const MCollectCard = () => {
  const { t } = useTranslation();
  // TODO: should be fetch
  const total = 1;

  if (!Digit.Utils.ptAccess()) {
    return null;
  }

  return (
    <div className="employeeCard card-home">
      <div className="complaint-links-container">
        <div className="header">
          <span className="logo">
            <PropertyHouse />
          </span>
          <span className="text">{t("UC_COMMON_HEADER_SEARCH")}</span>
        </div>
        <div className="body">
          <span className="link">
            <Link to={`/digit-ui/employee/mcollect/inbox`}>{t("ES_TITLE_INBOX")}</Link>
            <span className="inbox-total">{" " + total || "-"}</span>
            {<ArrowRight to={`/digit-ui/employee/mcollect/inbox`} />}
          </span>
          <span className="link">
            <Link to={`/digit-ui/employee/mcollect/new-application`}>{t("ES_TITLE_NEW_REGISTRATION")}</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MCollectCard;
