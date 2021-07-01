import { Banner, Card, CardText, LinkButton, ActionBar, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import getPTAcknowledgementData from "../utils/getTLAcknowledgementData";
import * as func from "../utils";


const Response = (props) => {
  debugger;
  const location = useLocation();
  const { state } = props.location;
  const [params, setParams] = useState({});
  const { isEdit } = Digit.Hooks.useQueryParams();
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};


  useEffect(() => {
    setParams(func.getQueryStringParams(location.search));
  }, [location]);
  const { t } = useTranslation();

  const printReciept = async () => {
    debugger;
    const Licenses = state?.data || [];
    const license = (Licenses && Licenses[0]) || {};
    const tenantInfo = tenants.find((tenant) => tenant.code === license.tenantId);
    const data = await getPTAcknowledgementData({ ...license }, tenantInfo, t);
    Digit.Utils.pdf.generate(data);
  };

  return (
    <div>
        <Card>
          <Banner
            message={t("TL_APPLICATION_SUCCESS_MESSAGE_MAIN")}
            applicationNumber={state?.data?.[0]?.applicationNumber}
            info={""}
            successful={true}
          />
          <CardText>{t("The notification along with your application number is sent to your applicant’s mobile number. Applicant can track the application status using mobile or web app.")}</CardText>
          <div className="primary-label-btn d-grid" style={{ marginLeft: "unset" }} onClick={printReciept}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
              </svg>
              {t("TL_PRINT_APPLICATION_LABEL")}
          </div>
          <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
            <Link to={`/digit-ui/employee`} style={{ marginRight: "1rem" }}>
              <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
            </Link>
          </ActionBar>
        </Card>
    </div>
  );
};
export default Response;
