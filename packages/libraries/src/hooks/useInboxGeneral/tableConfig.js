import React from "react";
import { Link } from "react-router-dom";

const GetCell = (value) => <span className="cell-text">{value}</span>;

const GetSlaCell = (value) => {
  if (isNaN(value)) return <span className="sla-cell-success">0</span>;
  return value < 0 ? <span className="sla-cell-error">{value}</span> : <span className="sla-cell-success">{value}</span>;
};

export const TableConfig = (t) => ({
  FSM: {
    searchColumns: (props) => [{}],
    inboxColumns: (props) => [
      {
        Header: t("ES_INBOX_APPLICATION_NO"),
        accessor: "searchData.applicationNo",
        disableSortBy: true,
        Cell: ({ row, value }) => {
          return (
            <div>
              <span className="link">
                <Link to={`${props.parentRoute}/${"application-details"}/${value}`}>{value}</Link>
              </span>
            </div>
          );
        },
      },
      {
        Header: t("ES_INBOX_SLA_DAYS_REMAINING"),
        accessor: "workflowData.businesssServiceSla",
        disableSortBy: true,
        Cell: ({ row, value }) => {
          return GetSlaCell(value);
        },
      },
    ],
  },
  PT: {
    searchColumns: (props) => [
      {
        Header: t("ES_INBOX_UNIQUE_PROPERTY_ID"),
        // accessor: "searchData.propertyId",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <div>
              <span className="link">
                <Link to={`${props.parentRoute}/application-details/` + row.original?.searchData?.["propertyId"]}>
                  {row.original?.searchData?.["propertyId"]}
                </Link>
              </span>
            </div>
          );
        },
      },
      {
        Header: t("ES_INBOX_OWNER_NAME"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.searchData["owners"]?.[0].name}`);
        },
      },
      {
        Header: t("ES_INBOX_LOCALITY"),

        Cell: ({ row }) => GetCell(`${row.original?.searchData?.address?.locality?.name}`),
        disableSortBy: true,
      },
      {
        Header: t("ES_SEARCH_PROPERTY_STATUS"),
        Cell: ({ row }) => {
          return GetCell(row.original?.searchData?.status);
        },
        disableSortBy: true,
      },
      {
        Header: t("ES_SEARCH_TAX_DUE"),
        Cell: ({ row }) => {
          return GetCell(row.original?.searchData?.due_tax);
        },
        disableSortBy: true,
      },
      {
        Header: t("ES_SEARCH_ACTION"),
        Cell: ({ row }) => {
          return (
            <div>
              <span className="link">
                <Link to={`${props.parentRoute}/application-details/` + row.original?.searchData?.["propertyId"]}>{t("ES_PT_COLLECT_TAX")}</Link>
              </span>
            </div>
          );
        },
        disableSortBy: true,
      },
    ],
    inboxColumns: (props) => [
      {
        Header: t("ES_INBOX_UNIQUE_PROPERTY_ID"),
        Cell: ({ row }) => {
          return (
            <div>
              <span className="link">
                <Link to={`${props.parentRoute}/application-details/` + row.original?.searchData?.["propertyId"]}>
                  {row.original?.searchData?.["propertyId"]}
                </Link>
              </span>
            </div>
          );
        },
      },
      {
        Header: t("ES_INBOX_OWNER"),
        Cell: ({ row }) => {
          // console.log(row.original?.searchData["owner"]);
          return GetCell(`${row.original?.searchData["owners"]?.[0].name}`);
        },
      },
      {
        Header: t("ES_INBOX_APPLICATION_TYPE"),
        Cell: ({ row }) => GetCell(`${row.original?.searchData["propertyType"]}`),
      },
      {
        Header: t("ES_INBOX_STATUS"),
        Cell: ({ row }) => {
          const wf = row.original?.workflowData;
          return GetCell(t(`PT_INBOX_STATUS_${wf?.state?.["state"]}`));
        },
      },
      {
        Header: t("ES_INBOX_SLA_DAYS_REMAINING"),
        Cell: ({ row }) => {
          const wf = row.original.workflowData;
          const math = Math.round(wf.businesssServiceSla / (24 * 60 * 60 * 1000)) || "-";
          return GetSlaCell(math);
        },
      },
    ],
  },
});
