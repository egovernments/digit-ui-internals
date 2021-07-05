import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import {
  BreakLine,
  Card,
  CardSubHeader,
  StatusTable,
  Row,
  Loader,
  CardSectionHeader,
  ConnectingCheckPoints,
  CheckPoint,
  Rating,
  ActionLinks,
} from "@egovernments/digit-ui-react-components";
import TLCaption from "./TLCaption";
import { Link } from "react-router-dom";
import PropertyDocuments from "./PropertyDocuments";
import PropertyFloors from "./PropertyFloors";
import PropertyEstimates from "./PropertyEstimates";
import PropertyOwners from "./PropertyOwners";

function ApplicationDetailsContent({ applicationDetails, workflowDetails, isDataLoading, applicationData, businessService, timelineStatusPrefix }) {
  const { t } = useTranslation();

  const getTimelineCaptions = (checkpoint) => {
    if (checkpoint.status === "CREATED") {
      const caption = {
        date: Digit.DateUtils.ConvertTimestampToDate(applicationData?.auditDetails?.createdTime),
        name: applicationData.citizen.name,
        mobileNumber: applicationData.citizen.mobileNumber,
        source: applicationData.source || "",
      };
      return <TLCaption data={caption} />;
    } else if (checkpoint.status === "PENDING_APPL_FEE_PAYMENT") {
      const caption = {
        date: Digit.DateUtils.ConvertTimestampToDate(applicationData?.auditDetails.createdTime),
        name: checkpoint.assigner.name,
      };
      return <TLCaption data={caption} />;
    } else if (checkpoint.status === "COMPLETED") {
      return (
        <div>
          <Rating withText={true} text={t(`ES_FSM_YOU_RATED`)} currentRating={checkpoint.rating} />
          <Link to={`/digit-ui/employee/fsm/rate-view/${applicationNumber}`}>
            <ActionLinks>{t("CS_FSM_RATE_VIEW")}</ActionLinks>
          </Link>
        </div>
      );
    }
  };

  // console.log(applicationDetails?.applicationDetails, "inside app details content");

  return (
    <Card style={{ position: "relative" }}>
      {applicationDetails?.applicationDetails?.map((detail, index) => (
        <React.Fragment key={index}>
          {index === 0 && !detail.asSectionHeader ? (
            <CardSubHeader style={{ marginBottom: "16px" }}>{t(detail.title)}</CardSubHeader>
          ) : (
            <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>{t(detail.title)}</CardSectionHeader>
          )}
          <StatusTable>
            {detail?.values?.map((value, index) => {
              if (value.map === true && value.value !== "N/A") {
                return <Row key={t(value.title)} label={t(value.title)} text={<img src={t(value.value)} alt="" />} />;
              }
              return (
                <Row
                  key={t(value.title)}
                  label={t(value.title)}
                  text={t(value.value) || "N/A"}
                  last={index === detail?.values?.length - 1}
                  caption={value.caption}
                  className="border-none"
                />
              );
            })}
          </StatusTable>
          {detail?.additionalDetails?.floors && <PropertyFloors floors={detail?.additionalDetails?.floors} />}
          {detail?.additionalDetails?.owners && <PropertyOwners owners={detail?.additionalDetails?.owners} />}
          {detail?.additionalDetails?.documents && <PropertyDocuments documents={detail?.additionalDetails?.documents} />}
          {detail?.additionalDetails?.taxHeadEstimatesCalculation && (
            <PropertyEstimates taxHeadEstimatesCalculation={detail?.additionalDetails?.taxHeadEstimatesCalculation} />
          )}
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
              label={t(`${timelineStatusPrefix}${workflowDetails?.data?.timeline[0]?.state}`)}
              customChild={getTimelineCaptions(workflowDetails?.data?.timeline[0])}
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
                        label={t(`${timelineStatusPrefix}${checkpoint.state}`)}
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
  );
}

export default ApplicationDetailsContent;
