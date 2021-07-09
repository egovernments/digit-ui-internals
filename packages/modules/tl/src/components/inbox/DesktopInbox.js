import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Card, Loader } from "@egovernments/digit-ui-react-components";
import InboxLinks from "./ApplicationLinks";
import ApplicationTable from "./ApplicationTable";
import SearchApplication from "./search";
import { Link } from "react-router-dom";
// import { getActionButton } from "../../utils";

const DesktopInbox = ({ tableConfig, filterComponent,columns, ...props }) => {
  const { data } = props;
  const { t } = useTranslation();
  const [FilterComponent, setComp] = useState(() => Digit.ComponentRegistryService?.getComponent(filterComponent));
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
  const inboxColumns = () => [
    {
      Header: t("WF_INBOX_HEADER_APPLICATION_NO"),
      Cell: ({ row }) => {
        return (
          <div>
            <span className="link">
            <Link to={"/digit-ui/employee/tl/tl-details/" + row.original["applicationNo"]}>{row.original["applicationNo"]}</Link>
            </span>
          </div>
        );
      }
    },{
      Header: t("TL_COMMON_TABLE_COL_APP_DATE"),
      Cell: ({ row }) => {
        return GetCell(`${row.original?.["name"]}`);
      }
    },{
          Header: t("WF_INBOX_HEADER_LOCALITY"),
    Cell: ({ row }) => {
        return GetCell(t(Digit.Utils.locale.getRevenueLocalityCode(row.original["locality"], row.original["tenantId"])));
      },
    },
    {
      Header: t("WF_INBOX_HEADER_STATUS"),
      Cell: ({ row }) => {
        const dueDate = row.original?.dueDate === "NA" ? "NA" : convertEpochToDate(row.original?.dueDate);
        return GetCell(t(`${dueDate}`));
      },
    },
    {
      Header: t("WF_INBOX_HEADER_CURRENT_OWNER"),
      Cell: ({ row }) => {
        return GetCell(t(`${row.original?.totalAmount}`));
      }
    },{
    Header: t("WF_INBOX_HEADER_SLA_DAYS_REMAINING"),
    Cell: ({ row }) => {
      return GetSlaCell(row.original["sla"])
    },
  }
  ];

  let result;
  if (props.isLoading) {
    result = <Loader />;
  } else if (data?.length === 0) {
    result = (
      <Card style={{ marginTop: 20 }}>
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
          <InboxLinks parentRoute={props.parentRoute}
            allLinks={[
              {
                text: "TL_NEW_APPLICATION",
                link: "/digit-ui/employee/hrms/create",
                businessService: "TL",
                roles: [],

              },
              {
                text: "TL_COMMON_APPL_RENEWAL_LICENSE_YEAR",
                link: "/digit-ui/employee/hrms/create",
                businessService: "TL",
                roles: [],

              },
              {
                text: "ACTION_TEST_REPORTS",
                link: "/digit-ui/employee/hrms/create",
                businessService: "TL",
                roles: [],

              },
              {
                text: "TL_SEARCH_APPLICATIONS",
                link: "/digit-ui/employee/hrms/create",
                businessService: "TL",
                roles: [],

              },
              {
                text: "ACTION_TEST_DASHBOARD",
                link: "/digit-ui/employee/hrms/create",
                businessService: "TL",
                roles: [],

              },
            ]}
            headerText={t("ACTION_TEST_TRADELICENSE")} businessService={props.businessService} />
          <div>
            {
              <FilterComponent
                defaultSearchParams={props.defaultSearchParams}
                onFilterChange={props.onFilterChange}
                searchParams={props.searchParams}
                type="desktop"
              />
            }
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