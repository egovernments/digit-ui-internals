import React, { useEffect, useState } from "react";
import {
  TypeSelectCard,
  RadioButtons,
  FormStep,
  CitizenInfoLabel,
  CardLabel,
  LabelFieldPair,
  Dropdown,
} from "@egovernments/digit-ui-react-components";

const PropertyFloorsDetails = ({ t, config, onSelect, formData, userType }) => {
  const [FloorDetails, setFloorDetails] = useState(formData?.noOfFloors);

  const menu = [
    {
      //i18nKey: "Ground Floor Only",
      i18nKey: "PT_GROUND_FLOOR_OPTION",
      code: 0,
    },
    {
      //i18nKey: "Ground +1",
      i18nKey: "PT_GROUND_PLUS_ONE_OPTION",
      code: 1,
    },
    {
      //i18nKey: "Ground +2",
      i18nKey: "PT_GROUND_PLUS_TWO_OPTION",
      code: 2,
    },
    {
      i18nKey: "NONE",
      code: "NONE",
    },
  ];

  const onSkip = () => onSelect();

  function selectFloorDetails(value) {
    setFloorDetails(value);
  }

  function goNext() {
    onSelect(config.key, FloorDetails);
  }

  useEffect(() => {
    if (userType === "employee") {
      goNext();
    }
  }, [FloorDetails]);

  const inputs = [
    {
      label: "BPA_SCRUTINY_DETAILS_NUMBER_OF_FLOORS_LABEL",
      type: "text",
      name: "noOfFloors",
      validation: {},
    },
  ];

  if (userType === "employee") {
    return inputs?.map((input, index) => {
      return (
        <LabelFieldPair key={index}>
          <CardLabel className="card-label-smaller">
            {t(input.label)}
            {config.isMandatory ? " * " : null}
          </CardLabel>
          <Dropdown
            className="form-field"
            isMandatory={config.isMandatory}
            selected={menu?.length === 1 ? menu[0] : FloorDetails}
            disable={menu?.length === 1}
            option={menu}
            select={selectFloorDetails}
            optionKey="i18nKey"
            t={t}
          />
        </LabelFieldPair>
      );
    });
  }

  return (
    <React.Fragment>
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!FloorDetails} isMultipleAllow={true}>
        <RadioButtons
          t={t}
          optionsKey="i18nKey"
          isMandatory={config.isMandatory}
          options={menu}
          selectedOption={FloorDetails}
          onSelect={selectFloorDetails}
        />
      </FormStep>
      {FloorDetails && <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("PT_FLOOR_NUMBER_INFO_MSG", FloorDetails)} />}
    </React.Fragment>
  );
};

export default PropertyFloorsDetails;
