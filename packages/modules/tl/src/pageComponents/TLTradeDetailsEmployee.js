import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardLabel, LabelFieldPair, Dropdown, TextInput, LinkButton, CardLabelError, MobileNumber, DatePicker } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import isUndefined from "lodash/isUndefined";
import { getUniqueItemsFromArray, commonTransform, stringReplaceAll } from "../utils";


const createTradeDetailsDetails = () => ({
  financialYear: "",
  licenseType: "",
  structureType: "",
  structureSubType: "",
  commencementDate: "",
  gstNo: "",
  operationalArea: "",
  noOfEmployees: "",
  key: Date.now()
});

const TLTradeDetailsEmployee = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isEditScreen = pathname.includes("/modify-application/");
  const [tradedetils, setTradedetils] = useState(formData?.tradedetils || [createTradeDetailsDetails()])
  const [structureSubTypeOptions, setStructureSubTypeOptions] = useState([]);
  const [owners, setOwners] = useState(formData?.owners || [createTradeDetailsDetails()]);
  const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const [isErrors, setIsErrors] = useState(false);
  const [licenseTypeList, setLicenseTypeList] = useState([]);

  const { isLoading, data: Menu = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "StructureType");

  const { data: FinaceMenu = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "egf-master", ["FinancialYear"]);

  const { data: billingSlabData } = Digit.Hooks.tl.useTradeLicenseBillingslab({ tenantId, filters: {} });

  const addNewOwner = () => {
    const newOwner = createTradeDetailsDetails();
    setOwners((prev) => [...prev, newOwner]);
  };

  const removeOwner = (owner) => {
    setOwners((prev) => prev.filter((o) => o.key != owner.key));
  };

  useEffect(() => {
    const data = tradedetils.map((e) => {
      return e;
    });
    onSelect(config?.key, data);
  }, [tradedetils]);

  useEffect(() => {
    setOwners([createTradeDetailsDetails()]);
  }, [formData?.tradedetils?.[0]?.key]);


  const commonProps = {
    focusIndex,
    allOwners: tradedetils,
    setFocusIndex,
    removeOwner,
    formData,
    formState,
    setOwners,
    t,
    setError,
    clearErrors,
    config,
    setTradedetils,
    FinaceMenu,
    setStructureSubTypeOptions,
    structureSubTypeOptions,
    Menu,
    setIsErrors,
    isErrors,
    billingSlabData,
    licenseTypeList, 
    setLicenseTypeList
  };

  if (isEditScreen) {
    return <React.Fragment />;
  }

  return (
    <React.Fragment>
      {tradedetils.map((tradedetail, index) => (
        <OwnerForm key={tradedetail.key} index={index} tradedetail={tradedetail} {...commonProps} />
      ))}
      {formData?.ownershipCategory?.code === "INDIVIDUAL.MULTIPLEOWNERS" ? (
        <LinkButton label="Add Owner" onClick={addNewOwner} style={{ color: "orange" }} />
      ) : null}
    </React.Fragment>
  );
};

