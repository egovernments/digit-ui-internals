import { Card, CardHeader, CardSubHeader, CardText, Loader, SubmitBar, CitizenInfoLabel } from "@egovernments/digit-ui-react-components";
import React from "react";
import { cardBodyStyle, stringReplaceAll } from "../utils";
//import { map } from "lodash-es";

const TradeLicense = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];

  const { isLoading, data: Documentsob = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "TradeLicense", "TLDocuments");
  console.log(Documentsob);
  let docs = Documentsob?.TradeLicense?.Documents;
  //docs = docs?.filter((doc) => doc["digit-citizen"]);
  function onSave() {}

  function goNext() {
    onSelect();
  }
  return (
    <React.Fragment>
      <Card>
        <CardHeader>{t("TL_DOC_REQ_SCREEN_HEADER")}</CardHeader>
        <div>
          <CardText>{t("TL_DOC_REQ_SCREEN_TEXT")}</CardText>
          <div>
            {isLoading && <Loader />}
            {Array.isArray(docs)
              ? docs.map(({ code, dropdownData }, index) => (
                  <div key={index}>
                    <CardSubHeader>
                      {index + 1}. {t("TRADELICENSE_" + stringReplaceAll(code, ".", "_") + "_HEADING")}
                    </CardSubHeader>
                    {dropdownData.map((dropdownData) => (
                      <CardText>{t("TRADELICENSE_" + stringReplaceAll(dropdownData?.code, ".", "_") + "_LABEL")}</CardText>
                    ))}
                  </div>
                ))
              : console.log("error")}
          </div>
        </div>
        <span>
          <SubmitBar label="Next" onSubmit={onSelect} />
        </span>
      </Card>
      {<CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("TL_DOCUMENT_SIZE_INFO_MSG")} />}
    </React.Fragment>
  );
};

export default TradeLicense;
