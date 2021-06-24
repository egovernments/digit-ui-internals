import React, { useState, useEffect } from "react";
import { FormStep, CardLabel, TextInput, CitizenInfoLabel } from "@egovernments/digit-ui-react-components";

const SelectTradeName = ({ t, config, onSelect, value, userType, formData }) => {
  let validation = {};
  const onSkip = () => onSelect();
  const [TradeName, setTradeName] = useState(formData.TradeDetails?.TradeName);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];

  function setSelectTradeName(e) {
    setTradeName(e.target.value);
  }

  const goNext = () => {
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
        //isDisabled={unitareaerror || areanotzeroerror || !RentArea || !AnnualRent}
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
          {...(validation = { pattern: "^[a-zA-Z-.`' ]*$", isRequired: true, type: "text", title: t("TL_INVALID_TRADE_NAME") })}
        />
      </FormStep>
      {<CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("TL_LICENSE_ISSUE_YEAR_INFO_MSG")} />}
    </React.Fragment>
  );
};

export default SelectTradeName;
