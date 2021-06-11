import React, { useEffect, useState } from "react";
import { CardLabel, LabelFieldPair, Dropdown, TextInput, LinkButton, CardLabelError, Loader } from "@egovernments/digit-ui-react-components";
import { stringReplaceAll } from "../utils";
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import { useLocation } from "react-router-dom";

const Units = ({ t, config, onSelect, userType, formData, setError, formState, clearErrors }) => {
  const { pathname } = useLocation();
  const presentInModifyApplication = pathname.includes("modify");

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [units, setUnits] = useState(
    formData?.units || [
      {
        key: Date.now(),
        order: 1,
        floorNo: null,
        occupancyType: null,
        tenantId,
        usageCategory: null,
        builtUpArea: "",
      },
    ]
  );
  const stateId = tenantId.split(".")[0];
  const [focusIndex, setFocusIndex] = useState({ index: -1 });
  const [loader, setLoader] = useState(true);

  const { data: Menu, isLoading } =
    Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", [
      "UsageCategory",
      "OccupancyType",
      "Floor",
      "OwnerType",
      "OwnerShipCategory",
      "Documents",
      "SubOwnerShipCategory",
      "OwnerShipCategory",
    ]) || {};

  let usagecat = [];
  usagecat = Menu?.PropertyTax?.UsageCategory?.filter((e) => e?.code !== "MIXED") || [];

  let floorlist = [];
  floorlist = Menu?.PropertyTax?.Floor;

  let subusageoption = [];
  subusageoption = Menu?.PropertyTax?.UsageCategory || [];

  let occupencyOptions = [];
  occupencyOptions = Menu?.PropertyTax?.OccupancyType.map((e) => ({ i18nKey: `PROPERTYTAX_OCCUPANCYTYPE_${e?.code}`, ...e })) || [];

  let floorListData = [];
  function getfloorlistdata(floorlist) {
    floorListData = floorlist?.map((floor) => ({ i18nKey: "PROPERTYTAX_FLOOR_" + stringReplaceAll(floor?.code, "-", "_"), code: floor?.code })) || [];
    return floorListData;
  }

  useEffect(() => {
    if (!isLoading && presentInModifyApplication && Menu) {
      // usage subUsage unit Occupancy
      let defaultUnits = formData?.originalData?.units?.map((unit, index) => {
        let { occupancyType, usageCategory: uc, constructionDetail, floorNo, arv } = unit;
        occupancyType = occupencyOptions.filter((e) => e?.code === occupancyType)[0];
        let usageCategory = usageCategoryMajorMenu(usagecat).filter((e) => e?.code === uc)[0];
        floorNo = getfloorlistdata(floorlist).filter((e) => e?.code == floorNo)[0];
        let key = Date.now() + index;
        let order = index + 1;
        let builtUpArea = constructionDetail.builtUpArea;
        return {
          floorNo,
          occupancyType,
          usageCategory,
          key,
          order,
          builtUpArea,
          existingUsageCategory: uc,
          arv,
        };
      });
      setUnits(defaultUnits);
      setLoader(false);
    }
  }, [isLoading]);

  const calculateNumberOfFloors = () => {
    // if (!floorlist?.length || formState.errors[config.key]) return;
    if (formData?.PropertyType?.code !== "BUILTUP.INDEPENDENTPROPERTY") {
      if (formState.errors[config.key]?.type === "units_missing") clearErrors(config.key);
      return;
    }

    if (!floorlist?.length) return;
    let minFloor = units.reduce((min, unit) => Math.min(min, Number(unit.floorNo?.code) || Number(0)), Number(0));
    let maxFloor = units.reduce((max, unit) => Math.max(max, Number(unit.floorNo?.code) || Number(0)), Number(0));

    const continuousFloorsArr = floorListData.filter((e) => {
      let num = Number(e?.code);
      return (num < maxFloor && num > minFloor) || num === maxFloor || num === minFloor;
    });

    let unitsMissing = [...continuousFloorsArr];

    continuousFloorsArr.forEach((floor) => {
      if (units.some((unit) => unit.floorNo?.code === floor?.code)) {
        unitsMissing = unitsMissing.filter((e) => e?.code !== floor?.code);
      } else if (!unitsMissing.some((e) => e?.code === floor?.code)) {
        unitsMissing.push(floor);
      }
    });

    if (unitsMissing.length) {
      setError(config.key, { type: "units_missing", message: `PT_FLOORS_MISSING_UNITS.${unitsMissing.map((e) => e?.code).join()}` });
    } else {
      clearErrors(config.key);
    }
    console.log(maxFloor + 1, "noOfFloors in form");
    onSelect("noOfFloors", maxFloor + 1);
  };

  const usageCategoryMajorMenu = (usagecat) => {
    const catMenu = usagecat
      ?.filter((e) => e?.code.split(".").length <= 2 && e?.code !== "NONRESIDENTIAL")
      ?.map((item) => {
        const arr = item?.code.split(".");
        if (arr.length == 2) return { i18nKey: "PROPERTYTAX_BILLING_SLAB_" + arr[1], code: item?.code };
        else return { i18nKey: "PROPERTYTAX_BILLING_SLAB_" + item?.code, code: item?.code };
      });
    return catMenu;
  };

  const subUsageCategoryMenu = (category) => {
    const menu = usagecat
      .filter((cat) => cat?.code.includes(category?.code) && cat?.code.split(".").length === 4)
      .map((item) => {
        const codeArr = item?.code.split(".");
        return { i18nKey: `COMMON_PROPSUBUSGTYPE_NONRESIDENTIAL_${codeArr[1]}_${codeArr[3]}`, code: item?.code };
      });
    return menu;
  };

  // console.log(usageCategoryMajorMenu(usagecat), subUsageCategoryMenu(usagecat), getfloorlistdata(floorlist), "options inside units");

  function goNext() {
    let unitsData = units?.map((unit) => ({
      occupancyType: unit?.occupancyType?.code,
      floorNo: unit?.floorNo?.code,
      constructionDetail: {
        builtUpArea: unit?.builtUpArea,
      },
      tenantId: unit?.tenantId,
      usageCategory: unit?.usageCategory?.code,
    }));
    unitsData = unitsData?.map((unit, index) => {
      if (unit.occupancyType === "RENTED") return { ...unit, arv: units[index].arv };
      return unit;
    });
    onSelect(config.key, unitsData);
  }

  const reviseIndexKeys = () => {
    setUnits((prev) => prev.map((unit, index) => ({ ...unit, order: index + 1 })));
  };

  const handleAddUnit = () => {
    setUnits((prev) => [
      ...prev,
      {
        key: Date.now(),
        floorNo: null,
        occupancyType: null,
        tenantId,
        usageCategory: null,
        builtUpArea: formData?.landarea,
        order: prev.length + 1,
      },
    ]);
    reviseIndexKeys();
  };

  const handleRemoveUnit = (unit) => {
    setUnits((prev) => prev.filter((el) => el.key !== unit.key));
    if (formState.errors?.units?.type == unit.key) {
      clearErrors("units");
    }
    reviseIndexKeys();
  };

  useEffect(() => {
    if (formData?.PropertyType?.code === "VACANT" && formState.errors[config.key]) {
      clearErrors(config.key);
    }
  }, [formData?.PropertyType]);

  useEffect(() => {
    goNext();
    calculateNumberOfFloors();
  }, [units, formData.PropertyType]);

  if (loader && presentInModifyApplication) return <Loader />;

  return formData?.PropertyType?.code === "VACANT" || !formData?.PropertyType?.code ? null : (
    <div>
      {units?.map((unit, index) => (
        <Unit
          t={t}
          key={unit.key}
          unit={unit}
          allUnits={units}
          setUnits={setUnits}
          index={index}
          stateId={stateId}
          focusIndex={focusIndex}
          setFocusIndex={setFocusIndex}
          getfloorlistdata={getfloorlistdata}
          floorlist={floorlist}
          occupencyOptions={occupencyOptions}
          formData={formData}
          handleRemoveUnit={handleRemoveUnit}
          {...{ formState, setError, clearErrors, usageCategoryMajorMenu, subUsageCategoryMenu }}
        />
      ))}
      <LinkButton label="Add Unit" onClick={handleAddUnit} style={{ color: "orange", width: "fit-content" }}></LinkButton>
    </div>
  );
};

