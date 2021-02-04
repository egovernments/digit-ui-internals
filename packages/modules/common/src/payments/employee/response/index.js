import React from "react";
import { Banner, Card, CardText, SubmitBar } from "@egovernments/digit-ui-react-components";
import { useHistory, useParams, Link, LinkLabel } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const SuccessfulPayment = (props) => {
  const { addParams, clearParams } = props;
  const { t } = useTranslation();
  let { consumerCode, receiptNumber, businessService } = useParams();
  receiptNumber = receiptNumber.replace(/%2F/g, "/");

  const getMessage = () => "PAYMENT COLLECTED";
  console.log("--------->", consumerCode);

  const printReciept = async () => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const payments = await Digit.PaymentService.getReciept(tenantId, businessService, { receiptNumbers: receiptNumber });
    let response = { filestoreIds: [payments.Payments[0]?.fileStoreId] };
    if (!payments.Payments[0]?.fileStoreId) {
      response = await Digit.PaymentService.generatePdf(tenantId, { Payments: payments.Payments });
      console.log({ response });
    }
    const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response.filestoreIds[0]], "_blank");
  };

  return (
    <Card>
      <Banner message={getMessage()} info="Receipt No." applicationNumber={receiptNumber} successful={true} />
      <CardText>
        {t(
          "The notification along with applicant number is sent to your applicant’s mobile number. Applicant can track the application status using mobile or web app."
        )}
      </CardText>
      <div className="primary-label-btn d-flex" onClick={printReciept}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
        </svg>
        PRINT RECEIPT
      </div>
    </Card>
  );
};

export const FailedPayment = (props) => {
  const { addParams, clearParams } = props;
  const { t } = useTranslation();
  const { consumerCode } = useParams();

  const getMessage = () => "Failure !";
  return (
    <Card>
      <Banner message={getMessage()} complaintNumber={consumerCode} successful={false} />
      <CardText>{t("ES_COMMON_TRACK_COMPLAINT_TEXT")}</CardText>
      <Link to="/digit-ui/employee">
        <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};
