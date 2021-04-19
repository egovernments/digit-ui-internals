import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Header } from "@egovernments/digit-ui-react-components";

import DesktopInbox from "../../components/DesktopInbox";
import MobileInbox from "../../components/MobileInbox";

const Inbox = ({ parentRoute, businessService = "PT", initialStates = {}, filterComponent = "PT_INBOX_FILTER" }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo.info.roles;

  const { t } = useTranslation();
  const [pageOffset, setPageOffset] = useState(initialStates.pageOffset || 0);
  const [pageSize, setPageSize] = useState(initialStates.pageSize || 10);
  const [sortParams, setSortParams] = useState(initialStates.sortParams || [{ id: "createdTime", desc: false }]);
  const [isInbox, setIsInbox] = useState(true);
  const [searchParams, setSearchParams] = useState(() => {
    return initialStates.searchParams || {};
  });

  let isMobile = window.Digit.Utils.browser.isMobile();
  let paginationParams = isMobile
    ? { limit: 100, offset: 0, sortBy: sortParams?.[0]?.id, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" }
    : { limit: pageSize, offset: pageOffset, sortBy: sortParams?.[0]?.id, sortOrder: sortParams?.[0]?.desc ? "DESC" : "ASC" };

  const {
    isLoading: hookLoading,
    searchResponseKey,
    businessIdsParamForSearch,
    businessIdAliasForSearch,
    data,
    searchFields,
    ...rest
  } = Digit.Hooks.useInboxGeneral({
    tenantId,
    businessService,
    isInbox,
    filters: { ...searchParams, ...paginationParams, sortParams },
  });

  useEffect(() => {
    console.log("data from the hook", hookLoading, rest);
  }, [hookLoading, rest]);

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
    let keys_to_delete = filterParam.delete;
    let _new = { ...searchParams };
    if (keys_to_delete) keys_to_delete.forEach((key) => delete _new[key]);
    delete filterParam.delete;
    setSearchParams({ ..._new, ...filterParam });
  };

  const handleSort = useCallback((args) => {
    if (args.length === 0) return;
    setSortParams(args);
  }, []);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  if (rest?.data?.length !== null) {
    if (isMobile) {
      return (
        // <MobileInbox
        //   data={data}
        //   isLoading={isInbox ? isLoading || isIdle : isSearchLoading}
        //   isSearch={isSearch}
        //   searchFields={getSearchFields(userRoles)}
        //   onFilterChange={handleFilterChange}
        //   onSearch={onSearch}
        //   onSort={handleSort}
        //   parentRoute={parentRoute}
        //   searchParams={searchParams}
        //   sortParams={sortParams}
        //   removeParam={removeParam}
        //   linkPrefix={`${parentRoute}/application-details/`}
        // />
        <div></div>
      );
    } else {
      return (
        <div>
          {isInbox && <Header>{t("ES_COMMON_INBOX")}</Header>}
          <DesktopInbox
            businessService={businessService}
            data={data}
            tableConfig={rest?.tableConfig}
            isLoading={hookLoading}
            isSearch={!isInbox}
            onFilterChange={handleFilterChange}
            searchFields={searchFields}
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
            setIsInbox={setIsInbox}
            filterComponent={filterComponent}
          />
        </div>
      );
    }
  }
};

export default Inbox;
