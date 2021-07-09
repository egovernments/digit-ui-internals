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
  const [businessService, setBusinessService] = useState("NewTL"); //DIRECTRENEWAL

  const { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.tl.useApplicationDetail(t, tenantId, applicationNumber);
  
  const stateId = tenantId.split(".")[0];
  const { data: TradeRenewalDate = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "TradeLicense", ["TradeRenewal"]);

  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.tl.useApplicationActions(tenantId);

  let workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: applicationDetails?.tenantId || tenantId,
    id: applicationDetails?.applicationData?.applicationNumber,
    moduleCode: businessService,
    role: "TL_CEMP",
  });

  console.log(applicationDetails, updateResponse, workflowDetails, "applicationDetailsapplicationDetailsapplicationDetails")

  const closeToast = () => {
    setShowToast(null);
  };

  useEffect(() => {
    if (workflowDetails?.data?.applicationBusinessService) {
      setBusinessService(workflowDetails?.data?.applicationBusinessService);
    }
  }, [workflowDetails.data]);

  if (workflowDetails?.data?.actionState?.nextActions?.length > 0) {
    workflowDetails.data.actionState.nextActions = workflowDetails?.data?.actionState?.nextActions?.filter(data => data.action !== "ADHOC")
  }


  const userInfo = Digit.UserService.getUser();
  const rolearray = userInfo?.info?.roles.filter(item => {
    if (
      (item.code == "TL_CEMP" && item.tenantId === tenantId) ||
      item.code == "CITIZEN"
    )
      return true;
  });

  const rolecheck = rolearray.length > 0 ? true : false;
  const validTo = applicationDetails?.applicationData?.validTo;
  const currentDate = Date.now();
  const duration = validTo - currentDate;
  const renewalPeriod = TradeRenewalDate?.TradeLicense?.TradeRenewal?.[0]?.renewalPeriod;

  if (rolecheck && (applicationDetails?.applicationData?.status === "APPROVED" || applicationDetails?.applicationData?.status === "EXPIRED") && duration <= renewalPeriod) {
    if(workflowDetails?.data?.nextActions?.length > 0) {
      workflowDetails = {
        ...workflowDetails,
        data: {
          ...workflowDetails?.data,
          actionState: {
            nextActions: [
              {
                action: "RENEWAL_SUBMIT_BUTTON",
                redirectionUrl: {
                  pathname: `/digit-ui/employee/tl/renew-application-details/${applicationNumber}`,
                  state: applicationDetails
                },
                tenantId: stateId,
              }
            ],
          },
        },
      };
    }
  }

  if (rolearray && applicationDetails?.applicationData?.status === "PENDINGPAYMENT") {
      workflowDetails?.data?.nextActions?.map(data => {
        if (data.action === "PAY") {
          workflowDetails = {
            ...workflowDetails,
            data: {
              ...workflowDetails?.data,
              actionState: {
                nextActions: [
                  {
                    action: data.action,
                    redirectionUrll: {
                      pathname: `TL/${applicationDetails?.applicationData?.applicationNumber}/${tenantId}`,
                      state: tenantId
                    },
                    tenantId: tenantId,
                  }
                ],
              },
            },
          };
        }
      })
  };



  return (
    <div style={{marginLeft: "30px"}}>
      <Header>{(applicationDetails?.applicationData?.workflowCode == "NewTL" && applicationDetails?.applicationData?.status !== "APPROVED") ? t("TL_APPLICATION_DETAILS_LABEL") : t("TL_COMMON_TR_DETAILS")}</Header>
      <ApplicationDetailsTemplate
        applicationDetails={applicationDetails}
        isLoading={isLoading}
        isDataLoading={isLoading}
        applicationData={applicationDetails?.applicationData}
        mutate={mutate}
        workflowDetails={workflowDetails}
        businessService={businessService}
        moduleCode="TL"
        showToast={showToast}
        setShowToast={setShowToast}
        closeToast={closeToast}
        timelineStatusPrefix={"WF_NEWTL_"}
      />
    </div>
  );
};

export default ApplicationDetails;
