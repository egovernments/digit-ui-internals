import { ActionLinks, CardSectionHeader, CheckPoint, ConnectingCheckPoints, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PTWFCaption from "./PTWFCaption";

const PTWFApplicationTimeline = (props) => {
  const { t } = useTranslation();
  const businessService = (props.application?.creationReason && `PT.${props.application.creationReason}`) || "PT.CREATE";
  const { isLoading, data } = Digit.Hooks.useWorkflowDetails({
    tenantId: props.application?.tenantId,
    id: props.id,
    moduleCode: businessService,
  });

  const getTimelineCaptions = (checkpoint) => {
    if (checkpoint.status === "CREATED") {
      const caption = {
        date: Digit.DateUtils.ConvertTimestampToDate(props.application?.auditDetails.createdTime),
        source: props.application?.channel || "",
      };
      return <PTWFCaption data={caption} />;
    } else if (
      checkpoint.status === "PENDING_APPL_FEE_PAYMENT" ||
      checkpoint.status === "ASSING_DSO" ||
      checkpoint.status === "PENDING_DSO_APPROVAL"
    ) {
      const caption = {
        date: Digit.DateUtils.ConvertTimestampToDate(props.application?.auditDetails.createdTime),
        name: checkpoint.assigner.name,
      };
      return <PTWFCaption data={caption} />;
    } else if (checkpoint.status === "DSO_REJECTED" || (checkpoint.status === checkpoint.status) === "CANCELED" || checkpoint.status === "REJECTED") {
      const caption = {
        date: Digit.DateUtils.ConvertTimestampToDate(props.application?.auditDetails.createdTime),
        name: checkpoint?.assigner?.name,
        comment: t(checkpoint?.comment),
      };
      return <PTWFCaption data={caption} />;
    } else if (checkpoint.status === "CITIZEN_FEEDBACK_PENDING") {
      return (
        <>
          {data?.nextActions.length > 0 && (
            <div>
              <Link to={`/digit-ui/citizen/fsm/rate/${props.id}`}>
                <ActionLinks>{t("CS_FSM_RATE")}</ActionLinks>
              </Link>
            </div>
          )}
        </>
      );
    } else if (checkpoint.status === "DSO_INPROGRESS") {
      const caption = {
        name: `${props.application?.dsoDetails?.displayName} (${t("ES_FSM_DSO")})`,
        mobileNumber: props.application?.dsoDetails?.mobileNumber,
        date: `${t("CS_FSM_EXPECTED_DATE")} ${Digit.DateUtils.ConvertTimestampToDate(props.application?.possibleServiceDate)}`,
      };
      return <PTWFCaption data={caption} />;
    } else if (checkpoint.status === "ACTIVE") {
      return (
        <div>
          <Link to={`/digit-ui/citizen/pt/property/properties/${props?.application?.propertyId}`}>
            <ActionLinks>{t("PT_VIEW_PROPERTY_DETAILS")}</ActionLinks>
          </Link>
        </div>
      );
    } else {
      const caption = {
        date: Digit.DateUtils.ConvertTimestampToDate(props.application?.auditDetails.lastModified),
        name: checkpoint?.assigner?.name,
        comment: t(checkpoint?.comment),
      };
      return <PTWFCaption data={caption} />;
    }
  };

  const showNextActions = (nextAction) => {
    switch (nextAction?.action) {
      case "PAY":
        return (
          <div style={{ marginTop: "24px", position: "fixed", bottom: "0px", width: "100%", marginLeft: "-6%"  }}>
            <Link
              to={{ pathname: `/digit-ui/citizen/payment/collect/FSM.TRIP_CHARGES/${props.id}`, state: { tenantId: props.application.tenantId } }}
            >
              <SubmitBar label={t("CS_APPLICATION_DETAILS_MAKE_PAYMENT")} />
            </Link>
          </div>
        );
      case "SUBMIT_FEEDBACK":
        return (
          <div style={{ marginTop: "24px" }}>
            <Link to={`/digit-ui/citizen/fsm/rate/${props.id}`}>
              <SubmitBar label={t("CS_APPLICATION_DETAILS_RATE")} />
            </Link>
          </div>
        );
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      {!isLoading && (
        <Fragment>
          {data?.timeline?.length > 0 && (
            <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>
              {t("CS_APPLICATION_DETAILS_APPLICATION_TIMELINE")}
            </CardSectionHeader>
          )}
          {data?.timeline && data?.timeline?.length === 1 ? (
            <CheckPoint
              isCompleted={true}
              label={t((data?.timeline[0]?.state && `WF_${businessService}_${data.timeline[0].state}`) || "NA")}
              customChild={getTimelineCaptions(data?.timeline[0])}
            />
          ) : (
            <ConnectingCheckPoints>
              {data?.timeline &&
                data?.timeline.map((checkpoint, index, arr) => {
                  return (
                    <React.Fragment key={index}>
                      <CheckPoint
                        keyValue={index}
                        isCompleted={index === 0}
                        label={t((checkpoint.state && `WF_${businessService}_${checkpoint.state}`) || "NA")}
                        customChild={getTimelineCaptions(checkpoint)}
                      />
                    </React.Fragment>
                  );
                })}
            </ConnectingCheckPoints>
          )}
        </Fragment>
      )}
      {data && showNextActions(data?.nextActions[0])}
    </React.Fragment>
  );
};

export default PTWFApplicationTimeline;
