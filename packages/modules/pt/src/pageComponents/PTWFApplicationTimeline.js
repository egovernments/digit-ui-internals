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
    if (checkpoint.state === "OPEN") {
      const caption = {
        date: Digit.DateUtils.ConvertTimestampToDate(props.application?.auditDetails?.createdTime),
        source: props.application?.channel || "",
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
    }
    // else if (checkpoint.state === "CORRECTIONPENDING") {
    //   return (
    //     <div>
    //       <Link to={`/digit-ui/citizen/pt/property/properties/${props?.application?.propertyId}`}>
    //         <ActionLinks>{t("EDIT_PROPERTY")}</ActionLinks>
    //       </Link>
    //     </div>
    //   );
    // }
    else {
      const caption = {
        date: Digit.DateUtils.ConvertTimestampToDate(props.application?.auditDetails.lastModified),
        name: checkpoint?.assigner?.name,
        comment: t(checkpoint?.comment),
      };
      return <PTWFCaption data={caption} />;
    }
  };

  const showNextActions = (nextActions) => {
    let nextAction = nextActions[0];
    const next = nextActions.map((action) => action.action);
    if (next.includes("PAY") || next.includes("EDIT")) {
      let currentIndex = next.indexOf("EDIT") || next.indexOf("PAY");
      currentIndex = currentIndex != -1 ? currentIndex : next.indexOf("PAY");
      nextAction = nextActions[currentIndex];
    }
    switch (nextAction?.action) {
      case "PAY":
        return (
          <div style={{ marginTop: "1em", bottom: "0px", width: "100%", marginBottom: "1.2em" }}>
            <Link
              to={{ pathname: `/digit-ui/citizen/payment/collect/${businessService}/${props.id}`, state: { tenantId: props.application.tenantId } }}
            >
              <SubmitBar label={t("CS_APPLICATION_DETAILS_MAKE_PAYMENT")} />
            </Link>
          </div>
        );
      case "EDIT":
        return (
          <div style={{ marginTop: "1em", bottom: "0px", width: "100%", marginBottom: "1.2em" }}>
            {businessService != "PT.MUTATION" && (
              <Link
                to={{
                  pathname: `/digit-ui/citizen/pt/property/edit-application/action=edit-${businessService}/${props.id}`,
                  state: { tenantId: props.application.tenantId },
                }}
              >
                <SubmitBar label={t("CS_APPLICATION_DETAILS_EDIT")} />
              </Link>
            )}
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
                        label={checkpoint.state ? t(`WF_${businessService}_${checkpoint.state}`) : "NA"}
                        customChild={getTimelineCaptions(checkpoint)}
                      />
                    </React.Fragment>
                  );
                })}
            </ConnectingCheckPoints>
          )}
        </Fragment>
      )}
      {data && showNextActions(data?.nextActions)}
    </React.Fragment>
  );
};

export default PTWFApplicationTimeline;