function Unit({
  t,
  unit,
  allUnits,
  setUnits,
  index,
  focusIndex,
  setFocusIndex,
  getfloorlistdata,
  floorlist,
  occupencyOptions,
  formData,
  handleRemoveUnit,
  stateId,
  formState,
  setError,
  clearErrors,
  usageCategoryMajorMenu,
  subUsageCategoryMenu,
}) {
  const { data: usageMenu = {}, isLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", [
    "UsageCategory",
    "OccupancyType",
    "Floor",
    "OwnerType",
    "OwnerShipCategory",
    "Documents",
    "SubOwnerShipCategory",
    "OwnerShipCategory",
  ]);
  let usagecat = [];
  usagecat = usageMenu?.PropertyTax?.UsageCategory?.filter((e) => e?.code !== "MIXED") || [];

  const [usageType, setUsageType] = useState(() => {
    const { existingUsageCategory } = unit;
    if ([existingUsageCategory, formData?.usageCategoryMajor?.code].includes("RESIDENTIAL")) {
      return usageCategoryMajorMenu(usagecat).filter((e) => e?.code === "RESIDENTIAL")[0];
    }

    if (formData?.usageCategoryMajor?.code !== "MIXED") {
    } else if (existingUsageCategory) {
      const codeArr = existingUsageCategory?.split(".");
      const val = usageCategoryMajorMenu(usagecat).filter((e) => e?.code === codeArr[0] + "." + codeArr[1])[0];
      console.log(subUsageCategoryMenu(val), "inside usestate");
      return val;
    }
  });

  const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue } = useForm();

  const formValue = watch();

  useEffect(() => {
    const code = formData?.usageCategoryMajor?.code;
    if (code !== usageType?.code && code !== "MIXED") {
      setUsageType(formData?.usageCategoryMajor);
    }
  }, [formData?.usageCategoryMajor?.code]);

  useEffect(() => {
    if (usageType?.code === "RESIDENTIAL") {
      console.log("set value for usageCategory called");
      setValue("usageCategory", usageType);
    } else {
      console.log(formValue.usageCategory, index, usageType?.code, "set value for usageCategory revoked");
      if (formValue.usageCategory?.code === "RESIDENTIAL") setValue("usageCategory", null);
    }
  }, [usageType]);

  useEffect(() => {
    let keys = Object.keys(formValue);
    const part = {};
    keys.forEach((key) => (part[key] = unit[key]));

    if (!_.isEqual(formValue, part)) setUnits((prev) => prev.map((item) => (item.key === unit.key ? { ...item, ...formValue } : item)));

    for (let key in formValue) {
      if (!formValue[key] && !localFormState.errors[key]) {
        setLocalError(key, { type: `${key.toUpperCase()}_REQUIRED`, message: `${key.toUpperCase()}_REQUIRED` });
      } else if (formValue[key] && localFormState.errors[key]) {
        clearLocalErrors([key]);
      }
    }

    // console.log(formValue, "on units fromvalue change");

    if (Object.keys(localFormState.errors).length && !formState?.errors?.units) {
      setError("units", { type: `${unit.key}`, message: Object.keys(localFormState.errors).join() });
    } else if (formState?.errors?.units?.type === `${unit.key}` && !Object.keys(localFormState.errors).length) {
      clearErrors("units");
    }
  }, [formValue]);

  const { errors } = localFormState;
  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };

  return (
    <div style={{ marginBottom: "16px" }}>
      <div className="label-field-pair">
        <h2 className="card-label card-label-smaller" style={{ color: "#505A5F" }}>
          Unit {unit?.order}
        </h2>
      </div>
      <div style={{ border: "1px solid #E3E3E3", padding: "16px", marginTop: "8px" }}>
        {allUnits.length > 1 ? (
          <div onClick={() => handleRemoveUnit(unit)} style={{ marginBottom: "16px", padding: "5px", cursor: "pointer", textAlign: "right" }}>
            X
          </div>
        ) : null}
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">{t("PT_FORM2_SELECT_FLOOR")}</CardLabel>
          <Controller
            name="floorNo"
            defaultValue={unit.floorNo}
            control={control}
            render={(props) => (
              <Dropdown
                className="form-field"
                selected={props.value}
                disable={false}
                option={getfloorlistdata(floorlist) || []}
                select={props.onChange}
                optionKey="i18nKey"
                onBlur={props.onBlur}
                t={t}
              />
            )}
          />
        </LabelFieldPair>
        <CardLabelError style={errorStyle}>{localFormState.touched.floorNo ? errors?.floorNo?.message : ""}</CardLabelError>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">{t("PT_PROPERTY_DETAILS_USAGE_TYPE_HEADER")}</CardLabel>
          <Dropdown
            className="form-field"
            selected={usageType}
            disable={formData?.usageCategoryMajor?.code !== "MIXED"}
            option={usageCategoryMajorMenu(usagecat)}
            select={setUsageType}
            optionKey="i18nKey"
            t={t}
          />
        </LabelFieldPair>

        <LabelFieldPair style={["RESIDENTIAL"].includes(usageType?.code) ? { display: "none" } : {}}>
          <CardLabel className="card-label-smaller">{t("PT_FORM2_USAGE_TYPE")}</CardLabel>
          <Controller
            name="usageCategory"
            defaultValue={subUsageCategoryMenu(usageType)?.filter((e) => e?.code === unit.existingUsageCategory)[0]}
            control={control}
            render={(props) => (
              <Dropdown
                className="form-field"
                selected={props.value}
                disable={!usageType?.code}
                option={subUsageCategoryMenu(usageType)}
                select={props.onChange}
                optionKey="i18nKey"
                onBlur={props.onBlur}
                t={t}
              />
            )}
          />
        </LabelFieldPair>
        {!["RESIDENTIAL"].includes(usageType?.code) ? (
          <CardLabelError style={errorStyle}>{localFormState.touched.usageCategory ? errors?.usageCategory?.message : ""}</CardLabelError>
        ) : null}

        <LabelFieldPair>
          <CardLabel className="card-label-smaller">{t("PT_FORM2_OCCUPANCY")}</CardLabel>
          <Controller
            name="occupancyType"
            defaultValue={unit?.occupancyType}
            control={control}
            render={(props) => (
              <Dropdown
                className="form-field"
                selected={props.value}
                disable={occupencyOptions?.length === 1}
                option={occupencyOptions}
                // select={selectSelfOccupied}
                select={props.onChange}
                optionKey="i18nKey"
                onBlur={props.onBlur}
                t={t}
              />
            )}
          />
        </LabelFieldPair>
        <CardLabelError style={errorStyle}>{localFormState.touched.occupancyType ? errors?.occupancyType?.message : ""}</CardLabelError>
        {formValue.occupancyType?.code === "RENTED" ? (
          <React.Fragment>
            <LabelFieldPair>
              <CardLabel className="card-label-smaller">{t("PT_FORM2_TOTAL_ANNUAL_RENT")}</CardLabel>
              <div className="field">
                <Controller
                  name="arv"
                  defaultValue={unit.arv}
                  control={control}
                  render={(props) => (
                    <TextInput
                      type="text"
                      name="unit-area"
                      onChange={(e) => {
                        props.onChange(e.target.value);
                        setFocusIndex({ index, type: "arv" });
                      }}
                      value={props.value}
                      autoFocus={focusIndex.index === index && focusIndex.type === "arv"}
                      onBlur={props.onBlur}
                    />
                  )}
                />
              </div>
            </LabelFieldPair>
            <CardLabelError style={errorStyle}>{localFormState.touched.arv ? errors?.arv?.message : ""}</CardLabelError>
          </React.Fragment>
        ) : null}
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">{t("PT_FORM2_BUILT_AREA")}</CardLabel>
          <div className="field">
            <Controller
              name="builtUpArea"
              defaultValue={unit?.builtUpArea}
              control={control}
              render={(props) => (
                <TextInput
                  type="text"
                  name="unit-area"
                  onChange={(e) => {
                    props.onChange(e.target.value);
                    setFocusIndex({ index, type: "builtUpArea" });
                  }}
                  value={props.value}
                  autoFocus={focusIndex.index === index && focusIndex.type === "builtUpArea"}
                  onBlur={props.onBlur}
                />
              )}
            />
          </div>
        </LabelFieldPair>
        <CardLabelError style={errorStyle}>{localFormState.touched.builtUpArea ? errors?.builtUpArea?.message : ""}</CardLabelError>
      </div>
    </div>
  );
}

export default Units;
