import React, { useEffect, useState } from "react";
import { TextInput, CardLabel, LabelFieldPair } from "@egovernments/digit-ui-react-components";

const SelectAltContactNumber = ({ t, config, onSelect, userType, formData }) => {
  const [altContactNumber, setAltContactNumber] = useState("");

  const goNext = () => {
    onSelect(config.key, { ...formData[config.key], altContactNumber });
  };

  useEffect(() => {
    goNext();
  }, [altContactNumber]);

  return (
    <LabelFieldPair>
      <CardLabel className="card-label-smaller">{t("ES_PT_ALT_CONTACT_NUMBER")}</CardLabel>
      <div className="field">
        <TextInput name="altContactNumber" onChange={(e) => setAltContactNumber(e.target.value)} value={altContactNumber} />
      </div>
    </LabelFieldPair>
  );
};

export default SelectAltContactNumber;
