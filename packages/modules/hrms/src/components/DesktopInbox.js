import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ApplicationTable from "../../../pgr/src/components/inbox/ComplaintTable";
import { Card, Loader } from "@egovernments/digit-ui-react-components";

import { Link } from "react-router-dom";

const DesktopInbox = ({ tableConfig, filterComponent, ...props }) => {
  const GetCell = (value) => <span className="cell-text">{value}</span>;
  const GetSlaCell = (value) => {
    return value == 'INACTIVE' ? <span className="sla-cell-error">{value || ""}</span> : <span className="sla-cell-success">{value || ""}</span>;
  };
  const data = props?.data?.Employees;
  const { t } = useTranslation();
  const [FilterComponent, setComp] = useState(() => Digit.ComponentRegistryService?.getComponent(filterComponent));

  const columns = React.useMemo(() => {
    return [
      {
        Header: t("HR_EMP_ID_LABEL"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <span className="link">
              <Link to={""}>{row.original.code}</Link>
            </span>
          );
        },
      },
      {
        Header: t("HR_EMP_NAME_LABEL"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.user?.name}`);
        },
      },
      {
        Header: t("HR_ROLE_LABEL"),
        Cell: ({ row }) => {
          return GetCell(`${row.original?.assignments.length}`);
        },
        disableSortBy: true,
      },
      {
        Header: t("HR_DESG_LABEL"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${t(row.original?.assignments?.sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate))[0]?.designation) || ""}`);
        },
      },
      {
        Header: t("HR_STATUS_LABEL"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetSlaCell(`${row.original?.isActive ? 'ACTIVE' : 'INACTIVE'}`);
        },
      },
    ];
  }, []);


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
        columns={columns}
        getCellProps={(cellInfo) => {
          return {
            style: {
              maxWidth: cellInfo.column.Header === t("HR_EMP_ID_LABEL") ? "140px" : "",
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
          <InboxLinks
            parentRoute={props.parentRoute}
            allLinks={[
              {
                text: "HR_COMMON_CREATE_EMPLOYEE_HEADER",
                link: "/digit-ui/employee/pt/new-application",
                businessService: "hrms",
                roles: ["HRMS_ADMIN"],
              },
              {
                text: "HR_REPORT",
                link: "/digit-ui/employee/pt/new-application",
                businessService: "hrms",
                roles: ["BPA_APPROVER"],
              },
            ]}
            headerText={"HRMS"}
            businessService={props.businessService}
          />
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
