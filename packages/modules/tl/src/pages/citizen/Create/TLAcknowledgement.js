import { Banner, Card, CardText, LinkButton, Loader, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
//import getPTAcknowledgementData from "../../../getPTAcknowledgementData";
import { convertToTrade, convertToUpdateProperty } from "../../../utils";

const GetActionMessage = (props) => {
  const { t } = useTranslation();
  if (props.isSuccess) {
    return !window.location.href.includes("edit-application") ? t("CS_TRADE_APPLICATION_SUCCESS") : t("CS_PROPERTY_UPDATE_APPLICATION_SUCCESS");
  } else if (props.isLoading) {
    return !window.location.href.includes("edit-application") ? t("CS_TRADE_APPLICATION_SUCCESS") : t("CS_PROPERTY_UPDATE_APPLICATION_PENDING");
  } else if (!props.isSuccess) {
    return !window.location.href.includes("edit-application") ? t("CS_TRADE_APPLICATION_FAILED") : t("CS_PROPERTY_UPDATE_APPLICATION_FAILED");
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

  useEffect(() => {
    try {
      let tenantId = data?.address?.city ? data.address?.city?.code : tenantId;
      data.tenantId = tenantId;
      let formdata = convertToTrade(data);
      formdata.Licenses[0].tenantId = formdata?.Licenses[0]?.tenantId || tenantId;
      mutation.mutate(formdata, {
        onSuccess,
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleDownloadPdf = async () => {
    // const { Properties = [] } = mutation.data;
    // const Property = (Properties && Properties[0]) || {};
    // const data = await getPTAcknowledgementData({ ...Property }, tenantInfo, t);
    // Digit.Utils.pdf.generate(data);
  };

  return mutation.isLoading || mutation.isIdle ? (
    <Loader />
  ) : (
    <Card>
      <BannerPicker t={t} data={mutation.data} isSuccess={mutation.isSuccess} isLoading={mutation.isIdle || mutation.isLoading} />
      {mutation.isSuccess && <CardText>{t("TL_FILE_TRADE_RESPONSE")}</CardText>}
      {!mutation.isSuccess && <CardText>{t("TL_FILE_TRADE_FAILED_RESPONSE")}</CardText>}
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
      {mutation.isSuccess && <SubmitBar label={t("TL_DOWNLOAD_ACK_FORM")} onSubmit={handleDownloadPdf} />}

      <Link to={`/digit-ui/citizen`}>
        <LinkButton label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default TLAcknowledgement;
