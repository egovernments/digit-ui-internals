import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {convertEpochToDate, getvalidfromdate} from "../../../utils/index";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

const TradeLicenseList = ({ application }) => {
  sessionStorage.setItem("isDirectRenewal",true);
  const history = useHistory();
  console.log(Array.isArray(application?.tradeLicenseDetail?.owners));
  const owners = application?.tradeLicenseDetail?.owners;
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const { isLoading, data: fydata = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "egf-master", "FinancialYear");
  let mdmsFinancialYear = fydata["egf-master"]?fydata["egf-master"].FinancialYear.filter(y => y.module === "TL"):[];
  //let temp = mdmsFinancialYear.length > 0 ? parseInt(mdmsFinancialYear[0].id):0;
  let isrenewalspresent = false;
  
  async function apicall(application){

    let res = await Digit.TLService.TLsearch({tenantId:application.tenantId, filters:{licenseNumbers:application.licenseNumber}});
    let Licenses = res.Licenses;
    let FY = getvalidfromdate("",mdmsFinancialYear).finYearRange;
    Licenses && Licenses.map((ob) => {
      if(ob.financialYear === FY )
      {
        isrenewalspresent = true;
      }
    })
    if(isrenewalspresent && Licenses)
    {
      alert(t("TL_RENEWAL_PRESENT_ERROR"));
    }
    else if(Licenses)
    {
      history.push(`/digit-ui/citizen/tl/tradelicence/edit-application/action-edit/${application.applicationNumber}`);
    }
  }
  const onsubmit = () => {
    // sessionStorage.setItem("tl-trade", JSON.stringify(application));
    // let app = apicall(application);
    // console.log("promise",app);
 history.push(`/digit-ui/citizen/tl/tradelicence/renew-trade/${application.licenseNumber}/${application.tenantId}`);


  }

  return (
    <Card>
      <KeyNote keyValue={t("TL_LOCALIZATION_TRADE_NAME")} note={application.tradeName} />
      <KeyNote keyValue={t("TL_LICENSE_NO_CODE")} note={application.licenseNumber} />
        <KeyNote keyValue={t("TL_LOCALIZATION_OWNER_NAME")} note={owners.map((owners,index) => (
            <div key="index">{index == owners.length - 1 ? owners?.name + "," : owners.name}</div>
        ))}/>
      <KeyNote keyValue={t("TL_LOCALIZATION_LICENSE_STATUS")} note={application.status === "APPROVED"?t("TL_ACTIVE_STATUS_MSG")+" "+convertEpochToDate(application.validTo):t("TL_EXPIRED_STATUS_MSG")+convertEpochToDate(application.validTo)+" "+t("TL_EXPIRED_STATUS_MSG_1")} />
      {/* <KeyNote keyValue={t("PT_COMMON_TABLE_COL_APP_TYPE")} note={(application?.creationReason && t(`PT.${application.creationReason}`)) || "NA"} /> */}
      {/* <KeyNote keyValue={t("PT_COMMON_TABLE_COL_STATUS_LABEL")} note={t(`PT_COMMON_${application?.status}`)} /> */}
      {/* <Link to={`/digit-ui/citizen/pt/property/application/${application?.acknowldgementNumber}`}> */}
        <SubmitBar label={t("TL_RENEW_LABEL")} onSubmit={onsubmit} />
      {/* </Link> */}
    </Card>
  );
};

export default TradeLicenseList;