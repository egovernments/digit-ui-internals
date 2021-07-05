import React, { useState, useEffect } from "react";
import { FormStep, CardLabel, TextInput, CitizenInfoLabel } from "@egovernments/digit-ui-react-components";

const SelectTradeName = ({ t, config, onSelect, value, userType, formData }) => {
  let validation = {};
  const onSkip = () => onSelect();
  const [TradeName, setTradeName] = useState(formData.TradeDetails?.TradeName);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const isEdit = window.location.href.includes("/edit-application/");
  const { isLoading, data: fydata = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "egf-master", "FinancialYear");
  

  let mdmsFinancialYear = fydata["egf-master"]?fydata["egf-master"].FinancialYear.filter(y => y.module === "TL"):[];
  let temp = mdmsFinancialYear.length > 0 ? parseInt(mdmsFinancialYear[0].id):0;
  let FY;
  mdmsFinancialYear && mdmsFinancialYear.map((year) => {
    if(parseInt(year.id)>temp)
    {
      FY=year.finYearRange;
      temp=parseInt(year.id);
    }
  })

  function setSelectTradeName(e) {
    setTradeName(e.target.value);
  }

  const goNext = () => {
    sessionStorage.setItem("CurrentFinancialYear",FY);
    onSelect(config.key, { TradeName });
  };
  //const onSkip = () => onSelect();

  return (
    <React.Fragment>
      <FormStep
        config={config}
        onSelect={goNext}
        onSkip={onSkip}
        //forcedError={t(unitareaerror) || t(areanotzeroerror)}
        t={t}
        // isDisabled={isEdit}
        //showErrorBelowChildren={true}
      >
        <CardLabel>{`${t("Trade Name")}`}</CardLabel>
        <TextInput
          t={t}
          isMandatory={false}
          type={"text"}
          optionKey="i18nKey"
          name="TradeName"
          value={TradeName}
          onChange={setSelectTradeName}
          disable={isEdit}
          {...(validation = { pattern: "^[a-zA-Z-.`' ]*$", isRequired: true, type: "text", title: t("TL_INVALID_TRADE_NAME") })}
        />
      </FormStep>
      {<CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("TL_LICENSE_ISSUE_YEAR_INFO_MSG")+FY} />}
    </React.Fragment>
  );
};

export default SelectTradeName;
