import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardLabel, LabelFieldPair, Dropdown, TextInput, LinkButton, CardLabelError, MobileNumber } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import { getUniqueItemsFromArray, stringReplaceAll } from "../utils";
import cloneDeep from "lodash/cloneDeep";


const createUnitDetails = () => ({
    tradeType: "",
    tradeSubType: "",
    tradeCategory: "",
    uom: "",
    uomValue: "",
    key: Date.now(),
});

const TLTradeUnitsEmployee = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const isEditScreen = pathname.includes("/modify-application/");
    const [units, setUnits] = useState(formData?.tradeUnits || [createUnitDetails()]);
    // const [owners, setOwners] = useState(formData?.owners || [createOwnerDetails()]);
    const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = tenantId.split(".")[0];
    const [tradeTypeMdmsData, setTradeTypeMdmsData] = useState([]);
    const [tradeCategoryValues, setTradeCategoryValues] = useState([]);
    const [tradeTypeOptionsList, setTradeTypeOptionsList] = useState([]);
    const [tradeSubTypeOptionsList, setTradeSubTypeOptionsList] = useState([]);
    const [isErrors, setIsErrors] = useState(false);

    const { data: tradeMdmsData,isLoading } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "TradeLicense", "TradeUnits", "[?(@.type=='TL')]");

    const addNewUnits = () => {
        const newUnit = createUnitDetails();
        setUnits((prev) => [...prev, newUnit]);
    };

    const removeUnit = (unit) => {
        setUnits((prev) => prev.filter((o) => o.key != unit.key));
    };

    useEffect(() => {
        const data = units.map((e) => {
            return e;
        });
        onSelect(config?.key, data);
    }, [units]);


    // useEffect(() => {
    //   setUnits([createOwnerDetails()]);
    // }, [formData?.ownershipCategory?.code]);


    const commonProps = {
        focusIndex,
        allUnits: units,
        setFocusIndex,
        removeUnit,
        formData,
        formState,
        setUnits,
        // mdmsData,
        t,
        setError,
        clearErrors,
        config,
        tradeCategoryValues,
        tradeTypeOptionsList,
        setTradeTypeOptionsList,
        tradeTypeMdmsData,
        tradeSubTypeOptionsList,
        setTradeSubTypeOptionsList,
        setTradeTypeMdmsData,
        setTradeCategoryValues,
        tradeMdmsData,
        isErrors,
        setIsErrors
    };

    if (isEditScreen) {
        return <React.Fragment />;
    }

    return (
        <React.Fragment>
            {units.map((unit, index) => (
                <TradeUnitForm key={unit.key} index={index} unit={unit} {...commonProps} />
            ))}
            <LinkButton label={t("TL_ADD_TRADE_UNIT")} onClick={addNewUnits} style={{ color: "orange" }} />
        </React.Fragment>
    );
};

