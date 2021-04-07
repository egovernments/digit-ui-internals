import { Banner, Card, CardText, LinkButton, Loader, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import getPTAcknowledgementData from "../../../getPTAcknowledgementData";
import { convertToProperty } from "../../../utils";

const GetActionMessage = (props) => {
  const { t } = useTranslation();
  if (props.isSuccess) {
    return t("CS_PROPERTY_APPLICATION_SUCCESS");
  } else if (props.isLoading) {
    return t("CS_PROPERTY_APPLICATION_PENDING");
  } else if (!props.isSuccess) {
    return t("CS_PROPERTY_APPLICATION_FAILED");
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
      applicationNumber={props.data?.Properties[0].acknowldgementNumber}
      info={props.t("PT_APPLICATION_NO")}
      successful={props.isSuccess}
    />
  );
};

const PTAcknowledgement = ({ data, onSuccess }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const mutation = Digit.Hooks.pt.usePropertyAPI(data?.address?.city ? data.address?.city?.code : tenantId);
  const coreData = Digit.Hooks.useCoreData();

  useEffect(() => {
    try {
      let formdata = convertToProperty(data);
      mutation.mutate(formdata, {
        onSuccess,
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleDownloadPdf = () => {
    const { Properties = [] } = mutation.data;
    const Property = (Properties && Properties[0]) || {};
    const tenantInfo = coreData.tenants.find((tenant) => tenant.code === Property.tenantId);
    const data = getPTAcknowledgementData({ ...Property }, tenantInfo, t);
    Digit.Utils.pdf.generate(data);
  };

  return mutation.isLoading || mutation.isIdle ? (
    <Loader />
  ) : (
    <Card>
      <BannerPicker t={t} data={mutation.data} isSuccess={mutation.isSuccess} isLoading={mutation.isIdle || mutation.isLoading} />
      {mutation.isSuccess && <CardText>{t("CS_FILE_PROPERTY_RESPONSE")}</CardText>}
      {!mutation.isSuccess && <CardText>{t("CS_FILE_PROPERTY_FAILED_RESPONSE")}</CardText>}
      {mutation.isSuccess && (
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
        />
      )}
      <StatusTable>
        {mutation.isSuccess && (
          <Row rowContainerStyle={rowContainerStyle} last label={t("PT_COMMON_TABLE_COL_PT_ID")} text={mutation?.data?.Properties[0]?.propertyId} textStyle={{ whiteSpace: "pre", width: '60%' }} />
        )}
      </StatusTable>
      <Link to={`/digit-ui/citizen`}>
        <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default PTAcknowledgement;
