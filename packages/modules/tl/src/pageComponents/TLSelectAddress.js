import { CardLabel, Dropdown, FormStep, LabelFieldPair, RadioOrSelect, RadioButtons, CardLabelError } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";

const TLSelectAddress = ({ t, config, onSelect, userType, formData }) => {
  const allCities = Digit.Hooks.tl.useTenants();
  let tenantId = Digit.ULBService.getCurrentTenantId();
  let isEditProperty = formData?.isEditProperty || false;
  if (formData?.isUpdateProperty) isEditProperty = true;
  const { pincode, city } = formData?.address || "";
  const cities =
    userType === "employee"
      ? allCities.filter((city) => city.code === tenantId)
      : pincode
      ? allCities.filter((city) => city?.pincode?.some((pin) => pin == pincode))
      : allCities;

  const [selectedCity, setSelectedCity] = useState(() => formData?.address?.city || null);

  const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    selectedCity?.code,
    "revenue",
    {
      enabled: !!selectedCity,
    },
    t
  );

  const [localities, setLocalities] = useState();

  const [selectedLocality, setSelectedLocality] = useState();

  useEffect(() => {
    if (cities) {
      if (cities.length === 1) {
        setSelectedCity(cities[0]);
      }
    }
  }, [cities]);

  useEffect(() => {
    if (selectedCity && fetchedLocalities) {
      let __localityList = fetchedLocalities;
      let filteredLocalityList = [];

      if (formData?.address?.locality) {
        setSelectedLocality(formData.address.locality);
      }

      if (formData?.address?.pincode) {
        filteredLocalityList = __localityList.filter((obj) => obj.pincode?.find((item) => item == formData.address.pincode));
        if (!formData?.address?.locality) setSelectedLocality();
      }

      // if (userType === "employee") {
      //   onSelect(config.key, { ...formData[config.key], city: selectedCity });
      // }
      setLocalities(() => (filteredLocalityList.length > 0 ? filteredLocalityList : __localityList));

      if (filteredLocalityList.length === 1) {
        setSelectedLocality(filteredLocalityList[0]);
        if (userType === "employee") {
          onSelect(config.key, { ...formData[config.key], locality: filteredLocalityList[0] });
        }
      }
    }
  }, [selectedCity, formData?.address?.pincode, fetchedLocalities]);

  function selectCity(city) {
    setSelectedLocality(null);
    setLocalities(null);
    setSelectedCity(city);
  }

  function selectLocality(locality) {
    if (formData?.address?.locality) {
      formData.address["locality"] = locality;
    }
    setSelectedLocality(locality);
    if (userType === "employee") {
      onSelect(config.key, { ...formData[config.key], locality: locality });
    }
  }

  function onSubmit() {
    onSelect(config.key, { city: selectedCity, locality: selectedLocality });
  }

  const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue } = useForm();
  const formValue = watch();
  const { errors } = localFormState;
  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };

  useEffect(() => {
    let keys = Object.keys(formValue);
    const part = {};
    keys.forEach((key) => (part[key] = formData[config.key]?.[key]));

    if (!_.isEqual(formValue, part)) onSelect(config.key, { ...formData[config.key], ...formValue });

    for (let key in formValue) {
      if (!formValue[key] && !localFormState.errors[key]) {
        setLocalError(key, { type: `${key.toUpperCase()}_REQUIRED`, message: `${key.toUpperCase()}_REQUIRED` });
      } else if (formValue[key] && localFormState.errors[key]) {
        clearLocalErrors([key]);
      }
    }
  }, [formValue]);

  if (userType === "employee") {
    return (
      <div>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">{`${t("MYCITY_CODE_LABEL")}*`}</CardLabel>
          <Controller
            name={"city"}
            defaultValue={cities?.length === 1 ? cities[0] : selectedCity}
            control={control}
            render={(props) => (
              <Dropdown
                className="form-field"
                selected={props.value}
                disable={isEditProperty ? isEditProperty : cities?.length === 1}
                option={cities}
                select={props.onChange}
                optionKey="code"
                onBlur={props.onBlur}
                t={t}
              />
            )}
          />
        </LabelFieldPair>
        <CardLabelError style={errorStyle}>{localFormState.touched.city ? errors?.city?.message : ""}</CardLabelError>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">{t("TL_LOCALIZATION_LOCALITY")}</CardLabel>
          <Controller
            name="locality"
            defaultValue={null}
            control={control}
            render={(props) => (
              <Dropdown
                className="form-field"
                selected={props.value}
                option={localities}
                select={props.onChange}
                onBlur={props.onBlur}
                optionKey="i18nkey"
                t={t}
                disable={isEditProperty ? isEditProperty : false}
              />
            )}
          />
        </LabelFieldPair>
        <CardLabelError style={errorStyle}>{localFormState.touched.locality ? errors?.locality?.message : ""}</CardLabelError>
      </div>
    );
  }
  return (
    <FormStep config={config} onSelect={onSubmit} t={t} isDisabled={selectedLocality ? false : true}>
      <CardLabel>{`${t("MYCITY_CODE_LABEL")}*`}</CardLabel>
      <span className={"form-pt-dropdown-only"}>
        <RadioOrSelect
          options={cities.sort((a, b) => a.name.localeCompare(b.name))}
          selectedOption={selectedCity}
          optionKey="code"
          onSelect={selectCity}
          t={t}
          isDependent={true}
          labelKey="TENANT_TENANTS"
          disabled={isEditProperty}
        />
      </span>
      {selectedCity && localities && <CardLabel>{`${t("TL_LOCALIZATION_LOCALITY")} `}</CardLabel>}
      {selectedCity && localities && (
        <span className={"form-pt-dropdown-only"}>
          <RadioOrSelect
            dropdownStyle={{ paddingBottom: "20px" }}
            isMandatory={config.isMandatory}
            options={localities.sort((a, b) => a.name.localeCompare(b.name))}
            selectedOption={selectedLocality}
            optionKey="i18nkey"
            onSelect={selectLocality}
            t={t}
            isDependent={true}
            labelKey=""
            disabled={isEditProperty}
          />
        </span>
      )}
    </FormStep>
  );
};

export default TLSelectAddress;
