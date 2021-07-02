import { Banner, Card, CardText, LinkButton, Loader, Row, StatusTable, SubmitBar, Toast } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
//import getPTAcknowledgementData from "../../../getPTAcknowledgementData";
import { convertToTrade, convertToUpdateTrade, convertToEditTrade, stringToBoolean } from "../../../utils";
import getPDFData from "../../../utils/getTLAcknowledgementData";

const GetActionMessage = (props) => {
  const { t } = useTranslation();
  if (props.isSuccess) {
    return !window.location.href.includes("edit-application") ? t("CS_TRADE_APPLICATION_SUCCESS") : t("CS_TRADE_UPDATE_APPLICATION_SUCCESS");
  } else if (props.isLoading) {
    return !window.location.href.includes("edit-application") ? t("CS_TRADE_APPLICATION_SUCCESS") : t("CS_TRADE_UPDATE_APPLICATION_PENDING");
  } else if (!props.isSuccess) {
    return !window.location.href.includes("edit-application") ? t("CS_TRADE_APPLICATION_FAILED") : t("CS_TRADE_UPDATE_APPLICATION_FAILED");
  }
};

const rowContainerStyle = {
  padding: "4px 0px",
  justifyContent: "space-between",
};

const BannerPicker = (props) => {
  return (
    <Banner
      message={GetActionMessage(props)}
      applicationNumber={props.data?.Licenses[0]?.applicationNumber}
      info={props.isSuccess ? props.t("TL_REF_NO_LABEL") : ""}
      successful={props.isSuccess}
    />
  );
};

const TLAcknowledgement = ({ data, onSuccess }) => {
  const { t } = useTranslation();

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const mutation = Digit.Hooks.tl.useTradeLicenseAPI(
    data?.address?.city ? data.address?.city?.code : tenantId,
    !window.location.href.includes("edit-application")
  );
  const mutation1 = Digit.Hooks.tl.useTradeLicenseAPI(
    data?.address?.city ? data.address?.city?.code : tenantId,
    false
  );
  const mutation2 = Digit.Hooks.tl.useTradeLicenseAPI(
    data?.address?.city ? data.address?.city?.code : tenantId,
    false
  );
  // const mutationDirect = Digit.Hooks.tl.useTradeLicenseAPI(
  //   data?.address?.city ? data.address?.city?.code : tenantId,
  //   false
  // );
  const isEdit = window.location.href.includes("edit-application");
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};
  const stateId = tenantId.split(".")[0];
  const { isLoading, data: fydata = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "egf-master", "FinancialYear");
  console.log("data",data)
  console.log("fydata",fydata);
  let isDirectRenewal = sessionStorage.getItem("isDirectRenewal")?stringToBoolean(sessionStorage.getItem("isDirectRenewal")):null;
  

  useEffect(() => {
    try {
      let tenantId = data?.address?.city ? data.address?.city?.code : tenantId;
      data.tenantId = tenantId;
      let formdata = !isEdit?convertToTrade(data):convertToEditTrade(data,fydata["egf-master"]?fydata["egf-master"].FinancialYear.filter(y => y.module === "TL"):[]);
      formdata.Licenses[0].tenantId = formdata?.Licenses[0]?.tenantId || tenantId;
      
      !isEdit ?mutation.mutate(formdata, {
        onSuccess,
      }):fydata["egf-master"] && fydata["egf-master"].FinancialYear.length>0?(isDirectRenewal?mutation2.mutate(formdata, {
        onSuccess,
      }) : mutation1.mutate(formdata, {
        onSuccess,
      })):console.log("skipped");
    } catch (err) {
      console.log(err);
    }
  }, [fydata]);

  useEffect(() => {
    if(mutation.isSuccess || (mutation1.isSuccess && isEdit && !isDirectRenewal))
      {
        try{
        let tenantId = data?.address?.city ? data.address?.city?.code : Digit.ULBService.getCurrentTenantId();
        let Licenses = !isEdit?convertToUpdateTrade(mutation.data,data):convertToUpdateTrade(mutation1.data,data);
        mutation2.mutate(Licenses,{
          onSuccess,
        });
      }
      catch( er){
        console.info("error in update",er);
      }
    }
  },[mutation.isSuccess,mutation1.isSuccess]);

  const handleDownloadPdf = async () => {
    const { Licenses = [] } = mutation.data || mutation1.data || mutation2.data;
    const License = (Licenses && Licenses[0]) || {};
    const tenantInfo = tenants.find((tenant) => tenant.code === License.tenantId);
    let res = License;
    const data = getPDFData({ ...res }, tenantInfo, t);
    data.then((ress) => Digit.Utils.pdf.generate(ress));
  };

  
  return  (mutation2.isLoading || mutation2.isIdle) ? (
    <Loader />
  ) : (
    <Card>
      <BannerPicker t={t} data={mutation2.data} isSuccess={mutation2.isSuccess} isLoading={(mutation2.isIdle || mutation2.isLoading)} />
      {(mutation2.isSuccess) && <CardText>{t("TL_FILE_TRADE_RESPONSE")}</CardText>}
      {(!mutation2.isSuccess) && <CardText>{t("TL_FILE_TRADE_FAILED_RESPONSE")}</CardText>}
      {/* {mutation.isSuccess && (
        <LinkButton
          label={
            <div className="response-download-button">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f47738">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                </svg>
              </span>
              <span className="download-button">{t("CS_COMMON_DOWNLOAD")}</span> 
            </div>
          }
          onClick={handleDownloadPdf}
          className="w-full"
        />)}*/}
      {/* <StatusTable>
        {mutation.isSuccess && (
          <Row
            rowContainerStyle={rowContainerStyle}
            last
            label={t("TL_REF_NO_LABEL")}
            text={mutation?.data?.Licenses[0]?.applicationNumber}
            textStyle={{ whiteSpace: "pre", width: "60%" }}
          />
        )}
      </StatusTable> */}
      {(mutation2.isSuccess) && (
      <LinkButton
      label={
        <div className="response-download-button">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f47738">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
          </span>
          <span className="download-button">{t("TL_DOWNLOAD_ACK_FORM")}</span>
        </div>
      }
      style={{ width: "100px" }}
      onClick={handleDownloadPdf}
    />)}
      {mutation2.data.Licenses[0].status === "PENDINGPAYMENT" && <Link to={{
                pathname: `/digit-ui/citizen/payment/collect/${mutation2.data.Licenses[0].businessService}/${mutation2.data.Licenses[0].applicationNumber}`
              }}>
        <SubmitBar label={t("COMMON_MAKE_PAYMENT")} />
      </Link>}
      <Link to={`/digit-ui/citizen`}>
        <LinkButton label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default TLAcknowledgement;
