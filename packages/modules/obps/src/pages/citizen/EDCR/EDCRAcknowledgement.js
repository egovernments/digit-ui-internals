import { Banner, Card, CardText, LinkButton, ActionBar, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import getPTAcknowledgementData from "../utils/getTLAcknowledgementData";
// import * as func from "../utils";


const EDCRAcknowledgement = (props) => {
  const edcrData = props?.data?.[0];
  const { t } = useTranslation();

  const printReciept = async () => {
    var win = window.open(edcrData.planReport, '_blank');
    if (win) {
      win.focus();
    }
  };

  const routeToBPAScreen = async () => {
    // window.location.assign(`${window.location.origin}/digit-ui/employee/payment/collect/TL/${state?.data?.[0]?.applicationNumber}/${state?.data?.[0]?.tenantId}`);
  }

  return (
    <div>
      {edcrData.status == "Accepted" ?
        <Card style={{ padding: "0px" }}>
          <Banner
            message={t("EDCR_ACKNOWLEDGEMENT_SUCCESS_MESSAGE_LABEL")}
            applicationNumber={edcrData?.edcrNumber}
            info={t("EDCR_ACKNOWLEDGEMENT_SUCCESS_SUB_MESSAGE_LABEL")}
            successful={true}
            style={{ padding: "10px" }}
          />
          <CardText style={{ padding: "0px 8px" }}>{t("EDCR_ACKNOWLEDGEMENT_SUCCESS_MESSAGE_TEXT_LABEL")}</CardText>
          <div className="primary-label-btn d-grid" style={{ marginLeft: "unset", marginBottom: "10px", padding: "0px 8px" }} onClick={printReciept}>
            <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.3334 8H14V0H6.00002V8H0.666687L10 17.3333L19.3334 8ZM0.666687 20V22.6667H19.3334V20H0.666687Z" fill="#F47738" />
            </svg>
            {t("EDCR_DOWNLOAD_SCRUTINY_REPORT_LABEL")}
          </div>
          <div onClick={routeToBPAScreen} style={{ padding: "0px 8px" }}>
            <SubmitBar label={t("BPA_APPLY_FOR_BPA_LABEL")} />
          </div>
          <Link to={`/digit-ui/citizen`} >
            <LinkButton label={t("CORE_COMMON_GO_TO_HOME")} />
          </Link>
        </Card> :
        <Card style={{ padding: "0px" }}>
          <Banner
            message={t("EDCR_ACKNOWLEDGEMENT_REJECTED_MESSAGE_LABEL")}
            applicationNumber={edcrData?.edcrNumber}
            info={t("EDCR_ACKNOWLEDGEMENT_SUCCESS_SUB_MESSAGE_LABEL")}
            successful={false}
            style={{ padding: "10px" }}
          />
          <CardText style={{ padding: "0px 8px" }}>{t("EDCR_ACKNOWLEDGEMENT_REJECTED_MESSAGE_TEXT_LABEL")}</CardText>
          <div className="primary-label-btn d-grid" style={{ marginLeft: "unset", marginBottom: "10px", padding: "0px 8px" }} onClick={printReciept}>
            <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.3334 8H14V0H6.00002V8H0.666687L10 17.3333L19.3334 8ZM0.666687 20V22.6667H19.3334V20H0.666687Z" fill="#F47738" />
            </svg>
            {t("EDCR_DOWNLOAD_SCRUTINY_REPORT_LABEL")}
          </div>
          <Link to={`/digit-ui/citizen`} >
            <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
          </Link>
        </Card>
      }

    </div>
  );
};
export default EDCRAcknowledgement;
