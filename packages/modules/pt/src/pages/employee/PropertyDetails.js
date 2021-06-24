import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";

import { useParams, useHistory } from "react-router-dom";
import { Header, Loader } from "@egovernments/digit-ui-react-components";

const PropertyDetails = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { id: applicationNumber } = useParams();
  const [showToast, setShowToast] = useState(null);
  const history = useHistory();

  let { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.pt.useApplicationDetail(t, tenantId, applicationNumber);
  const { data: fetchBillData } = Digit.Hooks.useFetchBillsForBuissnessService({
    businessService: "PT.CREATE",
    consumerCode: applicationNumber,
  });

  // const {
  //   isLoading: updatingApplication,
  //   isError: updateApplicationError,
  //   data: updateResponse,
  //   error: updateError,
  //   mutate,
  // } = Digit.Hooks.pt.useApplicationActions(tenantId);

  let workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: applicationDetails?.tenantId || tenantId,
    id: applicationDetails?.applicationData?.acknowldgementNumber,
    moduleCode: "PT.UPDATE",
    role: "PT_CEMP",
    // serviceData: applicationDetails,
  });

  const closeToast = () => {
    setShowToast(null);
  };

  // applicationDetails?.applicationDetails?.shift();

  if (applicationDetails?.applicationDetails?.[0]?.values?.[1].title !== "ES_PT_TITLE_TOTAL_PROPERTY_DUE") {
    applicationDetails?.applicationDetails?.unshift({
      values: [
        {
          title: "ES_PT_TITLE_UNIQUE_PROPERTY_ID",
          value: applicationNumber,
        },
        {
          title: "ES_PT_TITLE_TOTAL_PROPERTY_DUE",
          value: fetchBillData?.Bill[0]?.totalAmount ? `₹ ${fetchBillData?.Bill[0]?.totalAmount}` : "N/A",
        },
      ],
    });
  }

  if (applicationDetails?.applicationData?.status === "ACTIVE") {
    workflowDetails = {
      ...workflowDetails,
      data: {
        ...workflowDetails?.data,
        actionState: {
          nextActions: [
            {
              action: "ASSESS_PROPERTY",
              showFinancialYearsModal: true,
              customFunctionToExecute: (data) => {
                delete data.customFunctionToExecute;
                history.push({ pathname: `/digit-ui/employee/pt/assessment-details/${applicationNumber}`, state: { ...data } });
              },
              tenantId: "pb",
            },
          ],
        },
      },
    };
  }

  return (
    <div>
      <Header>{t("ES_PT_TITLE_PROPERTY_DETAILS")}</Header>
      <ApplicationDetailsTemplate
        applicationDetails={applicationDetails}
        isLoading={isLoading}
        isDataLoading={isLoading}
        applicationData={applicationDetails?.applicationData}
        mutate={null}
        workflowDetails={workflowDetails}
        businessService="PT"
        showToast={showToast}
        setShowToast={setShowToast}
        closeToast={closeToast}
        timelineStatusPrefix={"ES_PT_COMMON_STATUS_"}
      />
    </div>
  );
};

export default PropertyDetails;
