import React, { useEffect } from "react";
import { Banner, Card, CardText, SubmitBar } from "@egovernments/digit-ui-react-components";
import { useHistory, useParams, Link, LinkLabel } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";

export const SuccessfulPayment = (props) => {
  const { addParams, clearParams } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  props.setLink("Response");
  let { consumerCode, receiptNumber, businessService } = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  receiptNumber = receiptNumber.replace(/%2F/g, "/");

  useEffect(() => {
    return () => {
      queryClient.clear();
    };
  }, []);

  const getMessage = () => t("ES_PAYMENT_COLLECTED");
  // console.log("--------->", consumerCode);

  const { data: generatePdfKey } = Digit.Hooks.useCommonMDMS(tenantId, "common-masters", "ReceiptKey", {
    select: (data) =>
      data["common-masters"]?.uiCommonPay?.filter(({ code }) => businessService?.includes(code))[0]?.receiptKey || "consolidatedreceipt",
  });

  const printReciept = async () => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const state = tenantId?.split(".")[0];
    const payments = await Digit.PaymentService.getReciept(tenantId, businessService, { receiptNumbers: receiptNumber });
    let response = { filestoreIds: [payments.Payments[0]?.fileStoreId] };

    if (!payments.Payments[0]?.fileStoreId) {
      response = await Digit.PaymentService.generatePdf(state, { Payments: payments.Payments }, generatePdfKey);
      // console.log({ response });
    }
    const fileStore = await Digit.PaymentService.printReciept(state, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response.filestoreIds[0]], "_blank");
  };

  return (
    <Card>
      <Banner message={getMessage()} info="Receipt No." applicationNumber={receiptNumber} successful={true} />
      <CardText>{t("ES_PAYMENT_SUCCESSFUL_DESCRIPTION")}</CardText>
      {generatePdfKey ? (
        <div className="primary-label-btn d-grid" style={{ marginLeft: "unset" }} onClick={printReciept}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
          </svg>
          {t("CS_COMMON_PRINT_RECEIPT")}
        </div>
      ) : null}
      <Link to={"/digit-ui/employee"}>
        <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export const FailedPayment = (props) => {
  props.setLink("Response");
  const { addParams, clearParams } = props;
  const { t } = useTranslation();
  const { consumerCode } = useParams();

  const getMessage = () => t("ES_PAYMENT_COLLECTED_ERROR");
  return (
    <Card>
      <Banner message={getMessage()} complaintNumber={consumerCode} successful={false} />
      <CardText>{t("ES_PAYMENT_FAILED_DETAILS")}</CardText>
      <Link to="/digit-ui/employee">
        <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};
