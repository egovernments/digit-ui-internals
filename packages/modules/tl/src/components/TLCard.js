import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRightInbox, PropertyHouse } from "@egovernments/digit-ui-react-components";

const ArrowRight = ({ to }) => (
  <Link to={to}>
    <ArrowRightInbox />
  </Link>
);

const TLCard = () => {
  const { t } = useTranslation();
  // TODO: should be fetch
  const total = 1;

  // if (!Digit.Utils.ptAccess()) {
  //   return null;
  // }

  return (
    <div className="employeeCard card-home">
      <div className="complaint-links-container">
        <div className="header">
          <span className="logo">
            <PropertyHouse />
          </span>
          <span className="text">{t("Trade License")}</span>
        </div>
        <div className="body">
          <span className="link">
            <Link to={`/digit-ui/employee/tl/new-application`}>{t("New trade License")}</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TLCard;
