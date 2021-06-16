import { ActionBar, Card, Header, Loader, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ActionModal from "../components/Modal";

const ReceiptDetails = () => {

  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const { id: receiptId, service: businessService } = useParams();

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const isupdate = Digit.SessionStorage.get("isupdate")
  const { isLoading, isError, error, data, ...rest } = Digit.Hooks.receipts.useReceiptsSearch({ receiptNumbers: decodeURIComponent(receiptId) }, tenantId, {}, isupdate, businessService);


  const cancelReceipt = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const submitAction = (data) => { };

  if (isLoading) {
    return <Loader />;
  }
  const PaymentReceipt = !isLoading && data?.Payments?.length > 0 ? data.Payments[0] : {};

  return (
    <React.Fragment>
      <div style={{ width: "30%", fontFamily: "calibri", color: "#FF0000" }}>
        <Header>{t("CR_RECEIPT_SUMMARY")}</Header>
      </div>
      {!isLoading && data?.Payments?.length > 0 ? (
        <div >
          <Card>
            <StatusTable>
              <Row label={t("CR_RECEIPT_NUMBER")} text={PaymentReceipt.paymentDetails[0].receiptNumber} textStyle={{ whiteSpace: "pre" }} />
              <Row label={t("CR_RECEIPT_CONSUMER_NUMBER")} text={PaymentReceipt.paymentDetails[0].bill.consumerCode} textStyle={{ whiteSpace: "pre" }} />
              <Row label={t("CR_RECEIPT_PAYMENT_DATE")} text={PaymentReceipt.paymentDetails[0].receiptDate} />
              <Row label={t("CR_RECEIPT_PAYER_NAME")} text={PaymentReceipt.payerName} />
              <Row label={t("CR_RECEIPT_PAYER_NUMBER")} text={PaymentReceipt.mobileNumber} />
              <Row label={t("CR_RECEIPT_SERVICE_TYPE")} text={PaymentReceipt.paymentDetails[0].businessService} />
              <Row label={t("CR_RECEIPT_BILL_PERIOD")} text={PaymentReceipt.paymentDetails[0].bill.billDetails[0].fromPeriod} />
              <Row label={t("CR_RECEIPT_AMOUNT")} text={PaymentReceipt.totalAmountPaid} />
              <Row label={t("CR_RECEIPT_PENDING_AMOUNT")} text={PaymentReceipt.totalDue} />
              <Row label={t("CR_RECEIPT_PAYMENT_MODE")} text={PaymentReceipt.paymentMode} />
              <Row label={t("CR_RECEIPT_TXN_ID")} text={PaymentReceipt.transactionNumber} />
              <Row label={t("CR_RECEIPT_G8_RECEIPT_NO")} text={PaymentReceipt.paymentDetails[0].manualReceiptNumber} />
              <Row label={t("CR_RECEIPT_G8_RECEIPT_DATE")} text={PaymentReceipt.paymentDetails[0].manualReceiptDate} />
            </StatusTable>
          </Card>
        </div>
      ) : null}
      {showModal ? (
        <ActionModal t={t} tenantId={tenantId} applicationData={data} closeModal={closeModal} submitAction={submitAction} />
      ) : null}
      <ActionBar>
        {PaymentReceipt.paymentStatus !== "CANCELLED" && (PaymentReceipt.instrumentStatus = "APPROVED" || PaymentReceipt.instrumentStatus == "REMITTED") && <SubmitBar label={t("CR_CANCEL_RECEIPT_BUTTON")} onSubmit={() => cancelReceipt()} />}
      </ActionBar>
    </React.Fragment>
  );
};

export default ReceiptDetails;