const TradeUnitForm = (_props) => {
    const {
        unit,
        index,
        focusIndex,
        allUnits,
        setFocusIndex,
        removeUnit,
        setUnits,
        t,
        // mdmsData,
        formData,
        config,
        setError,
        clearErrors,
        formState,
        tradeCategoryValues,
        tradeTypeOptionsList,
        setTradeTypeOptionsList,
        tradeTypeMdmsData,
        tradeSubTypeOptionsList,
        setTradeSubTypeOptionsList,
        setTradeTypeMdmsData,
        setTradeCategoryValues,
        tradeMdmsData,
        isErrors,
        setIsErrors
    } = _props;

    const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger, getValues } = useForm();
    const formValue = watch();
    const { errors } = localFormState;

    const isIndividualTypeOwner = useMemo(() => formData?.ownershipCategory?.code.includes("INDIVIDUAL"), [formData?.ownershipCategory?.code]);

    useEffect(() => {
        if (tradeMdmsData?.TradeLicense?.TradeType?.length > 0 && formData?.tradedetils?.["0"]?.structureType?.code) {
            setTradeTypeMdmsData(tradeMdmsData?.TradeLicense?.TradeType);
            let tradeType = cloneDeep(tradeMdmsData?.TradeLicense?.TradeType);
            let tradeCatogoryList = [];
            tradeType.map(data => {
                data.code = data?.code?.split('.')[0];
                data.i18nKey = t(`TRADELICENSE_TRADETYPE_${data?.code?.split('.')[0]}`);
                tradeCatogoryList.push(data);
            });
            const filterTradeCategoryList = getUniqueItemsFromArray(tradeCatogoryList, "code");
            setTradeCategoryValues(filterTradeCategoryList);
        }
    }, [formData?.tradedetils?.[0]?.structureType?.code]);

    useEffect(() => {
        trigger();
    }, []);

    useEffect(() => {
        console.log(formValue, "in formvalue chnage");
        const keys = Object.keys(formValue);
        const part = {};
        keys.forEach((key) => (part[key] = unit[key]));

        let _ownerType = isIndividualTypeOwner ? {} : { ownerType: { code: "NONE" } };

        if (!_.isEqual(formValue, part)) {
            Object.keys(formValue).map(data => {
                if (data != "key" && formValue[data] != undefined && formValue[data] != "" && formValue[data] != null && !isErrors) {
                  setIsErrors(true); 
                }
              });
            
            setUnits((prev) => prev.map((o) => (o.key && o.key === unit.key ? { ...o, ...formValue, ..._ownerType } : { ...o })));
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
                    {allUnits?.length > 1 ? (
                        <div onClick={() => removeUnit(unit)} style={{ marginBottom: "16px", padding: "5px", cursor: "pointer", textAlign: "right" }}>
                            X
                        </div>
                    ) : null}
                    <LabelFieldPair>
                        <CardLabel className="card-label-smaller">{`${t("TRADELICENSE_TRADECATEGORY_LABEL")}:`}</CardLabel>
                        <Controller
                            control={control}
                            name={"tradeCategory"}
                            defaultValue={unit?.tradeCategory}
                            rules={{ required: "Required" }}
                            render={(props) => (
                                <Dropdown
                                    className="form-field"
                                    selected={props.value}
                                    disable={false}
                                    option={tradeCategoryValues}
                                    select={(e) => {
                                        let selectedOption = e?.code;
                                        if (tradeTypeMdmsData?.length > 0) {
                                            let tradeType = cloneDeep(tradeTypeMdmsData);
                                            let filteredTradeType = tradeType.filter(data => data?.code?.split('.')[0] === selectedOption)
                                            let tradeTypeOptions = [];
                                            filteredTradeType.map(data => {
                                                data.code = data?.code?.split('.')[1];
                                                data.code = data?.code?.split('.')[0];
                                                data.i18nKey = t(`TRADELICENSE_TRADETYPE_${data?.code?.split('.')[0]}`);
                                                tradeTypeOptions.push(data);
                                            });
                                            const filterTradeCategoryList = getUniqueItemsFromArray(filteredTradeType, "code");
                                            setTradeTypeOptionsList(filterTradeCategoryList);
                                        }
                                        props.onChange(e);
                                    }}
                                    optionKey="i18nKey"
                                    onBlur={(e) => {
                                        setFocusIndex({ index: -1 });
                                        props.onBlur(e);
                                      }}
                                    t={t}
                                />
                            )}
                        />
                    </LabelFieldPair>
                    <CardLabelError style={errorStyle}>{localFormState.touched.tradeCategory ? errors?.tradeCategory?.message : ""}</CardLabelError>
                    <LabelFieldPair>
                        <CardLabel className="card-label-smaller">{`${t("TRADELICENSE_TRADETYPE_LABEL")}:`}</CardLabel>
                        <Controller
                            control={control}
                            name={"tradeType"}
                            defaultValue={unit?.tradeType}
                            rules={{ required: "Required" }}
                            render={(props) => (
                                <Dropdown
                                    className="form-field"
                                    selected={props.value}
                                    disable={false}
                                    option={unit?.tradeCategory ? tradeTypeOptionsList : []}
                                    select={(e) => {
                                        let selectedOption = e?.code;
                                        if (tradeTypeMdmsData?.length > 0) {
                                            let tradeType = cloneDeep(tradeTypeMdmsData);
                                            let filteredTradeSubType = tradeType.filter(data => data?.code?.split('.')[1] === selectedOption)
                                            let tradeSubTypeOptions = [];
                                            filteredTradeSubType.map(data => {
                                                let code = stringReplaceAll(data?.code, "-", "_");
                                                data.i18nKey = t(`TRADELICENSE_TRADETYPE_${stringReplaceAll(code, ".", "_")}`);
                                                tradeSubTypeOptions.push(data);
                                            });
                                            const filterTradeSubTypeList = getUniqueItemsFromArray(tradeSubTypeOptions, "code");
                                            setTradeSubTypeOptionsList(filterTradeSubTypeList);
                                        }
                                        props.onChange(e);
                                    }}
                                    optionKey="i18nKey"
                                    onBlur={props.onBlur}
                                    t={t}
                                />
                            )}
                        />
                    </LabelFieldPair>
                    <CardLabelError style={errorStyle}>{localFormState.touched.tradeType ? errors?.tradeType?.message : ""}</CardLabelError>
                    <LabelFieldPair>
                        <CardLabel className="card-label-smaller">{`${t("TL_NEW_TRADE_SUB_TYPE_LABEL")}:`}</CardLabel>
                        <Controller
                            control={control}
                            name={"tradeSubType"}
                            defaultValue={unit?.tradeSubType}
                            rules={{ required: "Required" }}
                            render={(props) => (
                                <Dropdown
                                    className="form-field"
                                    selected={props.value}
                                    disable={false}
                                    option={unit?.tradeType ? tradeSubTypeOptionsList : []}
                                    select={props.onChange}
                                    optionKey="i18nKey"
                                    onBlur={props.onBlur}
                                    t={t}
                                />
                            )}
                        />
                    </LabelFieldPair>
                    <CardLabelError style={errorStyle}> {localFormState.touched.tradeSubType ? errors?.tradeSubType?.message : ""} </CardLabelError>
                    <LabelFieldPair>
                        <CardLabel className="card-label-smaller">{`${t("TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER")}:`}</CardLabel>
                        <div className="field">
                            <Controller
                                control={control}
                                name={"uom"}
                                defaultValue={unit?.tradeSubType?.uom}
                                rules={unit?.tradeSubType?.uom ? { required: "Required", validate: (v) => (/^(0)*[1-9][0-9]{0,5}$/.test(v) ? true : "ERR_DEFAULT_INPUT_FIELD_MSG") } : {}}
                                render={(props) => (
                                    <TextInput
                                        value={unit?.tradeSubType?.uom || ""}
                                        autoFocus={focusIndex.index === unit?.key && focusIndex.type === "uom"}
                                        onChange={(e) => {
                                            props.onChange(e);
                                            setFocusIndex({ index: unit.key, type: "uom" });
                                        }}
                                        disable={true}
                                        onBlur={props.onBlur}
                                    />
                                )}
                            />
                        </div>
                    </LabelFieldPair>
                    <CardLabelError style={errorStyle}>{localFormState.touched.uom ? errors?.uom?.message : ""}</CardLabelError>
                    <LabelFieldPair>
                        <CardLabel className="card-label-smaller">{`${t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL")}:`}</CardLabel>
                        <div className="field">
                            <Controller
                                control={control}
                                name={"uomValue"}
                                defaultValue={unit?.uomValue}
                                rules={unit?.tradeSubType?.uom ? { required: "ERR_DEFAULT_INPUT_FIELD_MSG", validate: { pattern: (val) => (/^(0)*[1-9][0-9]{0,5}$/.test(val) ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")) } } : {}}
                                render={(props) => (
                                    <TextInput
                                        value={props.value}
                                        autoFocus={focusIndex.index === unit?.key && focusIndex.type === "uomValue"}
                                        onChange={(e) => {
                                            props.onChange(e);
                                            setFocusIndex({ index: unit.key, type: "uomValue" });
                                        }}
                                        disable={!(unit?.tradeSubType?.uom)}
                                        onBlur={props.onBlur}
                                    />
                                )}
                            />
                        </div>
                    </LabelFieldPair>
                    <CardLabelError style={errorStyle}> {localFormState.touched.uomValue ? errors?.uomValue?.message : ""} </CardLabelError>

                </div>
            </div>
        </React.Fragment>
    );
};

export default TLTradeUnitsEmployee;
