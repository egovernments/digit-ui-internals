import React, { useEffect, useState } from "react";
import { FormStep, TextInput, CardLabel, RadioButtons, LabelFieldPair, Dropdown, CheckBox } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectOwnerDetails = ({ t, config, onSelect, userType, formData }) => {
  let validation = {};
  const [name, setName] = useState(formData?.owners?.name || "");
  const [isPrimaryOwner, setisPrimaryOwner] = useState(false);
  const [gender, setGender] = useState(formData?.owners?.gender);
  const [mobileNumber, setMobileNumber] = useState(formData?.owners?.mobileNumber || "");
  const [fields, setFeilds] = useState([{ name: "", gender: "", mobilenumber: null, isprimaryowner: false }]);
  let ismultiple = formData?.ownershipCategory?.code.includes("SINGLEOWNER") ? false : true;

  const isUpdateProperty = formData?.isUpdateProperty || false;
  let isEditProperty = formData?.isEditProperty || false;
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");

  function handleAdd() {
    const values = [...fields];
    values.push({ name: "", gender: "", mobilenumber: null, isprimaryowner: false });
    setFeilds(values);
  }

  function setOwnerName(i, e) {
    let units = [...fields];
    units[i].name = e.target.value;
    setName(e.target.value);
    setFeilds(units);
  }

  function setGenderName(i, value) {
    let units = [...fields];
    units[i].gender = value;
    setGender(value);
    setFeilds(units);
  }
  function setMobileNo(i, e) {
    let units = [...fields];
    units[i].mobilenumber = e.target.value;
    setMobileNumber(e.target.value);
    setFeilds(units);
  }
  function setPrimaryOwner(i, e) {
    let units = [...fields];
    units[i].isprimaryowner = ismultiple ? e.target.checked : true;
    setisPrimaryOwner(e.target.checked);
    setFeilds(units);
  }

  const goNext = () => {
    let owner = formData.owners;
    let ownerStep;
    ownerStep = { ...owner, owners: fields };
    onSelect(config.key, ownerStep);
  };

  const onSkip = () => onSelect();
  // As Ticket RAIN-2619 other option in gender and gaurdian will be enhance , dont uncomment it
  const options = [
    { name: "Female", value: "FEMALE", code: "FEMALE" },
    { name: "Male", value: "MALE", code: "MALE" },
    { name: "Transgender", value: "TRANSGENDER", code: "TRANSGENDER" },
    { name: "OTHERS", value: "OTHERS", code: "OTHERS" },
    // { name: "Other", value: "OTHER", code: "OTHER" },
  ];

  return (
    <FormStep config={config} onSelect={goNext} onSkip={onSkip} t={t} isDisabled={!name || !mobileNumber || !gender}>
      {fields.map((field, index) => {
        return (
          <div key={`${field}-${index}`}>
            {ismultiple && <hr color="#d6d5d4" className="break-line"></hr>}
            <CardLabel>{`${t("TL_COMMON_TABLE_COL_OWN_NAME")}`}</CardLabel>
            <TextInput
              t={t}
              type={"text"}
              isMandatory={false}
              optionKey="i18nKey"
              name="name"
              value={field.name}
              onChange={(e) => setOwnerName(index, e)}
              //disable={isUpdateProperty || isEditProperty}
              {...(validation = {
                isRequired: true,
                pattern: "^[a-zA-Z-.`' ]*$",
                type: "text",
                title: t("PT_NAME_ERROR_MESSAGE"),
              })}
            />
            <CardLabel>{`${t("TL_NEW_OWNER_DETAILS_GENDER_LABEL")}`}</CardLabel>
            <RadioButtons
              t={t}
              options={options}
              optionsKey="code"
              name="gender"
              value={gender}
              selectedOption={field.gender}
              onSelect={(e) => setGenderName(index, e)}
              isDependent={true}
              labelKey="PT_COMMON_GENDER"
              disabled={isUpdateProperty || isEditProperty}
            />
            <CardLabel>{`${t("TL_MOBILE_NUMBER_LABEL")}`}</CardLabel>
            <TextInput
              type={"text"}
              t={t}
              isMandatory={false}
              optionKey="i18nKey"
              name="mobileNumber"
              value={field.mobilenumber}
              onChange={(e) => setMobileNo(index, e)}
              //disable={isUpdateProperty || isEditProperty}
              {...(validation = {
                isRequired: true,
                pattern: "[6-9]{1}[0-9]{9}",
                type: "tel",
                title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
              })}
            />
            {ismultiple && (
              <CheckBox
                label={t("Primary Owner")}
                onChange={(e) => setPrimaryOwner(index, e)}
                value={isPrimaryOwner}
                //checked={isCorrespondenceAddress || false}
                style={{ paddingTop: "10px" }}
                //disable={isUpdateProperty || isEditProperty}
              />
            )}
          </div>
        );
      })}
      {ismultiple && (
        <div>
          <hr color="#d6d5d4" className="break-line"></hr>
          <div style={{ justifyContent: "center", display: "flex", paddingBottom: "15px", color: "#FF8C00" }}>
            <button type="button" onClick={() => handleAdd()}>
              Add Owner
            </button>
          </div>
        </div>
      )}
    </FormStep>
  );
};

export default SelectOwnerDetails;
