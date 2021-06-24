
import { ActionBar, Banner, Card, CardText, LinkButton, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const printReciept = async (businessService, receiptNumber) => {

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = tenantId?.split(".")[0];
  const payments = await Digit.PaymentService.getReciept(tenantId, businessService, { receiptNumbers: receiptNumber });
  let response = { filestoreIds: [payments.Payments[0]?.fileStoreId] };
  if (!payments.Payments[0]?.fileStoreId) {
    response = await Digit.PaymentService.generatePdf(state, { Payments: payments.Payments }, "consolidatedreceipt");
  }
  const fileStore = await Digit.PaymentService.printReciept(state, { fileStoreIds: response.filestoreIds[0] });
  window.open(fileStore[response.filestoreIds[0]], "_blank");
};

const GetMessage = (type, action, isSuccess, isEmployee, t) => {
  return t(`CR_APPLY_${isSuccess ? "SUCCESS" : "FAILURE"}_MESSAGE_MAIN`);
};

const GetActionMessage = (action, isSuccess, isEmployee, t) => {
  return GetMessage("ACTION", action, isSuccess, isEmployee, t);
};

const GetLabel = (action, isSuccess, isEmployee, t) => {
  if (isSuccess && action == "CREATE") {
    return GetMessage("LABEL", action, isSuccess, isEmployee, t);
  }
};

const BannerPicker = (props) => {
  return (
    <Banner
      message={(GetActionMessage(props.action, props.isSuccess, props.isEmployee, props.t))}
      applicationNumber={props.data?.Payments[0]?.paymentDetails[0].receiptNumber}
      info={props.t("CR_RECEIPT_NUMBER")}
      successful={props.isSuccess}
    />
  );
};

const ReceiptAcknowledgement = (props) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { state } = props.location;
  const mutation = Digit.Hooks.receipts.useReceiptsUpdate(tenantId, state?.businessService);
  useEffect(() => {
    const onSuccess = () => {
    };
    if (state.key === "UPDATE") {
      mutation.mutate(
        {
          paymentWorkflows: [state.paymentWorkflow]
        },
        {
          onSuccess,
        }
      );
    }
  }, []);

  const DisplayText = (action, isSuccess, isEmployee, t) => {
    if (!isSuccess) {
      return mutation?.error?.response?.data?.Errors[0].code
    } else {
      Digit.SessionStorage.set("isupdate", Math.floor(100000 + Math.random() * 900000));
      return t('CR_APPLY_FORWARD_SUCCESS');
    }
  };

  if (mutation.isLoading || mutation.isIdle) {
    return <Loader />;
  }

  return (
    <Card>
      <BannerPicker
        t={t}
        data={mutation.data}
        action={state.action}
        isSuccess={mutation.isSuccess}
        isLoading={mutation.isIdle || mutation.isLoading}
        isEmployee={props.parentRoute.includes("employee")}
      />
      <CardText>{t(DisplayText(state.action, mutation.isSuccess, props.parentRoute.includes("employee"), t), t)}</CardText>
      {mutation.isSuccess && (
        <CardText>
          <LinkButton
            label={
              <div className="response-download-button">
                <span>
                  <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 5H3C1.34 5 0 6.34 0 8V14H4V18H16V14H20V8C20 6.34 18.66 5 17 5ZM14 16H6V11H14V16ZM17 9C16.45 9 16 8.55 16 8C16 7.45 16.45 7 17 7C17.55 7 18 7.45 18 8C18 8.55 17.55 9 17 9ZM16 0H4V4H16V0Z" fill="#F47738" />
                  </svg>
                </span>
                <span className="download-button">{t("COMMON_TABLE_PRINT")}</span>
              </div>
            }
            style={{ width: "100px" }}
            onClick={() => { printReciept(mutation.data?.Payments[0]?.paymentDetails[0]?.businessService, mutation.data?.Payments[0]?.paymentDetails[0].receiptNumber) }}
          />
        </CardText>)}
      <ActionBar>
        <Link to={`${props.parentRoute.includes("employee") ? "/digit-ui/employee" : "/digit-ui/citizen"}`}>
          <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
        </Link>
      </ActionBar>
    </Card>
  );
};

export default ReceiptAcknowledgement;
