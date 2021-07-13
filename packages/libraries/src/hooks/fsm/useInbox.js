import React from "react"
import useInbox from "../useInbox"

const useFSMInbox = (tenantId, filters, filterFsmFn, config = {}) => {
    let { uuid } = Digit.UserService.getUser().info;
    const { applicationNos, mobileNumber, limit, offset, sortBy, sortOrder } = filters;
    const _filters = {
		tenantId,
		processSearchCriteria: {
			businessService: ["FSM"],
            ...(filters?.applicationStatus?.length > 0 ? {applicationStatus: filters.applicationStatus.map((status) => status.code).join(",")} : {}),
		},
		moduleSearchCriteria: {
            ...(mobileNumber ? {mobileNumber}: {}),
            ...(applicationNos ? {applicationNos} : {}),
            ...(sortBy ? {sortBy} : {}),
            ...(sortOrder ? {sortOrder} : {}),
            ...(filters?.locality?.length > 0 ? {locality: filters.locality.map((item) => item.code.split("_").pop()).join(",")} : {}),
            ...(filters.uuid && Object.keys(filters.uuid).length > 0 ? {assignee: filters.uuid.code === "ASSIGNED_TO_ME" ? uuid : ""} : {}),
		},
		limit,
		offset,
	}
    const appList = useInbox({tenantId, filters: _filters, config:{
        select: (data) => ({
            statuses: data.status,
            table: data?.items?.map( application => ({
                tenantId: application.businessObject.tenantId,
                totalCount: application.businessObject.totalCount,
                applicationNo: application.businessObject.applicationNo,
                createdTime: new Date(application.businessObject.auditDetails.createdTime),
                locality: application.businessObject.address.locality.code,
                status: application.businessObject.applicationStatus,
                taskOwner: application.ProcessInstance?.assigner?.name,
                sla: Math.round(application.ProcessInstance?.businesssServiceSla / (24 * 60 * 60 * 1000)) || "-",
                mathsla: application.ProcessInstance?.businesssServiceSla,
            })),
    })}})

    return { ...appList }
}

export default useFSMInbox