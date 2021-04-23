import { CardHeader, CardLabel, Dropdown, FormStep, TextInput } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { cardBodyStyle } from "../utils";

const SelectInistitutionOwnerDetails = ({ t, config, onSelect, userType, formData }) => {
  let index = 0;
  let validation = {};
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [inistitutionName, setInistitutionName] = useState(formData.owners && formData.owners[index] && formData.owners[index].inistitutionName);
  const [inistitutetype, setInistitutetype] = useState(formData.owners && formData.owners[index] && formData.owners[index].inistitutetype);
  const [name, setName] = useState(formData.owners && formData.owners[index] && formData.owners[index].name);
  const [designation, setDesignation] = useState(formData.owners && formData.owners[index] && formData.owners[index].designation);
  const [mobileNumber, setMobileNumber] = useState(formData.owners && formData.owners[index] && formData.owners[index].mobileNumber);
  const [altContactNumber, setAltContactNumber] = useState(formData.owners && formData.owners[index] && formData.owners[index].altContactNumber);
  const [emailId, setEmailId] = useState(formData.owners && formData.owners[index] && formData.owners[index].emailId);
  const isUpdateProperty = formData?.isUpdateProperty || false;

  function setInistitution(e) {
    setInistitutionName(e.target.value);
  }
  function setTypeOfInistituteName(inistitutetype) {
    setInistitutetype(inistitutetype);
  }
  function setInistituteName(e) {
    setName(e.target.value);
  }
  function setDesignationName(e) {
    setDesignation(e.target.value);
  }
  function setMobileNo(e) {
    setMobileNumber(e.target.value);
  }
  function setAltContactNo(e) {
    setAltContactNumber(e.target.value);
  }
  function setEmail(e) {
    setEmailId(e.target.value);
  }

  const formDropdown = (category) => {
    const { name, code } = category;
    return {
      label: name,
      value: code,
      code: t(`PROPERTYTAX_BILLING_SLAB_${code}`),
    };
  };

  const getDropdwonForInstitution = () => {
    let SubOwnerShipCategory = {};
    let PropertyTaxPayload = JSON.parse(sessionStorage.getItem("getSubPropertyOwnerShipCategory"));
    let SubOwnerShipCategoryOb = PropertyTaxPayload?.PropertyTax?.SubOwnerShipCategory;
    SubOwnerShipCategoryOb &&
      SubOwnerShipCategoryOb.length > 0 &&
      SubOwnerShipCategoryOb.map((category) => {
        SubOwnerShipCategory[category.code] = category;
      });
    const institutedropDown = [];
    const value = formData.ownershipCategory.value || "";
    SubOwnerShipCategory &&
      Object.keys(SubOwnerShipCategory)
        .filter((subCategory) => SubOwnerShipCategory[subCategory].ownerShipCategory === value)
        .forEach((linkedCategory) => {
          institutedropDown.push(formDropdown(SubOwnerShipCategory[linkedCategory]));
        });
    return institutedropDown;
  };

  const goNext = () => {
    let ownerDetails = formData.owners && formData.owners[index];
    if (ownerDetails) {
      ownerDetails["inistitutionName"] = inistitutionName;
      ownerDetails["inistitutetype"] = inistitutetype;
      ownerDetails["name"] = name;
      ownerDetails["designation"] = designation;
      ownerDetails["mobileNumber"] = mobileNumber;
      ownerDetails["altContactNumber"] = altContactNumber;
      ownerDetails["emailId"] = emailId;
      onSelect(config.key, ownerDetails, false, index);
    } else {
      let ownerStep = { ...ownerDetails, inistitutionName, inistitutetype, name, designation, mobileNumber, altContactNumber, emailId };
      onSelect(config.key, ownerStep, false, index);
    }
  };

  return (
    <FormStep
      config={config}
      t={t}
      onSelect={goNext}
      isDisabled={!inistitutionName || !inistitutetype || !name || !designation || !mobileNumber || !altContactNumber}
    >
      <div style={cardBodyStyle}>
        <CardLabel>{`${t("PT_COMMON_INSTITUTION_NAME")}`}</CardLabel>
        <TextInput
          isMandatory={false}
          optionKey="i18nKey"
          t={t}
          name="institutionName"
          onChange={setInistitution}
          value={inistitutionName}
          disable = {isUpdateProperty}
          {...(validation = {
            isRequired: true,
            pattern: "^[a-zA-Z-.`' ]*$",
            title: t("PT_NAME_ERROR_MESSAGE"),
          })}
        />
        <CardLabel>{`${t("PT_TYPE_OF_INSTITUTION")}`}</CardLabel>
        <Dropdown
          t={t}
          isMandatory={false}
          option={getDropdwonForInstitution() || []}
          selected={inistitutetype}
          optionKey="code"
          select={setTypeOfInistituteName}
          disabled = {isUpdateProperty}
        />
        <CardHeader>{t("PT_AUTH_PERSON_DETAILS")}</CardHeader>
        <CardLabel>{`${t("PT_OWNER_NAME")}`}</CardLabel>
        <TextInput
          isMandatory={false}
          optionKey="i18nKey"
          t={t}
          name="name"
          onChange={setInistituteName}
          value={name}
          disable = {isUpdateProperty}
          {...(validation = {
            isRequired: true,
            pattern: "^[a-zA-Z-.`' ]*$",
            title: t("PT_NAME_ERROR_MESSAGE"),
          })}
        />
        <CardLabel>{`${t("PT_COMMON_AUTHORISED_PERSON_DESIGNATION")}`}</CardLabel>
        <TextInput
          isMandatory={false}
          optionKey="i18nKey"
          t={t}
          name="designation"
          onChange={setDesignationName}
          value={designation}
          disable = {isUpdateProperty}
          {...(validation = {
            isRequired: true,
            pattern: "^[a-zA-Z-.`' ]*$",
            title: t("PT_DESIGNATION_ERROR_MESSAGE"),
          })}
        />
        <CardLabel>{`${t("PT_FORM3_MOBILE_NUMBER")}`}</CardLabel>
        <TextInput
          isMandatory={false}
          optionKey="i18nKey"
          t={t}
          name="setMobileNo"
          onChange={setMobileNo}
          value={mobileNumber}
          type={"tel"}
          disable = {isUpdateProperty}
          {...(validation = {
            isRequired: true,
            pattern: "[6-9]{1}[0-9]{9}",
            type: "tel",
            title: t("CORE_COMMON_APPLICANT_ALT_NUMBER_INVALID"),
          })}
        />
        <CardLabel>{`${t("PT_OWNERSHIP_INFO_TEL_PHONE_NO")}`}</CardLabel>
        <TextInput
          isMandatory={false}
          optionKey="i18nKey"
          t={t}
          name="altContactNumber"
          onChange={setAltContactNo}
          value={altContactNumber}
          type={"number"}
          disable = {isUpdateProperty}
          {...(validation = {
            isRequired: true,
            pattern: "^[0-9]{10,11}$",
            type: "number",
            title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
          })}
        />
        <CardLabel>{t("PT_FORM3_EMAIL_ID")}</CardLabel>
        <TextInput
          isMandatory={false}
          optionKey="i18nKey"
          t={t}
          name="email"
          onChange={setEmail}
          type="email"
          value={emailId}
          disable = {isUpdateProperty}
          // {...(validation = {
          //   isRequired: true,
          //   type: "email",
          //   title: t("PT_EMAIL_ID_ERROR_MESSAGE"),
          // })}
        />
      </div>
    </FormStep>
  );
};

export default SelectInistitutionOwnerDetails;
