import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";

import { useParams } from "react-router-dom";
import { Header } from "@egovernments/digit-ui-react-components";

const ApplicationDetails = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { id: applicationNumber } = useParams();
  const [showToast, setShowToast] = useState(null);
  // const [callUpdateService, setCallUpdateValve] = useState(false);
  const [businessService, setBusinessService] = useState("PT.CREATE");

  const { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.pt.useApplicationDetail(t, tenantId, applicationNumber);

  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.pt.useApplicationActions(tenantId);

  let workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: applicationDetails?.tenantId || tenantId,
    id: applicationDetails?.applicationData?.acknowldgementNumber,
    moduleCode: businessService,
    role: "PT_CEMP",
  });

  const closeToast = () => {
    setShowToast(null);
  };

  useEffect(() => {
    if (workflowDetails?.data?.applicationBusinessService) {
      setBusinessService(workflowDetails?.data?.applicationBusinessService);
    }
  }, [workflowDetails.data]);

  const PT_CEMP = Digit.UserService.hasAccess(["PT_CEMP"]) || false;

  if (applicationDetails?.applicationData?.status === "ACTIVE" && PT_CEMP) {
    if (businessService != "PT.UPDATE") setBusinessService("PT.UPDATE");
    workflowDetails = {
      ...workflowDetails,
      data: {
        ...workflowDetails?.data,
        actionState: {
          nextActions: [
            {
              action: "VIEW_DETAILS",
              redirectionUrl: {
                pathname: `/digit-ui/employee/pt/property-details/${applicationNumber}`,
                // state: { workflow: { action: "OPEN", moduleName: "PT", businessService } },
              },
              tenantId: "pb",
            },
            {
              action: "UPDATE",
              redirectionUrl: {
                pathname: `/digit-ui/employee/pt/modify-application/${applicationNumber}`,
                state: { workflow: { action: "OPEN", moduleName: "PT", businessService } },
              },
              tenantId: "pb",
            },
          ],
        },
      },
    };
  }

  if (
    PT_CEMP &&
    workflowDetails?.data?.actionState?.isStateUpdatable &&
    !workflowDetails?.data?.actionState?.nextActions?.find((e) => e.action === "UPDATE")
  ) {
    if (!workflowDetails?.data?.actionState?.nextActions) workflowDetails.data.actionState.nextActions = [];
    workflowDetails?.data?.actionState?.nextActions.push({
      action: "UPDATE",
      redirectionUrl: {
        pathname: `/digit-ui/employee/pt/modify-application/${applicationNumber}`,
        state: { workflow: { action: "REOPEN", moduleName: "PT", businessService } },
      },
      tenantId: "pb",
    });
  }

  // console.log(PT_CEMP && businessService === "PT.UPDATE" && workflowDetails?.actionState?.isStateUpdatable);

  if (!(applicationDetails?.applicationDetails[0]?.values?.[0].title === "PT_PROPERTY_APPLICATION_NO")) {
    applicationDetails?.applicationDetails?.unshift({
      values: [
        { title: "PT_PROPERTY_APPLICATION_NO", value: applicationDetails?.applicationData?.acknowldgementNumber },
        { title: "ES_APPLICATION_CHANNEL", value: `ES_APPLICATION_DETAILS_APPLICATION_CHANNEL_${applicationDetails?.applicationData?.channel}` },
      ],
    });
  }

  console.log(workflowDetails?.data, "inside workflowdetails");

  // applicationDetails?.applicationData?.units?.sort((a, b) => b.floorNo - a.floorNo);

  return (
    <div>
      <Header>{t("PT_APPLICATION_TITLE")}</Header>
      <ApplicationDetailsTemplate
        applicationDetails={applicationDetails}
        isLoading={isLoading}
        isDataLoading={isLoading}
        applicationData={applicationDetails?.applicationData}
        mutate={mutate}
        workflowDetails={workflowDetails}
        businessService={businessService}
        moduleCode="PT"
        showToast={showToast}
        setShowToast={setShowToast}
        closeToast={closeToast}
        timelineStatusPrefix={"ES_PT_COMMON_STATUS_"}
      />
    </div>
  );
};

export default ApplicationDetails;
