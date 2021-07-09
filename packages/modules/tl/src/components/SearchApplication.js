import React, { useCallback, useMemo, useEffect } from "react"
import { useForm, Controller } from "react-hook-form";
import { TextInput, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker, CardLabelError, SearchForm, SearchField, Dropdown, Table, Card } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";

const SearchApplication = ({tenantId, t, onSubmit, data }) => {
    const { register, control, handleSubmit, setValue, getValues } = useForm({
        defaultValues: {
            offset: 0,
            limit: 10,
            sortBy: "commencementDate",
            sortOrder: "DESC"
        }
    })
    useEffect(() => {
      register("offset", 0)
      register("limit", 10)
      register("sortBy", "commencementDate")
      register("sortOrder", "DESC")
    },[register])
    const { data: applicationTypes } = Digit.Hooks.tl.useMDMS.applicationTypes(tenantId)
    const applicationStatuses = [
        {
            code: "CANCELLED",
            i18nKey: "TLAPPLICATION_TYPE_CANCELLED"
        },
        {
            code: "APPROVED",
            i18nKey: "TLAPPLICATION_TYPE_APPROVED"
        },
        {
            code: "EXPIRED",
            i18nKey: "TLAPPLICATION_TYPE_EXPIRED"
        },
        {
            code: "APPLIED",
            i18nKey: "TLAPPLICATION_TYPE_APPLIED"
        },
        {
            code: "REJECTED",
            i18nKey: "TLAPPLICATION_TYPE_REJECTED"
        },
        {
            code: "PENDINGPAYMENT",
            i18nKey: "TLAPPLICATION_TYPE_PENDINGPAYMENT"
        },
        {
            code: "FIELDINSPECTION",
            i18nKey: "TLAPPLICATION_TYPE_FIELDINSPECTION"
        },
        {
            code: "CITIZENACTIONREQUIRED",
            i18nKey: "TLAPPLICATION_TYPE_CITIZENACTIONREQUIRED"
        },
        {
            code: "PENDINGAPPROVAL",
            i18nKey: "TLAPPLICATION_TYPE_PENDINGAPPROVAL"
        },
        {
            code: "INITIATED",
            i18nKey: "TLAPPLICATION_TYPE_INITIATED"
        }	
    ]
    const GetCell = (value) => <span className="cell-text">{value}</span>;
    const columns = useMemo( () => ([
        {
          Header: t("ES_INBOX_APPLICATION_NO"),
          accessor: "applicationNo",
          disableSortBy: true,
          Cell: ({ row }) => {
            return (
              <div>
                <span className="link">
                  <Link to={`/digit-ui/employee/tl/application-details/${row.original["applicationNumber"]}`}>
                    {row.original["applicationNumber"]}
                  </Link>
                </span>
              </div>
            );
          },
        },
        {
          Header: t("ES_APPLICATION_DETAILS_COMMENCEMENT_DATE"),
          disableSortBy: true,
          accessor: (row) => GetCell(row.commencementDate || ""),
        },
        {
          Header: t("ES_APPLICATION_DETAILS_TRADE_NAME"),
          disableSortBy: true,
          accessor: (row) => GetCell(row.tradeName || ""),
        },
        {
          Header: t("ES_APPLICATION_DETAILS_TRADE_OWNER"),
          accessor: (row) => GetCell(row.tradeLicenseDetail.owners.map( o => o.name ). join(",") || ""),
          disableSortBy: true,
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
                    <label>{t("TL_SEARCH_APPLICATION_NUMBER")}</label>
                    <TextInput name="applicationNumber" inputRef={register({})} />
                </SearchField>
                <SearchField>
                    <label>{t("TL_SEARCH_APPLICATION_TYPE")}</label>
                    <Controller
                            control={control}
                            name="applicationType"
                            render={(props) => (
                                <Dropdown
                                selected={props.value}
                                select={props.onChange}
                                onBlur={props.onBlur}
                                option={applicationTypes}
                                optionKey="i18nKey"
                                t={t}
                                />
                            )}
                            />
                </SearchField>
                <SearchField>
                    <label>{t("TL_SEARCH_FROM_DATE")}</label>
                    <Controller
                        render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                        name="toDate"
                        control={control}
                        />
                </SearchField>
                <SearchField>
                    <label>{t("TL_SEARCH_TO_DATE")}</label>
                    <Controller
                        render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                        name="fromDate"
                        control={control}
                        />
                </SearchField>
                <SearchField>
                    <label>{t("TL_SEARCH_TRADE_LICENSE_NUMBER")}</label>
                    <TextInput name="licenseNumbers" inputRef={register({})}/>
                </SearchField>
                <SearchField>
                    <label>{t("TL_SEARCH_APPLICATION_STATUS")}</label>
                    <Controller
                            control={control}
                            name="status"
                            render={(props) => (
                                <Dropdown
                                selected={props.value}
                                select={props.onChange}
                                onBlur={props.onBlur}
                                option={applicationStatuses}
                                optionKey="i18nKey"
                                t={t}
                                />
                            )}
                            />
                </SearchField>
                <SearchField>
                    <label>{t("TL_SEARCH_TRADE_LICENSE_NUMBER")}</label>
                    <TextInput name="licenseNumbers" inputRef={register({})}/>
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

export default SearchApplication