const OwnerForm = (_props) => {
  const {
    tradedetail,
    index,
    focusIndex,
    allOwners,
    setFocusIndex,
    removeOwner,
    setOwners,
    t,
    formData,
    config,
    setError,
    clearErrors,
    formState,
    setTradedetils,
    FinaceMenu,
    setStructureSubTypeOptions,
    structureSubTypeOptions,
    Menu,
    setIsErrors,
    isErrors,
    billingSlabData,
    licenseTypeList, 
    setLicenseTypeList
  } = _props;

  const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger } = useForm();
  const formValue = watch();
  const { errors } = localFormState;

  useEffect(() => {
    debugger;
    if (billingSlabData && billingSlabData?.billingSlab && billingSlabData?.billingSlab?.length > 0) {
        const processedData =
            billingSlabData.billingSlab &&
            billingSlabData.billingSlab.reduce(
                (acc, item) => {
                    let accessory = { active: true };
                    let tradeType = { active: true };
                    if (item.accessoryCategory && item.tradeType === null) {
                        accessory.code = item.accessoryCategory;
                        accessory.uom = item.uom;
                        accessory.rate = item.rate;
                        item.rate && item.rate > 0 && acc.accessories.push(accessory);
                    } else if (item.accessoryCategory === null && item.tradeType) {
                        tradeType.code = item.tradeType;
                        tradeType.uom = item.uom;
                        tradeType.structureType = item.structureType;
                        tradeType.licenseType = item.licenseType;
                        tradeType.rate = item.rate;
                        !isUndefined(item.rate) &&
                            item.rate !== null &&
                            acc.tradeTypeData.push(tradeType);
                    }
                    return acc;
                },
                { accessories: [], tradeTypeData: [] }
            );
        let licenseTypes = getUniqueItemsFromArray(
            processedData.tradeTypeData,
            "licenseType"
        );
        licenseTypes = licenseTypes.map(item => {
            return { code: item.licenseType, active: true };
        });
        if (licenseTypes && licenseTypes.length > 0) {
          licenseTypes.forEach(data => {
            data.i18nKey = `TRADELICENSE_LICENSETYPE_${data.code}`
          })
        };
        setLicenseTypeList(licenseTypes);
    }
}, [billingSlabData]);



  let financialYearOptions = [];
  FinaceMenu && FinaceMenu["egf-master"] &&
    FinaceMenu["egf-master"].FinancialYear.map(data => { if (data.module == "TL") financialYearOptions.push({ code: data.name, i18nKey: `FY${data.name}`, id: data.name.split('-')[0] }) });

  let structureTypeOptions = [];
  // let structureSubTypeOptions = [];
  // let optionsOfStructureType = []
  structureTypeOptions = Menu && Menu["common-masters"] &&
    Menu["common-masters"].StructureType.map((e) => {
      let code = e?.code.split('.')[0];
      return ({ i18nKey: `COMMON_MASTERS_STRUCTURETYPE _${stringReplaceAll(code?.toUpperCase(), ".", "_")}`, label: code, ...e })
    }) || [];

  let selectedStructureTypeOptions = [];
  if (structureTypeOptions && structureTypeOptions.length > 0) {
    var flags = [], output = [], l = structureTypeOptions.length, i;
    for (i = 0; i < l; i++) {
      if (flags[structureTypeOptions[i].label]) continue;
      flags[structureTypeOptions[i].label] = true;
      selectedStructureTypeOptions.push({
        code: structureTypeOptions[i].label,
        i18nKey: `COMMON_MASTERS_STRUCTURETYPE _${stringReplaceAll(structureTypeOptions[i]?.label?.toUpperCase(), ".", "_")}`
      });
    }
  }

  const isIndividualTypeOwner = useMemo(() => formData?.ownershipCategory?.code.includes("INDIVIDUAL"), [formData?.ownershipCategory?.code]);

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    console.log(formValue, "in formvalue chnage");
    const keys = Object.keys(formValue);
    const part = {};
    keys.forEach((key) => (part[key] = tradedetail[key]));
    let _ownerType = {};
    if (!_.isEqual(formValue, part)) {
      Object.keys(formValue).map(data => {
        if (data != "key" && formValue[data] != undefined && formValue[data] != "" && formValue[data] != null && !isErrors) {
          setIsErrors(true);
        }
      });
      setTradedetils((prev) => prev.map((o) => {
        return (o.key && o.key === tradedetail.key ? { ...o, ...formValue, ..._ownerType } : { ...o })
      }));
      trigger();
    }
  }, [formValue]);



  useEffect(() => {
    if (Object.keys(errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, errors)) {
      setError(config.key, { type: errors });
    }
    else if (!Object.keys(errors).length && formState.errors[config.key] && isErrors) {
      clearErrors(config.key);
    }
  }, [errors]);

  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };
  return (
    <React.Fragment>
      <div style={{ marginBottom: "16px" }}>
        <div style={{ border: "1px solid #E3E3E3", padding: "16px", marginTop: "8px" }}>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_FINANCIAL_YEAR_LABEL")}:`}</CardLabel>
            <Controller
              name="financialYear"
              rules={{ required: t("REQUIRED_FIELD") }}
              defaultValue={tradedetail?.financialYear}
              control={control}
              render={(props) => (
                <Dropdown
                  className="form-field"
                  selected={props.value}
                  disable={financialYearOptions?.length === 1}
                  option={financialYearOptions}
                  select={props.onChange}
                  optionKey="i18nKey"
                  onBlur={props.onBlur}
                  t={t}
                />
              )}
            />
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.financialYear ? errors?.financialYear?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_NEW_TRADE_DETAILS_LIC_TYPE_LABEL")}:`}</CardLabel>
            <Controller
              name="licenseType"
              defaultValue={tradedetail?.licenseType}
              control={control}
              render={(props) => (
                <Dropdown
                  className="form-field"
                  selected={licenseTypeList[0]}
                  disable={true}
                  option={licenseTypeList}
                  select={props.onChange}
                  optionKey="i18nKey"
                  onBlur={props.onBlur}
                  t={t}
                />
              )}
            />
          </LabelFieldPair>

          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_COMMON_TABLE_COL_TRD_NAME")}:`}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={"tradeName"}
                defaultValue={tradedetail?.name}
                rules={{ required: "NAME_REQUIRED", validate: { pattern: (val) => (/^\w+( +\w+)*$/.test(val) ? true : t("INVALID_NAME")) } }}
                render={(props) => (
                  <TextInput
                    value={props.value}
                    autoFocus={focusIndex.index === tradedetail?.key && focusIndex.type === "name"}
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      setFocusIndex({ index: tradedetail.key, type: "tradeName" });
                    }}
                    onBlur={(e) => {
                      setFocusIndex({ index: -1 });
                      props.onBlur(e);
                    }}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.tradeName ? errors?.tradeName?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_NEW_TRADE_DETAILS_STRUCT_TYPE_LABEL")}:`}</CardLabel>
            <Controller
              name="structureType"
              rules={{ required: t("REQUIRED_FIELD") }}
              defaultValue={tradedetail?.structureType}
              control={control}
              render={(props) => (
                <Dropdown
                  className="form-field"
                  selected={props.value}
                  disable={false}
                  option={selectedStructureTypeOptions}
                  select={(e) => {
                    let selectedOption = e?.code?.split('.')[0];
                    let structureSubTypeOption = [];
                    structureTypeOptions.map(data => {
                      if (selectedOption === data?.code?.split('.')[0]) {
                        structureSubTypeOption.push({
                          code: data?.code,
                          i18nKey: `COMMON_MASTERS_STRUCTURETYPE _${stringReplaceAll(data?.code?.toUpperCase(), ".", "_")}`,
                        })
                      }
                    });
                    setStructureSubTypeOptions(structureSubTypeOption);
                    props.onChange(e);
                  }}
                  optionKey="i18nKey"
                  onBlur={props.onBlur}
                  t={t}
                />
              )}
            />
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.structureType ? errors?.structureType?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_NEW_TRADE_DETAILS_STRUCT_SUB_TYPE_LABEL")}:`}</CardLabel>
            <Controller
              name="structureSubType"
              rules={{ required: t("REQUIRED_FIELD") }}
              defaultValue={tradedetail?.structureSubType}
              control={control}
              render={(props) => (
                <Dropdown
                  className="form-field"
                  selected={props.value}
                  disable={false}
                  option={structureSubTypeOptions}
                  select={props.onChange}
                  optionKey="i18nKey"
                  onBlur={props.onBlur}
                  t={t}
                />
              )}
            />
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.structureSubType ? errors?.structureSubType?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL")}:`}</CardLabel>
            <div className="field">
              <Controller
                name="commencementDate"
                rules={{ required: t("ERR_DEFAULT_INPUT_FIELD_MSG"), validate: { pattern: (val) => (/^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(val) ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")) } }}
                // defaultValue={tradedetils?.[0]?.commencementDate}
                control={control}
                render={(props) => (
                  <DatePicker
                    date={props.value}
                    // date={CommencementDate} 
                    name="CommencementDate"
                    onChange={props.onChange}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.commencementDate ? errors?.commencementDate?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_NEW_GST_NUMBER_LABEL")}:`}</CardLabel>
            <div className="field">
              <Controller
                name="gstNo"
                defaultValue={tradedetail?.gstNo}
                control={control}
                render={(props) => (
                  <TextInput
                    type="text"
                    name="unit-area"
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      setFocusIndex({ index: tradedetail?.key, type: "gstNo" });
                    }}
                    value={props.value}
                    autoFocus={focusIndex.index === tradedetail?.key && focusIndex.type === "gstNo"}
                    onBlur={props.onBlur}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_NEW_OPERATIONAL_SQ_FT_AREA_LABEL")}:`}</CardLabel>
            <div className="field">
              <Controller
                name="operationalArea"
                defaultValue={tradedetail?.operationalArea}
                control={control}
                render={(props) => (
                  <TextInput
                    type="text"
                    name="unit-area"
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      setFocusIndex({ index: tradedetail?.key, type: "operationalArea" });
                    }}
                    value={props.value}
                    autoFocus={focusIndex.index === tradedetail?.key && focusIndex.type === "operationalArea"}
                    onBlur={props.onBlur}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_NEW_NUMBER_OF_EMPLOYEES_LABEL")}:`}</CardLabel>
            <div className="field">
              <Controller
                name="noOfEmployees"
                defaultValue={tradedetail?.noOfEmployees}
                control={control}
                render={(props) => (
                  <TextInput
                    type="text"
                    name="unit-area"
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      setFocusIndex({ index: tradedetail?.key, type: "noOfEmployees" });
                    }}
                    value={props.value}
                    autoFocus={focusIndex.index === tradedetail?.key && focusIndex.type === "noOfEmployees"}
                    onBlur={props.onBlur}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TLTradeDetailsEmployee;
