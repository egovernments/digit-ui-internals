import React, { useState } from "react";
import { FormStep, TextInput, CardLabel, RadioButtons } from "@egovernments/digit-ui-react-components";
import { cardBodyStyle } from "../utils";

const SelectOwnerDetails = ({ t, config, onSelect, userType, formData }) => {
  let index = window.location.href.charAt(window.location.href.length - 1);
  let validation = {};
  const [name, setName] = useState(formData.owners && formData.owners[index] && formData.owners[index].name);
  const [gender, setGender] = useState(formData.owners && formData.owners[index] && formData.owners[index].gender);
  const [mobileNumber, setMobileNumber] = useState(formData.owners && formData.owners[index] && formData.owners[index].mobileNumber);
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState(
    formData.owners && formData.owners[index] && formData.owners[index].fatherOrHusbandName
  );
  const [relationship, setRelationship] = useState(formData.owners && formData.owners[index] && formData.owners[index].relationship);
  const isUpdateProperty = formData?.isUpdateProperty || false;

  function setOwnerName(e) {
    setName(e.target.value);
  }
  function setGenderName(value) {
    setGender(value);
  }
  function setMobileNo(e) {
    setMobileNumber(e.target.value);
  }
  function setGuardiansName(e) {
    setFatherOrHusbandName(e.target.value);
  }
  function setGuardianName(value) {
    setRelationship(value);
  }

  const goNext = () => {
    let owner = formData.owners && formData.owners[index];
    let ownerStep = { ...owner, name, gender, mobileNumber, fatherOrHusbandName, relationship };
    onSelect(config.key, ownerStep, false, index);
  };

  const onSkip = () => onSelect();

  const options = [
    { value: "Female", code: "PT_FORM3_FEMALE", value: "FEMALE", code: "FEMALE" },
    { value: "Male", code: "PT_FORM3_MALE", value: "MALE", code: "MALE" },
    { value: "Transgender", code: "PT_COMMON_GENDER_TRANSGENDER", value: "TRANSGENDER", code: "TRANSGENDER" },
  ];

  const GuardianOptions = [
    { name: "Father", code: "FATHER", i18nKey: "PT_RELATION_FATHER" },
    { name: "Husband", code: "HUSBAND", i18nKey: "PT_RELATION_HUSBAND" },
  ];

  return (
    <FormStep
      config={config}
      onSelect={goNext}
      onSkip={onSkip}
      t={t}
      isDisabled={!name || !mobileNumber || !gender || !relationship || !fatherOrHusbandName}
    >
      <div style={cardBodyStyle}>
        <CardLabel>{`${t("PT_OWNER_NAME")}`}</CardLabel>
        <TextInput
          t={t}
          type={"text"}
          isMandatory={false}
          optionKey="i18nKey"
          name="name"
          value={name}
          onChange={setOwnerName}
          disable = {isUpdateProperty}
          {...(validation = {
            isRequired: true,
            pattern: "^[a-zA-Z-.`' ]*$",
            type: "tel",
            title: t("PT_NAME_ERROR_MESSAGE"),
          })}
        />
        <CardLabel>{`${t("PT_FORM3_GENDER")}`}</CardLabel>
        <RadioButtons 
          t={t} 
          options={options} 
          optionsKey="code" 
          name="gender" 
          value={gender} 
          selectedOption={gender} 
          onSelect={setGenderName} 
          isDependent = {true}
          labelKey = "PT_COMMON_GENDER"
          disabled = {isUpdateProperty}
          />
        <CardLabel>{`${t("PT_FORM3_MOBILE_NUMBER")}`}</CardLabel>
        <TextInput
          type={"text"}
          t={t}
          isMandatory={false}
          optionKey="i18nKey"
          name="mobileNumber"
          value={mobileNumber}
          onChange={setMobileNo}
          disable = {isUpdateProperty}
          {...(validation = {
            isRequired: true,
            pattern: "[6-9]{1}[0-9]{9}",
            type: "tel",
            title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
          })}
        />
        <CardLabel>{`${t("PT_FORM3_GUARDIAN_NAME")}`}</CardLabel>
        <TextInput
          t={t}
          type={"text"}
          isMandatory={false}
          optionKey="i18nKey"
          name="fatherOrHusbandName"
          value={fatherOrHusbandName}
          onChange={setGuardiansName}
          disable = {isUpdateProperty}
          {...(validation = {
            isRequired: true,
            pattern: "^[a-zA-Z-.`' ]*$",
            type: "tel",
            title: t("PT_NAME_ERROR_MESSAGE"),
          })}
        />
        <CardLabel>{`${t("PT_FORM3_RELATIONSHIP")}`}</CardLabel>
        <RadioButtons
          t={t}
          optionsKey="i18nKey"
          name="relationship"
          options={GuardianOptions}
          value={relationship}
          selectedOption={relationship}
          onSelect={setGuardianName}
          isDependent = {true}
          labelKey = "PT_RELATION"
          disabled = {isUpdateProperty}
        />
      </div>
    </FormStep>
  );
};

export default SelectOwnerDetails;
