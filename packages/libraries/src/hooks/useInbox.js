import React from "react";
import { useQuery } from "react-query";
import { InboxGeneral } from "../services/elements/InboxService"

const useInbox = ({tenantId, filters, config}) => useQuery(
        ["INBOX_DATA",tenantId, ...Object.keys(filters)?.map( e => filters?.[e] )],
        () => InboxGeneral.Search({tenantId, inbox: {...filters}}),
        { ...config }
    )

export default useInbox;