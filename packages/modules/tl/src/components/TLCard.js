import { CaseIcon, EmployeeModuleCard } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { checkForEmployee } from "../utils";

const TLCard = () => {
    const { t } = useTranslation();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const inboxSearchParams = { limit: 10, offset: 0 }
    const { isLoading, data: inboxData } = Digit.Hooks.tl.useInbox({
        tenantId,
        filters: { ...inboxSearchParams },
        config:{}
      });

    const counterEmployeeExtraLinks = checkForEmployee("TL_CEMP") ? [
        {
            label: t("TL_SEARCH_APPLICATIONS"),
            link: `/digit-ui/employee/tl/search/application`
        },
        {
            label: t("TL_SEARCH_APPLICATIONS"),
            link: `/digit-ui/employee/tl/search/application`
        }
    ] : []

    const propsForModuleCard = {
        Icon : <CaseIcon />,
        moduleName: t("TL_COMMON_TL"),
        kpis: [
            {
                count:  isLoading ? "-" : inboxData?.totalCount,
                label: t("TOTAL_TL"),
                link: `/digit-ui/employee/tl/inbox`
            },
            {
                label: t("TOTAL_NEARING_SLA"),
                link: `/digit-ui/employee/tl/inbox`
            }  
        ],
        links: [
            {
                count: isLoading ? "-" : inboxData?.totalCount,
                label: t("ES_COMMON_INBOX"),
                link: `/digit-ui/employee/tl/inbox`
            },
            {
                label: t("TL_SEARCH_APPLICATIONS"),
                link: `/digit-ui/employee/tl/search/application`
            },
            ...counterEmployeeExtraLinks
        ]
    }

    return <EmployeeModuleCard {...propsForModuleCard} />
};

export default TLCard;

