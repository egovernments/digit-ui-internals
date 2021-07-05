import React, { useState } from "react";
import { FormStep, TextInput, CardLabel, DatePicker, CardLabelError } from "@egovernments/digit-ui-react-components";

const RegistrationDocument = (props) => {
  const { t, config, onSelect, userType, formData } = props;

  const [documentNumber, setDocNo] = useState(formData?.[config.key]?.documentNumber);
  const [documentValue, setDocValue] = useState(formData?.[config.key]?.documentValue);
  const [documentDate, setDocDate] = useState(formData?.[config.key]?.documentDate);
  const [error, setError] = useState(null);

  const selectDocDate = (date) => {
    setError(null);
    console.log(date, date instanceof Date, "date check");
    const _date = new Date(date).getTime();
    if (_date < Date.now()) setDocDate(date);
    else setError("PT_DOCUMENT_DATE_ERROR_MESSAGE");
  };

  const goNext = () => {
    onSelect(config.key, { ...formData?.[config.key], documentNumber, documentValue, documentDate });
  };

  const onSkip = () => {};

  return (
    <React.Fragment>
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!(documentNumber && documentValue && documentDate)}>
        <CardLabel>{t("PT_MUTATION_DOCUMENT_NO")}</CardLabel>
        <TextInput type={"number"} value={documentNumber} onChange={(e) => setDocNo(e.target.value)} />
        <CardLabel>{t("PT_MUTATION_DOCUMENT_VALUE")}</CardLabel>
        <TextInput type={"number"} value={documentValue} onChange={(e) => setDocValue(e.target.value)} />
        <CardLabel>{t("PT_MUTATION_DOCUMENT_ISSUE_DATE")}</CardLabel>
        <DatePicker max={new Date().toLocaleDateString()} date={documentDate} onChange={selectDocDate} />
        {error ? <CardLabelError>{t(error)}</CardLabelError> : null}
      </FormStep>
    </React.Fragment>
  );
};

export default RegistrationDocument;
