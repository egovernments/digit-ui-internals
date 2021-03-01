import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  BreakLine,
  Card,
  CardSubHeader,
  StatusTable,
  Row,
  SubmitBar,
  Loader,
  CardSectionHeader,
  ConnectingCheckPoints,
  CheckPoint,
  ActionBar,
  Menu,
  LinkButton,
  Toast,
} from "@egovernments/digit-ui-react-components";

import ActionModal from "./Modal";

import { useQueryClient } from "react-query";

import { useHistory, useLocation, useParams, useRouteMatch } from "react-router-dom";

const ApplicationDetails = (props) => {
  console.log("find location here", useRouteMatch());
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = tenantId.split(".")[0];
  const { t } = useTranslation();
  const history = useHistory();
  const queryClient = useQueryClient();
  let { id: applicationNumber } = useParams();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [config, setCurrentConfig] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const DSO = Digit.UserService.hasAccess("FSM_DSO") || false;
  // console.log("find DSO here", DSO)
  const { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.fsm.useApplicationDetail(t, tenantId, applicationNumber);
  const { isLoading: isDataLoading, isSuccess, data: applicationData } = Digit.Hooks.fsm.useSearch(
    tenantId,
    { applicationNos: applicationNumber },
    { staleTime: Infinity }
  );

  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.fsm.useApplicationActions(tenantId);

  // console.log("find application details here", applicationDetails)
  const workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: applicationDetails?.tenantId || tenantId,
    id: applicationNumber,
    moduleCode: "FSM",
    role: "FSM_EMPLOYEE",
    serviceData: applicationDetails,
  });

  useEffect(() => {
    if (showToast) {
      workflowDetails.revalidate();
    }
  }, [showToast]);

  function onActionSelect(action) {
    setSelectedAction(action);
    setDisplayMenu(false);
  }

  const TLCaption = ({ data }) => {
    const { t } = useTranslation();
    return (
      <div>
        {data.date && <p>{data.date}</p>}
        <p>{data.name}</p>
        <p>{data.mobileNumber}</p>
        {data.source && <p>{t("ES_APPLICATION_DETAILS_APPLICATION_CHANNEL_" + data.source.toUpperCase())}</p>}
      </div>
    );
  };

  useEffect(() => {
    console.log("action selected", selectedAction);
    switch (selectedAction) {
      case "DSO_ACCEPT":
      case "ACCEPT":
      case "ASSIGN":
      case "GENERATE_DEMAND":
      case "FSM_GENERATE_DEMAND":
      case "REASSIGN":
      case "COMPLETE":
      case "COMPLETED":
      case "CANCEL":
      case "SENDBACK":
      case "DSO_REJECT":
      case "REJECT":
      case "DECLINE":
        return setShowModal(true);
      case "SUBMIT":
      case "FSM_SUBMIT":
        return history.push("/digit-ui/employee/fsm/modify-application/" + applicationNumber);
      case "PAY":
      case "FSM_PAY":
      case "ADDITIONAL_PAY_REQUEST":
        return history.push(`/digit-ui/employee/payment/collect/FSM.TRIP_CHARGES/${applicationNumber}`);
      default:
        console.log("default case");
        break;
    }
  }, [selectedAction]);

  //TODO: remove after conformation that no information of this sort is needed
  //   const getTimelineCaptions = (checkpoint) => {
  //     if (checkpoint.status === "COMPLAINT_FILED" && complaintDetails?.audit) {
  //       const caption = {
  //         date: Digit.DateUtils.ConvertTimestampToDate(complaintDetails.audit.details.createdTime),
  //         name: complaintDetails.audit.citizen.name,
  //         mobileNumber: complaintDetails.audit.citizen.mobileNumber,
  //         source: complaintDetails.audit.source,
  //       };
  //       return <TLCaption data={caption} />;
  //     }
  //     return checkpoint.caption && checkpoint.caption.length !== 0 ? <TLCaption data={checkpoint.caption[0]} /> : null;
  //   };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAction(null);
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const submitAction = (data) => {
    // console.log("find submit action data here", data);
    mutate(data, {
      onError: (error, variables) => {
        // console.log("find error here",error)
        setShowToast({ key: "error", action: error });
        setTimeout(closeToast, 5000);
      },
      onSuccess: (data, variables) => {
        setShowToast({ key: "success", action: selectedAction });
        setTimeout(closeToast, 5000);
        queryClient.invalidateQueries("FSM_CITIZEN_SEARCH");
      },
    });
    closeModal();
  };

  const getTimelineCaptions = (checkpoint) => {
    // console.log("tl", checkpoint);
    if (checkpoint.status === "CREATED") {
      const caption = {
        date: Digit.DateUtils.ConvertTimestampToDate(applicationData.auditDetails.createdTime),
        name: applicationData.citizen.name,
        mobileNumber: applicationData.citizen.mobileNumber,
        source: applicationData.source || "",
      };
      return <TLCaption data={caption} />;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      {!isLoading ? (
        <React.Fragment>
          <Card style={{ position: "relative" }}>
            {!DSO && (
              <LinkButton
                label={<span style={{ color: "#f47738", marginLeft: "8px" }}>{t("ES_APPLICATION_DETAILS_VIEW_AUDIT_TRAIL")}</span>}
                style={{ position: "absolute", top: 0, right: 20 }}
                onClick={() => {
                  history.push(props.parentRoute + "/application-audit/" + applicationNumber);
                }}
              />
            )}
            {applicationDetails.map((detail, index) => (
              <React.Fragment key={index}>
                {index === 0 ? (
                  <CardSubHeader style={{ marginBottom: "16px" }}>{detail.title}</CardSubHeader>
                ) : (
                  <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>{detail.title}</CardSectionHeader>
                )}
                <StatusTable>
                  {detail?.values?.map((value, index) => {
                    if (value.map === true && value.value !== "N/A") {
                      return <Row key={value.title} label={value.title} text={<img src={value.value} alt="" />} />;
                    }
                    return (
                      <Row
                        key={value.title}
                        label={value.title}
                        text={value.value || "N/A"}
                        last={index === detail?.values?.length - 1}
                        caption={value.caption}
                      />
                    );
                  })}
                </StatusTable>
              </React.Fragment>
            ))}

            <BreakLine />
            {(workflowDetails?.isLoading || isDataLoading) && <Loader />}
            {!workflowDetails?.isLoading && !isDataLoading && (
              <Fragment>
                <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>
                  {t("ES_APPLICATION_DETAILS_APPLICATION_TIMELINE")}
                </CardSectionHeader>
                {workflowDetails?.data?.timeline && workflowDetails?.data?.timeline?.length === 1 ? (
                  <CheckPoint
                    isCompleted={true}
                    label={t("CS_COMMON_" + workflowDetails?.data?.timeline[0]?.status)}
                    customChild={getTimelineCaptions(workflowDetails?.data?.timeline[0]?.status)}
                  />
                ) : (
                  <ConnectingCheckPoints>
                    {workflowDetails?.data?.timeline &&
                      workflowDetails?.data?.timeline.map((checkpoint, index, arr) => {
                        return (
                          <React.Fragment key={index}>
                            <CheckPoint
                              keyValue={index}
                              isCompleted={index === 0}
                              label={t("CS_COMMON_FSM_" + checkpoint.status)}
                              customChild={getTimelineCaptions(checkpoint)}
                            />
                          </React.Fragment>
                        );
                      })}
                  </ConnectingCheckPoints>
                )}
              </Fragment>
            )}
          </Card>
          {showModal ? (
            <ActionModal
              t={t}
              action={selectedAction}
              tenantId={tenantId}
              state={state}
              id={applicationNumber}
              closeModal={closeModal}
              submitAction={submitAction}
            />
          ) : null}
          {showToast && (
            <Toast
              error={showToast.key === "error" ? true : false}
              label={t(showToast.key === "success" ? `ES_FSM_${showToast.action}_UPDATE_SUCCESS` : showToast.action)}
              onClose={closeToast}
            />
          )}
          {!workflowDetails?.isLoading && workflowDetails?.data?.nextActions?.length > 0 && (
            <ActionBar>
              {displayMenu && workflowDetails?.data?.nextActions ? (
                <Menu
                  localeKeyPrefix={"CS_COMMON_FSM"}
                  options={workflowDetails?.data?.nextActions.map((action) => action.action)}
                  t={t}
                  onSelect={onActionSelect}
                />
              ) : null}
              <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
            </ActionBar>
          )}
        </React.Fragment>
      ) : (
        <Loader />
      )}
    </React.Fragment>
  );
};

export default ApplicationDetails;
