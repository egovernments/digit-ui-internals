import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApplicationCard } from "./inbox/ApplicationCard";
import ApplicationLinks from "./inbox/ApplicationLinks";

const GetSlaCell = (value) => {
  if (isNaN(value)) return <span className="sla-cell-success">0</span>;
  return value < 0 ? <span className="sla-cell-error">{value}</span> : <span className="sla-cell-success">{value}</span>;
};

const GetCell = (value) => <span className="sla-cell">{value}</span>;

const MobileInbox = ({
  data,
  isLoading,
  isSearch,
  searchFields,
  onFilterChange,
  onSearch,
  onSort,
  parentRoute,
  searchParams,
  sortParams,
  linkPrefix,
}) => {
  const { t } = useTranslation();
  const getData = () => {
    if (isSearch) {
      return data?.map(({ propertyId, owner, locality, propertyStatus, taxDue, action }) => ({
        [t("ES_INBOX_UNIQUE_PROPERTY_ID")]: GetCell(propertyId),
        [t("ES_INBOX_OWNER_NAME")]: GetCell(owner),
        [t("ES_INBOX_LOCALITY")]: GetCell(locality),
        [t("ES_SEARCH_PROPERTY_STATUS")]: GetCell(propertyStatus),
        [t("ES_SEARCH_TAX_DUE")]: GetSlaCell(taxDue),
        [t("ES_SEARCH_ACTION")]: GetSlaCell(action),
      }));
    } else {
      return data?.map(({ applicationNo, propertyId, owner, applicationType, status, sla }) => ({
        [t("ES_INBOX_APPLICATION_NO")]: applicationNo,
        [t("ES_INBOX_UNIQUE_PROPERTY_ID")]: GetCell(propertyId),
        [t("ES_INBOX_OWNER")]: GetCell(owner),
        [t("ES_INBOX_APPLICATION_TYPE")]: GetCell(applicationType),
        [t("ES_INBOX_STATUS")]: GetCell(status),
        [t("ES_INBOX_SLA_DAYS_REMAINING")]: GetSlaCell(sla),
      }));
    }
  };

  return (
    <div style={{ padding: 0 }}>
      <div className="inbox-container">
        <div className="filters-container">
          {!isSearch && <ApplicationLinks linkPrefix={parentRoute} isMobile={true} />}
          <ApplicationCard
            t={t}
            data={getData()}
            onFilterChange={onFilterChange}
            serviceRequestIdKey={t("ES_INBOX_APPLICATION_NO")}
            isLoading={isLoading}
            isSearch={isSearch}
            onSearch={onSearch}
            onSort={onSort}
            searchParams={searchParams}
            searchFields={searchFields}
            linkPrefix={linkPrefix}
            sortParams={sortParams}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileInbox;
