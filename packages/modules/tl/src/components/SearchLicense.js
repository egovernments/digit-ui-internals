import React, { useCallback, useMemo, useEffect } from "react"
import { useForm, Controller } from "react-hook-form";
import { TextInput, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker, CardLabelError, SearchForm, SearchField, Dropdown, Table, Card } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";

const SearchLicense = ({tenantId, t, onSubmit, data }) => {
    const { register, control, handleSubmit, setValue, getValues } = useForm({
        defaultValues: {
            offset: 0,
            limit: 10,
            sortBy: "commencementDate",
            sortOrder: "DESC",
            status: "APPROVED"
        }
    })
    useEffect(() => {
      register("offset", 0)
      register("limit", 10)
      register("sortBy", "commencementDate")
      register("sortOrder", "DESC")
      register("status", "APPROVED")
    },[register])

    const GetCell = (value) => <span className="cell-text">{value}</span>;
    const columns = useMemo( () => ([
        {
          Header: t("ES_INBOX_LICENSE_NUMBER"),
          accessor: "licenseNumber",
          disableSortBy: true,
          Cell: ({ row }) => {
            return (
              <div>
                <span className="link">
                  <Link to={`/application-details/` + row.original["licenseNumber"]}>
                    {row.original["licenseNumber"]}
                  </Link>
                </span>
              </div>
            );
          },
        },
        {
          Header: t("ES_APPLICATION_DETAILS_TRADE_NAME"),
          disableSortBy: true,
          accessor: (row) => GetCell(row.tradeName || ""),
        },
        {
            Header: t("ES_APPLICATION_DETAILS_ISSUED_DATE"),
            disableSortBy: true,
            accessor: (row) => GetCell(row.issuedDate || ""),
        },
        {
            Header: t("ES_APPLICATION_DETAILS_VALID_TO"),
            disableSortBy: true,
            accessor: (row) => GetCell(row.validTo || ""),
        },
        {
            Header: t("ES_APPLICATION_DETAILS_LOCALITY"),
            disableSortBy: true,
            accessor: (row) => GetCell(row.tradeLicenseDetail.address.locality || ""),
        },
        {
          Header: t("ES_APPLICATION_DETAILS_STATUS"),
          accessor: (row) => GetCell(row.status || ""),
          disableSortBy: true,
        }
      ]), [] )

    const onSort = useCallback((args) => {
        if (args.length === 0) return
        setValue("sortBy", args.id)
        setValue("sortOrder", args.desc ? "DESC" : "ASC")
    }, [])
    return <React.Fragment>
            <SearchForm onSubmit={onSubmit} handleSubmit={handleSubmit}>
            <SearchField>
                <label>{t("TL_SEARCH_LICENSE_NUMBER")}</label>
                <TextInput name="licenseNumbers" inputRef={register({})} />
            </SearchField>
            <SearchField>
                <label>{t("TL_SEARCH_TRADE_OWNER_NAME")}</label>
                <TextInput name="ownerName" inputRef={register({})}/>
            </SearchField>
            <SearchField>
                <label>{t("TL_SEARCH_TRADE_LICENSE_ISSUED_FROM")}</label>
                <TextInput name="licenseIssuer" inputRef={register({})}/>
            </SearchField>
            <SearchField>
                <label>{t("TL_SEARCH_TRADE_LICENSE_ISSUED_TO")}</label>
                <TextInput name="licenseIssuedTo" inputRef={register({})}/>
            </SearchField>
            <SearchField>
                <label>{t("TL_SEARCH_TRADE_LICENSE_TRADE_NAME")}</label>
                <TextInput name="tradeName" inputRef={register({})}/>
            </SearchField>
            <SearchField className="submit">
                <p>{t(`ES_COMMON_CLEAR_ALL`)}</p>
                <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
            </SearchField>
        </SearchForm>
        {data?.display ?<Card style={{ marginTop: 20 }}>
            {
            t(data.display)
                .split("\\n")
                .map((text, index) => (
                <p key={index} style={{ textAlign: "center" }}>
                    {text}
                </p>
                ))
            }
        </Card>
        : <Table
            t={t}
            data={data}
            columns={columns}
            getCellProps={(cellInfo) => {
            return {
                style: {
                minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
                padding: "20px 18px",
                fontSize: "16px"
            },
            };
            }}
            onPageSizeChange={(e) => setValue("limit",Number(e.target.value))}
            currentPage={getValues("offset")}
            onNextPage={() => setValue("offset", getValues("offset") + getValues("limit") )}
            onPrevPage={() => setValue("offset", getValues("offset") - getValues("limit") )}
            pageSizeLimit={getValues("limit")}
            onSort={onSort}
            disableSort={false}
            sortParams={[{id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" ? true : false}]}
            totalRecords={100}
        />}
        </React.Fragment>
}

export default SearchLicense