import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormComposer } from "@egovernments/digit-ui-react-components";
import { newConfig } from "../../../config/Create/config";

const NewApplication = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const [canSubmit, setSubmitValve] = useState(false);
  const defaultValues = {};

  const onFormValueChange = (setValue, formData) => {
    if (
      formData?.address?.city?.code &&
      formData?.address?.locality?.code &&
      formData?.PropertyType?.code &&
      formData?.ownershipCategory?.code &&
      formData?.owners?.name &&
      formData?.owners?.mobileNumber &&
      formData?.usageCategoryMajor?.code &&
      formData?.usageCategoryMinor?.subuagecode &&
      formData?.owners?.ownerType?.code &&
      formData?.documents?.documents?.length === formData?.documents?.propertyTaxDocumentsLength
    ) {
      if (formData?.ownershipCategory?.code !== "INDIVIDUAL.SINGLEOWNER" && formData?.owners?.altContactNumber) {
        if (formData?.PropertyType?.code !== "VACANT" && formData?.noOfFloors?.i18nKey) {
          setSubmitValve(true);
        } else if (formData?.PropertyType?.code === "VACANT" && formData?.landarea?.length > 0) {
          setSubmitValve(true);
        } else {
          setSubmitValve(false);
        }
      } else {
        setSubmitValve(false);
      }
    } else {
      setSubmitValve(false);
    }
  };

  const { mutate } = Digit.Hooks.pt.usePropertyAPI(tenantId);

  const onSubmit = (data) => {
    const formData = {
      tenantId,
      address: {
        ...data?.address,
        city: data?.address?.city?.name,
      },
      usageCategory: data?.usageCategoryMinor?.subuagecode ? data?.usageCategoryMinor?.subuagecode : data?.usageCategoryMajor?.code,
      landArea: data?.landarea,
      propertyType: data?.PropertyType?.code,
      noOfFloors: data?.noOfFloors?.code,
      ownershipCategory: data?.ownershipCategory?.code,
      owners: [
        {
          ...data?.owners,
          ownerType: data?.owners?.ownerType.code,
          gender: data?.owners?.gender.code,
          relationship: data?.owners?.relationship.code,
        },
      ],
      channel: "CFC_COUNTER", // required
      creationReason: "CREATE", // required
      source: "MUNICIPAL_RECORDS", // required
      superBuiltUpArea: data?.landarea,
      units: data?.units[0]?.usageCategory ? data?.units : [],
      documents: data?.documents?.documents,
    };
    console.log("%c 🚡: onSubmit -> formData ", "font-size:16px;background-color:#aedadd;color:black;", formData);

    mutate(
      { Property: formData },
      {
        onError: (error, variables) => {
          console.log("%c 🔏: onSubmit -> error ", "font-size:16px;background-color:#b6d3e4;color:black;", error);
        },
        onSuccess: (data, variables) => {
          console.log("%c 👷‍♂️: onSubmit -> data ", "font-size:16px;background-color:#b76d44;color:white;", data);
        },
      }
    );
  };
  const configs = newConfig;

  return (
    <FormComposer
      heading={t("ES_TITLE_NEW_PROPERTY_APPLICATION")}
      isDisabled={!canSubmit}
      label={t("ES_COMMON_APPLICATION_SUBMIT")}
      config={configs.map((config) => {
        return {
          ...config,
          body: config.body.filter((a) => !a.hideInEmployee),
        };
      })}
      fieldStyle={{ marginRight: 0 }}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      onFormValueChange={onFormValueChange}
    />
  );
};

export default NewApplication;
