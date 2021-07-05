import React, { useState } from "react";
import { FormStep, RadioOrSelect, RadioButtons, LabelFieldPair, CardLabel, Dropdown, Loader } from "@egovernments/digit-ui-react-components";

const IsMutationPending = (props) => {
  const { t, config, onSelect, userType, formData } = props;

  const menu = [{ code: "YES" }, { code: "NO" }];

  const [isMutationInCourt, setSelected] = useState(formData?.[config.key]?.isMutationInCourt);

  const goNext = () => {
    onSelect(config.key, { ...formData?.[config.key], isMutationInCourt });
  };

  const onSkip = () => {};

  return (
    <React.Fragment>
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!isMutationInCourt}>
        <div>
          <RadioButtons
            t={t}
            optionsKey="i18nKey"
            isMandatory={config.isMandatory}
            options={menu}
            selectedOption={isMutationInCourt}
            onSelect={(v) => {
              setSelected(v);
            }}
            labelKey="PT_MUTATION_PENDING"
            isDependent={true}
          />
        </div>
      </FormStep>
    </React.Fragment>
  );
};

export default IsMutationPending;
