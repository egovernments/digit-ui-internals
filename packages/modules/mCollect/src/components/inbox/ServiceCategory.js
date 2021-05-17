import React, { useState } from "react";
import { Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import ServiceCategoryCount from "./ServiceCategoryCount";

const ServiceCategory = ({ onAssignmentChange, searchParams, businessServices }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const [moreStatus, showMoreStatus] = useState(false);
  const { data: Menu, isLoading } = Digit.Hooks.mcollect.useMCollectMDMS(stateId, "BillingService", "BusinessService", "[?(@.type=='Adhoc')]");

const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
  if (searcher == "") return str;
  while (str.includes(searcher)) {
    str = str.replace(searcher, replaceWith);
  }
  return str;
};


  const translateState = (option) => {
    let code = stringReplaceAll(option.code, ".", "_");
    code = code.toUpperCase();
    return t(`BILLINGSERVICE_BUSINESSSERVICE_${code}`);
  };

  if (isLoading) {
    return <Loader />;
  }
// translateState(option)
  return (
    <div className="status-container">
      <div className="filter-label" style={{ fontWeight: "normal" }}>
        {t("Service Category")}
      </div>
      <div>
      {moreStatus &&
        Menu?.map((option, index) => {
          return (
            <ServiceCategoryCount
              key={index}
              onAssignmentChange={onAssignmentChange}
              status={{ name: translateState(option), code: option.code }}
              searchParams={searchParams}
            />
          );
        })
        }
      <div className="filter-button" onClick={() => showMoreStatus(!moreStatus)}>
        {" "}
        {moreStatus ? t("ES_COMMON_LESS") : t("ES_COMMON_MORE")}{" "}
      </div>
      </div>
    </div>
  );
};

export default ServiceCategory;
