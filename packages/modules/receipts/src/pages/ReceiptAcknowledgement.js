
import { ActionBar, Banner, Card, CardText, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";


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
      info={GetLabel(props.action, props.isSuccess, props.isEmployee, props.t)}
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
      <ActionBar>
        <Link to={`${props.parentRoute.includes("employee") ? "/digit-ui/employee" : "/digit-ui/citizen"}`}>
          <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
        </Link>
      </ActionBar>
    </Card>
  );
};

export default ReceiptAcknowledgement;
