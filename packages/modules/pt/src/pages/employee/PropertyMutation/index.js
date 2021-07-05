import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormComposer, Toast } from "@egovernments/digit-ui-react-components";
import { newConfigMutate } from "../../../config/Mutate/config";

const TransferProperty = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const [canSubmit, setSubmitValve] = useState(false);
  const defaultValues = {};
  const history = useHistory();

  const onFormValueChange = (setValue, formData, formState) => {
    console.log(formData, formState.errors, "in mutate property");
    setSubmitValve(!Object.keys(formState.errors).length);
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  const configs = newConfigMutate;

  return (
    <FormComposer
      heading={t("ES_TITLE_MUTATE_PROPERTY")}
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

export default TransferProperty;
