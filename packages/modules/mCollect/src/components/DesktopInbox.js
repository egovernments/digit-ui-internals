import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Card, Loader } from "@egovernments/digit-ui-react-components";
import InboxLinks from "./inbox/InboxLink";
import ApplicationTable from "./inbox/ApplicationTable";
import SearchApplication from "./inbox/search";
import { Link } from "react-router-dom";

const DesktopInbox = ({ tableConfig, filterComponent,columns, ...props }) => {
  const { data } = props;
  const { t } = useTranslation();
  const [FilterComponent, setComp] = useState(() => Digit.ComponentRegistryService?.getComponent(filterComponent));

  // challans, workFlowData

  // const columns = React.useMemo(() => (props.isSearch ? tableConfig.searchColumns(props) : tableConfig.inboxColumns(props) || []), []);
  const GetCell = (value) => <span className="cell-text">{value}</span>;

  const GetSlaCell = (value) => {
    if (isNaN(value)) return <span className="sla-cell-success">0</span>;
    return value < 0 ? <span className="sla-cell-error">{value}</span> : <span className="sla-cell-success">{value}</span>;
  };

  const convertEpochToDate = dateEpoch => {
    if(dateEpoch == null || dateEpoch == undefined || dateEpoch == ''){
      return "NA" ;
    } 
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  };
  const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
    if (searcher == "") return str;
    while (str.includes(searcher)) {
      str = str.replace(searcher, replaceWith);
    }
    return str;
  };
  
  const GetMobCell = (value) => <span className="sla-cell">{value}</span>;
  const inboxColumns = (props) => [
    {
      Header: t("UC_CHALLAN_NUMBER"),
      Cell: ({ row }) => {
        return (
          <div>
            <span className="link">
              <Link to={`${props.parentRoute}/application-details/` + row.original?.["challanNo"]}>
                {row.original?.["challanNo"]}
              </Link>
            </span>
          </div>
        );
      },
      mobileCell: (original) => GetMobCell(original?.["challanNo"]),
    },{
      Header: t("UC_COMMON_TABLE_COL_PAYEE_NAME"),
      Cell: ({ row }) => {
        return GetCell(`${row.original?.["name"]}`);
      },
      mobileCell: (original) => GetMobCell(original?.["name"]),
    },
    {
      Header: t("UC_SERVICE_CATEGORY_LABEL"),
      Cell: ({ row }) => {
        let code = stringReplaceAll(`${row.original?.["businessService"]}`, ".", "_");
        code = code.toUpperCase();
        return GetCell(t(`BILLINGSERVICE_BUSINESSSERVICE_${code}`))
      },
      mobileCell: (original) => GetMobCell(`BILLINGSERVICE_BUSINESSSERVICE_${(original?.["businessService"])}`),
    },
    {
      Header: t("UC_DUE_DATE"),
      Cell: ({ row }) => {
        const wf = row.original?.applicationStatus;
        return GetCell(t(`${convertEpochToDate(row.original?.dueDate)}`));
      },
      mobileCell: (original) => GetMobCell(convertEpochToDate(original?.["dueDate"])),
    },
    {
      Header: t("UC_TOTAL_AMOUNT"),
      Cell: ({ row }) => {
        return GetCell(t(`${row.original?.totalAmount}`));
      },
      mobileCell: (original) => GetMobCell(original?.["totalAmount"]),
    },
    {
      Header: t("UC_COMMON_TABLE_COL_STATUS"),
      Cell: ({ row }) => {
        const wf = row.original?.applicationStatus;
        return GetCell(t(`${row.original?.applicationStatus}`));
      },
      mobileCell: (original) => GetMobCell(original?.workflowData?.state?.["state"]),
    },
    {
      Header: t("UC_TABLE_COL_ACTION"),
      Cell: ({ row }) => {
        const amount = row.original?.totalAmount;
        let action = "ACTIVE"
        if(amount > 0)  action = "COLLECT"
        return GetCell(t(`${action}`));
      },
      mobileCell: (original) => GetMobCell(original?.workflowData?.state?.["state"]),
    }
  ];


  useEffect(() => {
    console.log(data, columns, "inside desktop inbox....");
  }, [data, columns]);

  let result;
  if (props.isLoading) {
    result = <Loader />;
  } else if (data?.length === 0) {
    result = (
      <Card style={{ marginTop: 20 }}>
        {/* TODO Change localization key */}
        {t("CS_MYAPPLICATIONS_NO_APPLICATION")
          .split("\\n")
          .map((text, index) => (
            <p key={index} style={{ textAlign: "center" }}>
              {text}
            </p>
          ))}
      </Card>
    );
  } else if (data?.length > 0) {
    result = (
      <ApplicationTable
        t={t}
        data={data}
        columns={inboxColumns(data)}
        getCellProps={(cellInfo) => {
          return {
            style: {
              minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
              padding: "20px 18px",
              fontSize: "16px",
            },
          };
        }}
        onPageSizeChange={props.onPageSizeChange}
        currentPage={props.currentPage}
        onNextPage={props.onNextPage}
        onPrevPage={props.onPrevPage}
        pageSizeLimit={props.pageSizeLimit}
        onSort={props.onSort}
        disableSort={props.disableSort}
        onPageSizeChange={props.onPageSizeChange}
        sortParams={props.sortParams}
        totalRecords={props.totalRecords}
      />
    );
  }

  return (
    <div className="inbox-container">
      {!props.isSearch && (
        <div className="filters-container">
          <InboxLinks parentRoute={props.parentRoute} businessService={props.businessService} />
          <div>
            {
              <FilterComponent
                defaultSearchParams={props.defaultSearchParams}
                onFilterChange={props.onFilterChange}
                searchParams={props.searchParams}
                type="desktop"
              />
            }
            {/* <Filter
              businessService={props.businessService}
              searchParams={props.searchParams}
              applications={props.data}
              onFilterChange={props.onFilterChange}
              translatePrefix={props.translatePrefix}
              type="desktop"
            /> */}
          </div>
        </div>
      )}
      <div style={{ flex: 1 }}>
        <SearchApplication
          defaultSearchParams={props.defaultSearchParams}
          onSearch={props.onSearch}
          type="desktop"
          searchFields={props.searchFields}
          isInboxPage={!props?.isSearch}
          searchParams={props.searchParams}
        />
        <div className="result" style={{ marginLeft: !props?.isSearch ? "24px" : "", flex: 1 }}>
          {result}
        </div>
      </div>
    </div>
  );
};

export default DesktopInbox;
