import { EmployeeModuleCard, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const MCollectCard = () => {
  if (!Digit.Utils.mCollectAccess()) {
    return null;
  }

  const { t } = useTranslation();
  const propsForModuleCard = {
    Icon: <PropertyHouse />,
    moduleName: t("UC_COMMON_HEADER_SEARCH"),
    kpis: [
      {
        count: 0,
        label: t("TOTAL_CHALLANS"),
        link: `/digit-ui/employee/mcollect/inbox`
      },
      // {
      //     label: t(""),
      //     link: `/digit-ui/employee/receipts/inbox`
      // }  
    ],
    links: [
      {
        label: t("UC_SEARCH_CHALLAN_LABEL"),
        link: `/digit-ui/employee/mcollect/inbox`
      },
      {
        label: t("UC_GENERATE_NEW_CHALLAN"),
        link: `/digit-ui/employee/mcollect/new-application`
      }
    ]
  }
  return <EmployeeModuleCard {...propsForModuleCard} />
};

export default MCollectCard;

