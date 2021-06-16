import { ActionBar, ApplyFilterBar, CheckBox, CloseSvg, Dropdown, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ReceiptsFilter = ({ searchParams, onFilterChange, onSearch, removeParam, ...props }) => {
  // const tenantId = );

  const [_searchParams, setSearchParams] = useState(() => searchParams);
  const { t } = useTranslation();

  const { data: dataReceipts, ...rest1 } = Digit.Hooks.receipts.useReceiptsMDMS(
    Digit.ULBService.getCurrentTenantId(),
    "ReceiptsBusinessServices"
  );

  const mdmsStatus = ["APPROVED", "REMITTED", "CANCELLED"];
  console.log(dataReceipts, rest1, 'mdms');
  const [status, setStatus] = useState([]);

  const [service, setService] = useState(null);

  useEffect(() => {
    if (service) {
      // setSearchParams({ status: instrumentStatus.code });
    }
  }, [service]);


  useEffect(() => {
    if (status) {
      // setSearchParams({ status: instrumentStatus.code });
    }
  }, [status]);

  const clearAll = () => {
    onFilterChange({ delete: Object.keys(searchParams) });


    setStatus(null);
    setService(null);
    props?.onClose?.();
  };
  return (
    <React.Fragment>
      <div className="filter">
        <div className="filter-card">
          <div className="heading">
            <div className="filter-label">{t("CR_COMMON_FILTER")}:</div>
            <div className="clearAll" onClick={clearAll}>
              {t("CR_COMMON_CLEAR_ALL")}
            </div>
            {props.type === "desktop" && (
              <span className="clear-search" onClick={clearAll} style={{ border: "1px solid #e0e0e0", padding: "6px" }}>
                <svg width="17" height="17" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74Z"
                    fill="#505A5F"
                  />
                </svg>
                {/* {t("ES_COMMON_CLEAR_ALL")} */}
              </span>
            )}
            {props.type === "mobile" && (
              <span onClick={props.onClose}>
                <CloseSvg />
              </span>
            )}
          </div>
          <div>
            <div>
              <div className="filter-label">{t("CR_COMMON_TABLE_COL_STATUS")}</div>
              {mdmsStatus.map((sta, index) =>
                <CheckBox
                  key={index + "service"}
                  label={t(`RC_${sta}`)}
                  value={sta}
                  checked={status}
                  onChange={(event) => setStatus(event, e.value)}
                />
              )}
              <div>

                <div className="filter-label">{t("CR_SERVICE_CATEGORY_LABEL ")}</div>
                <Dropdown t={t} option={dataReceipts?.dropdownData || null} selected={service} select={setService} optionKey={"name"} />
              </div>
              <div>
                <SubmitBar
                  // disabled={_.isEqual(_searchParams, searchParams)}
                  onSubmit={() => onFilterChange(_searchParams)}
                  label={t("ES_COMMON_APPLY")}
                />
              </div>
            </div>
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
              onSearch();
            }}
            style={{ flex: 1 }}
          />
        </ActionBar>
      )}
    </React.Fragment>
  );
};

export default ReceiptsFilter;
