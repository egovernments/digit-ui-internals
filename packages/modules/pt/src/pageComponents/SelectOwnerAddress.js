import React, { useState } from "react";
import {
  FormStep,
  TextInput,
  CheckBox,
  CardLabel
} from "@egovernments/digit-ui-react-components";

const SelectOwnerAddress = ({ t, config, onSelect, userType, formData }) => {
  let index = 0;
  const [permanentAddress, setPermanentAddress] = useState(formData.owners && formData.owners[index] && formData.owners[index].permanentAddress);
  const [isCorrespondenceAddress, setIsCorrespondenceAddress] = useState(formData.owners && formData.owners[index] && formData.owners[index].isCorrespondenceAddress);

  function setOwnerPermanentAddress(e) {
    setPermanentAddress(e.target.value);
  }
  function setCorrespondenceAddress(e) {
    setIsCorrespondenceAddress(e.target.checked);
  }

  const goNext = () => {
    let ownerDetails = formData.owners && formData.owners[index];
    ownerDetails["permanentAddress"] = permanentAddress;
    ownerDetails["isCorrespondenceAddress"] = isCorrespondenceAddress
    onSelect(config.key, ownerDetails);
  };

  return (
    <FormStep config={config} t={t} onSelect={goNext}>
      <TextInput
        isMandatory={false}
        optionKey="i18nKey"
        t={t}
        name="address"
        onChange={setOwnerPermanentAddress}
        value={permanentAddress}
      />
      <CardLabel>{t("PT_OWNER_S_ADDRESS")}</CardLabel>
      <CheckBox
        label={t("PT_COMMON_SAME_AS_PROPERTY_ADDRESS")}
        onChange={setCorrespondenceAddress}
        value={isCorrespondenceAddress}
        checked={isCorrespondenceAddress || false}
      />
    </FormStep>

  );
};

export default SelectOwnerAddress;
