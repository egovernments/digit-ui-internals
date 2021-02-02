import React from "react";
import { ActionLinks, CheckPoint } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import StarRated from "./StarRated";
import { useTranslation } from "react-i18next";
import Reopen from "./reopen";
//const GetTranslatedAction = (action, t) => t(`CS_COMMON_${action}`);

const Resolved = ({ action, nextActions, rating, serviceRequestId, reopenDate, isCompleted }) => {
  const { t } = useTranslation();

  if (action === "RESOLVE") {
    let actions =
      nextActions &&
      nextActions.map((action, index) => {
        if (action && action !== "COMMENT") {
          return (
            <Link key={index} to={`/digit-ui/citizen/pgr/${action.toLowerCase()}/${serviceRequestId}`}>
              <ActionLinks>{action}</ActionLinks>
            </Link>
          );
        }
      });
    return <CheckPoint isCompleted={isCompleted} label={t(`CS_COMMON_COMPLAINT_RESOLVED`)} customChild={<div>{actions}</div>} />;
  } else if (action === "RATE" && rating) {
    return (
      <CheckPoint
        isCompleted={isCompleted}
        label={t(`CS_COMMON_COMPLAINT_RESOLVED`)}
        customChild={<StarRated text={t("CS_ADDCOMPLAINT_YOU_RATED")} rating={rating} />}
      />
    );
  } else if (action === "REOPEN") {
    return <CheckPoint isCompleted={isCompleted} label={t(`CS_COMMON_COMPLAINT_REOPENED`)} info={reopenDate} />;
  } else {
    let actions =
      nextActions &&
      nextActions.map((action, index) => {
        if (action && action !== "COMMENT") {
          return (
            <Link key={index} to={`/digit-ui/citizen/pgr/${action.toLowerCase()}/${serviceRequestId}`}>
              <ActionLinks>{action}</ActionLinks>
            </Link>
          );
        }
      });
    return <CheckPoint isCompleted={isCompleted} label={t(`CS_COMMON_COMPLAINT_RESOLVED`)} customChild={<div>{actions}</div>} />;
  }
};

export default Resolved;
