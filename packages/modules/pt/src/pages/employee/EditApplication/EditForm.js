import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FormComposer, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { newConfig } from "../../../config/Create/config";
import _ from "lodash";

const EditForm = ({ applicationData }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { state } = useLocation();
  const [canSubmit, setSubmitValve] = useState(false);
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_HAPPENED", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_SUCCESS_DATA", {});

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
  }, []);

  const defaultValues = {
    originalData: applicationData,
    address: applicationData?.address,
    // address: {
    //   pincode: applicationData.address.pincode || "",
    //   locality: {
    //     ...applicationData.address.locality,
    //     i18nkey: `${applicationData.tenantId.toUpperCase().split(".").join("_")}_REVENUE_${applicationData.address.locality.code}`,
    //   },
    //   street: applicationData.address.street || "",
    //   doorNo: applicationData.address.doorNo || "",
    // },
    // landarea: {
    //   floorarea: applicationData?.landArea,
    // },
    // PropertyType: { i18nKey: `COMMON_PROPTYPE_${applicationData?.propertyType?.replaceAll(".", "_")}`, code: applicationData?.propertyType },
    // usageCategoryMajor: {
    //   i18nKey: applicationData?.usageCategoryMajor
    //     ? `PROPERTYTAX_BILLING_SLAB_${applicationData?.usageCategoryMajor}`
    //     : `PROPERTYTAX_BILLING_SLAB_${usageCategoryArray[1]}`,
    //   code: applicationData?.usageCategoryMajor ? `NONRESIDENTIAL.${applicationData?.usageCategoryMajor}` : `NONRESIDENTIAL.${usageCategoryArray[1]}`,
    // },
    // subusagetype: {
    //   SubUsageType: {
    //     i18nKey: applicationData?.usageCategoryMinor
    //       ? `COMMON_PROPSUBUSGTYPE_NONRESIDENTIAL_${applicationData?.usageCategoryMinor}`
    //       : `COMMON_PROPSUBUSGTYPE_NONRESIDENTIAL_${usageCategoryArray[1]}_${usageCategoryArray[3]}`,
    //   },
    //   subuagecode: applicationData?.usageCategory,
    // },
    // noOfFloors: positiveFloors?.filter((floor) => floor?.code == applicationData?.noOfFloors)[0],
    // units: applicationData?.units?.map((unit, index) => ({
    //   key: index,
    //   builtUpArea: unit?.constructionDetail?.builtUpArea,
    //   floorNo: floors
    //     ?.filter((floor) => floor?.code == unit?.floorNo)
    //     .map((item) => ({ i18nKey: "PROPERTYTAX_FLOOR_" + item?.code.replaceAll("-", "_"), code: item?.code }))[0],
    //   occupancyType: selfOccupiedData?.filter((item) => item?.code === unit?.occupancyType)[0],
    //   tenantId: unit?.tenantId || tenantId,
    //   usageCategory: "NONRESIDENTIAL.COMMERCIAL.RETAIL.SHOWROOM",
    //   usageCategory: {
    //     code: unit?.usageCategory,
    //     i18nKey: `COMMON_PROPSUBUSGTYPE_NONRESIDENTIAL_${unit?.usageCategory?.split(".")[1]}_${unit?.usageCategory?.split(".")[3]}`,
    //   },
    // })),
    // ownershipCategory: {
    //   ...ownershipCategory,
    //   i18nKey: `PT_OWNERSHIP_${ownershipCategory?.i18nKey?.split(".")[1]}`,
    // },
    // documents: {
    //   documents: applicationData?.documents,
    //   propertyTaxDocumentsLength: applicationData?.documents?.length,
    // },
    // owners: {
    //   altContactNumber: applicationData?.owners[0]?.altContactNumber,
    //   emailId: applicationData?.owners[0]?.emailId,
    //   fatherOrHusbandName: applicationData?.owners[0]?.fatherOrHusbandName,
    //   gender: { code: applicationData?.owners[0]?.gender },
    //   mobileNumber: applicationData?.owners[0]?.mobileNumber,
    //   name: applicationData?.owners[0]?.name,
    //   ownerType: ownerTypeData?.filter((item) => item?.code === applicationData?.owners[0]?.ownerType)[0],
    //   permanentAddress: applicationData?.owners[0]?.permanentAddress,
    //   relationship: { code: applicationData?.owners[0]?.relationship, i18nKey: `PT_RELATION_${applicationData?.owners[0]?.relationship}` },
    // },
  };

  const onFormValueChange = (setValue, formData, formState) => {
    console.log(formData, formState.errors, "inside the edit value");
    setSubmitValve(!Object.keys(formState.errors).length);
  };

  const onSubmit = (data) => {
    const formData = {
      ...applicationData,
      address: {
        ...applicationData?.address,
        ...data?.address,
        city: data?.address?.city?.name,
      },
      propertyType: data?.PropertyType?.code,
      creationReason: state.workflow?.businessService === "PT.CREATE" ? "CREATE" : "UPDATE",
      usageCategory: data?.usageCategoryMinor?.subuagecode ? data?.usageCategoryMinor?.subuagecode : data?.usageCategoryMajor?.code,
      usageCategoryMajor: data?.usageCategoryMajor?.code.split(".")[0],
      usageCategoryMinor: data?.usageCategoryMajor?.code.split(".")[1] || null,
      propertyType: data?.PropertyType?.code,
      noOfFloors: Number(data?.noOfFloors),
      landArea: Number(data?.landarea),
      propertyType: data?.PropertyType?.code,
      source: "MUNICIPAL_RECORDS", // required
      channel: "CFC_COUNTER", // required
      documents: data?.documents?.documents,
      units: data?.units,
      workflow: state.workflow,
      applicationStatus: "UPDATE",
    };

    let keys = Object.keys(formData);
    let unequalKeys = [];
    keys.forEach((key) => {
      if (!_.isEqual(formData[key], applicationData[key]) && applicationData[key])
        unequalKeys.push({ key, app: applicationData[key], form: formData[key] });
    });

    console.log(unequalKeys, "inside submit edit");

    history.push("/digit-ui/employee/pt/response", { Property: formData, key: "UPDATE", action: "SUBMIT" });
  };

  const configs = newConfig;

  return (
    <FormComposer
      heading={t("PT_UPDATE_PROPERTY")}
      isDisabled={!canSubmit}
      label={t("ES_COMMON_APPLICATION_SUBMIT")}
      config={configs.map((config) => {
        return {
          ...config,
          body: [
            ...config.body.filter((a) => !a.hideInEmployee),
            {
              withoutLabel: true,
              type: "custom",
              populators: {
                name: "originalData",
                component: (props, customProps) => <React.Fragment />,
              },
            },
          ],
        };
      })}
      fieldStyle={{ marginRight: 0 }}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      onFormValueChange={onFormValueChange}
    />
  );
};

export default EditForm;
