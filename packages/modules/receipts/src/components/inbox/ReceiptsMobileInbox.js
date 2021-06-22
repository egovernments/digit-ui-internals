import React from "react";
import { useTranslation } from "react-i18next";
import { ApplicationCard } from "./ApplicationCard";

const ReceiptsMobileInbox = ({
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
  tableConfig,
  filterComponent,
  allLinks,
}) => {
  console.log(data);
  const { t } = useTranslation();
  const getData = () => {
    return data?.Payments?.map((dataObj) => {
    });
  };

  return (
    <div style={{ padding: 0 }}>
      <div className="inbox-container">
        <div className="filters-container">
          {/* {!isSearch && <ApplicationLinks linkPrefix={parentRoute} allLinks={allLinks} isMobile={true} />} */}
          <ApplicationCard
            t={t}
            data={getData()}
            onFilterChange={onFilterChange}
            isLoading={isLoading}
            isSearch={isSearch}
            onSearch={onSearch}
            onSort={onSort}
            searchParams={searchParams}
            searchFields={searchFields}
            linkPrefix={linkPrefix}
            sortParams={sortParams}
            filterComponent={filterComponent}
          />
        </div>
      </div>
    </div>
  );
};

export default ReceiptsMobileInbox;
