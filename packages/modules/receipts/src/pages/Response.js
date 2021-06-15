
import React, { useEffect } from "react";
import { Card, Banner, CardText, SubmitBar, Loader, LinkButton, ActionBar } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


const GetMessage = (type, action, isSuccess, isEmployee, t) => {
  return t(`EMPLOYEE_RESPONSE_${action ? action : "CREATE"}_${type}${isSuccess ? "" : "_ERROR"}`);
};

const GetActionMessage = (action, isSuccess, isEmployee, t) => {
  return GetMessage("ACTION", action, isSuccess, isEmployee, t);
};

const GetLabel = (action, isSuccess, isEmployee, t) => {
  if(isSuccess && action=="CREATE"){
  return GetMessage("LABEL", action, isSuccess, isEmployee, t);
  }
};


const BannerPicker = (props) => {
  return (
    <Banner
      message={(GetActionMessage( props.action, props.isSuccess, props.isEmployee, props.t))}
      applicationNumber={props.data?.Employees[0].code}
      info={GetLabel(props.action, props.isSuccess, props.isEmployee, props.t)}
      successful={props.isSuccess}
    />
  );
};

const Response = (props) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const { state } = props.location;

  const mutation = state.key === "UPDATE" ? Digit.Hooks.hrms.useHRMSUpdate(tenantId) : Digit.Hooks.hrms.useHRMSCreate(tenantId);
  const coreData = Digit.Hooks.useCoreData();

  useEffect(() => {
    const onSuccess = () => {
    //   queryClient.clear();
    };
    if (state.key === "UPDATE") {
      mutation.mutate(
        {
          Employees: state.Employees
        },
        {
          onSuccess,
        }
      );
    } else {
      mutation.mutate(state, {
        onSuccess,
      });
    }
  }, []);


const DisplayText = (action, isSuccess, isEmployee, t) => {
  if(!isSuccess){
    return mutation?.error?.response?.data?.Errors[0].code
  }else{
    Digit.SessionStorage.set("isupdate", Math.floor(100000 + Math.random() * 900000));
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

export default Response;
