import React from "react"
import useInbox from "../useInbox"

const useTLInbox = ({ tenantId, filters, config }) => {

    const {applicationStatus, mobileNumber, applicationNumber, sortBy, sortOrder, locality, uuid, limit, offset } = filters
    const _filters = {
        tenantId,
		processSearchCriteria: {
			businessService: ["NewTL"],
            ...(applicationStatus?.length > 0 ? {applicationStatus: applicationStatus.map((status) => status.code).join(",")} : {})
        },
		moduleSearchCriteria: {
            ...(mobileNumber ? {mobileNumber}: {}),
            ...(applicationNumber ? {applicationNumber} : {}),
            ...(sortBy ? {sortBy} : {}),
            ...(sortOrder ? {sortOrder} : {}),
            ...(locality?.length > 0 ? {locality: locality.map((item) => item.code.split("_").pop()).join(",")} : {}),
            ...(uuid && Object.keys(uuid).length > 0 ? {assignee: uuid.code === "ASSIGNED_TO_ME" ? uuid : ""} : {}),
        },
        limit,
        offset
    }

    return useInbox({tenantId, filters: _filters, config:{
        select: (data) =>({
            statuses: data.status,
            table: data?.items.map( application => ({
                applicationId: application.businessObject.applicationNumber,
                date: application.businessObject.applicationDate,
                locality: `${application.businessObject?.tenantId?.toUpperCase()?.split(".")?.join("_")}_REVENUE_${application.businessObject?.tradeLicenseDetail?.address?.locality?.code?.toUpperCase()}`,
                status: application.businessObject.status,
                owner: application.ProcessInstance?.assigner?.name,
                sla: Math.round(application.ProcessInstance?.businesssServiceSla / (24 * 60 * 60 * 1000))
            }))
        }),
        ...config
    }})
}

export default useTLInbox