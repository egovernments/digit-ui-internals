import React from "react";
import { ActionBar, CloseSvg } from "@egovernments/digit-ui-react-components";
import { ApplyFilterBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import Status from "./Status";
import ServiceCategory from "./ServiceCategory";

const Filter = ({ searchParams, onFilterChange, onSearch, removeParam, ...props }) => {
  const { t } = useTranslation();

  const onStatusChange = (e, type) => {
    debugger;
    if (e.target.checked) onFilterChange({ applicationStatus: [...searchParams?.applicationStatus, type] });
    else onFilterChange({ applicationStatus: searchParams?.applicationStatus.filter((option) => type.name !== option.name) });
  };

  const clearAll = () => {
    onFilterChange({ applicationStatus: [] });
    props?.onClose?.();
  };

  return (
    <React.Fragment>
      <div className="filter">
        <div className="filter-card">
          <div className="heading">
            <div className="filter-label">{t("ES_COMMON_FILTER_BY")}:</div>
            <div className="clearAll" onClick={clearAll}>
              {t("ES_COMMON_CLEAR_ALL")}
            </div>
            {props.type === "desktop" && (
              <span className="clear-search" onClick={clearAll}>
                {t("ES_COMMON_CLEAR_ALL")}
              </span>
            )}
            {props.type === "mobile" && (
              <span onClick={props.onClose}>
                <CloseSvg />
              </span>
            )}
          </div>
          <div>
            <Status
              translatePrefix={props.translatePrefix}
              businessService={props.businessService}
              onAssignmentChange={onStatusChange}
              fsmfilters={searchParams}
            />
          </div>
          <div>
            <ServiceCategory
              translatePrefix={props.translatePrefix}
              businessService={props.businessService}
              onAssignmentChange={onStatusChange}
              fsmfilters={searchParams}
            />
          </div>
        </div>
      </div>
      {props.type === "mobile" && (
        <ActionBar>
          <ApplyFilterBar
            submit={false}
            labelLink={t("ES_COMMON_CLEAR_ALL")}
            buttonLink={t("ES_COMMON_FILTER")}
            onClear={clearAll}
            onSubmit={() => {
              if (props.type === "mobile") onSearch({ delete: ["applicationNos"] });
              else onSearch();
            }}
            style={{ flex: 1 }}
          />
        </ActionBar>
      )}
    </React.Fragment>
  );
};

export default Filter;
