import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";

import DesktopInbox from "../../components/inbox/DesktopInbox";
// import MobileInbox from "../../components/MobileInbox";

const Inbox = ({
  parentRoute,
  businessService = "TL",
  initialStates = {},
  filterComponent,
  isInbox
}) => {

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [enableSarch, setEnableSearch] = useState(() => (isInbox ? {} : { enabled: false }));

  const { t } = useTranslation();
  const [pageOffset, setPageOffset] = useState(initialStates.pageOffset || 0);
  const [pageSize, setPageSize] = useState(initialStates.pageSize || 10);
  const [sortParams, setSortParams] = useState(initialStates.sortParams || [{ id: "applicationDate", desc: false }]);

  const [searchParams, setSearchParams] = useState(() => {
    return initialStates.searchParams || {};
  });


  let isMobile = window.Digit.Utils.browser.isMobile();
  let paginationParams = isMobile
    ? { limit: 100, offset: 0, sortBy: sortParams?.[0]?.id, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" }
    : { limit: pageSize, offset: pageOffset, sortBy: sortParams?.[0]?.id, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" };

  const { isFetching, isLoading: hookLoading, searchResponseKey, data, searchFields, ...rest } = Digit.Hooks.tl.useInbox({
      tenantId,
      filters: { ...searchParams, ...paginationParams, sortParams },
      config:{}
    });

  useEffect(() => {
    setPageOffset(0);
  }, [searchParams]);

  const fetchNextPage = () => {
    setPageOffset((prevState) => prevState + pageSize);
  };

  const fetchPrevPage = () => {
    setPageOffset((prevState) => prevState - pageSize);
  };

  const handleFilterChange = (filterParam) => {
    let keys_to_delete = filterParam?.delete;
    console.log(keys_to_delete);
    let _new = {};
    if (isMobile) {
      _new = { ...filterParam };
    } else {
      _new = { ...searchParams, ...filterParam };
    }
    // let _new = { ...searchParams, ...filterParam };
    // if (keys_to_delete) keys_to_delete.forEach((key) => delete _new[key]);
    // delete filterParam.delete;
    if (keys_to_delete) keys_to_delete.forEach((key) => delete _new[key]);
    delete _new.delete;
    delete filterParam.delete;
    setSearchParams({ ..._new });
    setEnableSearch({ enabled: true });
  };

  const handleSort = useCallback((args) => {
    if (args.length === 0) return;
    setSortParams(args);
  }, []);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const getSearchFields = () => {
    return [
      {
        label: t("TL_HOME_SEARCH_RESULTS_APP_NO_LABEL"),
        name: "applicationNo",
      },
      {
        label: t("CORE_COMMON_MOBILE_NUMBER"),
        name: "mobileNumber",
        maxlength: 10,
        pattern: "[6-9][0-9]{9}",
        title: t("ES_SEARCH_APPLICATION_MOBILE_INVALID"),
        componentInFront: "+91",
      },
    ];
  };


  //DONOT DELETE NEEDS IMPOVEMENT
  // const tenantId = Digit.ULBService.getCurrentTenantId();
  // const { t } = useTranslation();

  // const isMobile = window.Digit.Utils.browser.isMobile();

  // // let paginationParams = isMobile
  // //   ? { limit: 100, offset: 0, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" }
  // //   : { limit: pageSize, offset: pageOffset, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" };

  // const [ filters, setFilters, clearFilter ] = Digit.Hooks.useSessionStorage(`${businessService}.${tenantId}`, {
  //   offset: 0,
  //   limit: 10,
  //   applicationType: "NEW"
  // })

  // const { inbox: inboxData, wf: wfData, isLoading: dataLoading } = Digit.Hooks.tl.useInbox({
  //   tenantId,
  //   filters,
  //   config:{}
  // })

    if (isMobile) {
      return (
    <h5>Open In Desktop</h5>)
    } else {
      return         <div>
                {isInbox && <Header>{t("ES_COMMON_INBOX")}</Header>}
                <DesktopInbox
                    businessService={businessService}
                    data={data}
                    tableConfig={rest?.tableConfig}
                    isLoading={hookLoading}
                    defaultSearchParams={initialStates.searchParams}
                    isSearch={!isInbox}
                    onFilterChange={handleFilterChange}
                    searchFields={getSearchFields()}
                    onSearch={handleFilterChange}
                    onSort={handleSort}
                    onNextPage={fetchNextPage}
                    onPrevPage={fetchPrevPage}
                    currentPage={Math.floor(pageOffset / pageSize)}
                    pageSizeLimit={pageSize}
                    disableSort={false}
                    onPageSizeChange={handlePageSizeChange}
                    parentRoute={parentRoute}
                    searchParams={searchParams}
                    sortParams={sortParams}
                    totalRecords={Number(data?.[0]?.totalCount)}
                    filterComponent={filterComponent}
                />
                </div>
    }
};

export default Inbox;
