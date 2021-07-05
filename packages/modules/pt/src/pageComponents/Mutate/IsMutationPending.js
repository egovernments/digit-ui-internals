import React, { useEffect, useState } from "react";
import { FormStep, RadioButtons, LabelFieldPair, CardLabel, Dropdown, Loader } from "@egovernments/digit-ui-react-components";

const IsMutationPending = (props) => {
  const { t, config, onSelect, userType, formData, setError, clearErrors, errors } = props;

  const menu = [{ code: "YES" }, { code: "NO" }];

  const [isMutationInCourt, setSelected] = useState(formData?.[config.key]?.isMutationInCourt);

  const goNext = () => {
    onSelect(config.key, { ...formData?.[config.key], isMutationInCourt });
  };

  useEffect(() => {
    if (userType === "employee") {
      if (!isMutationInCourt) {
        setError(config.key, { type: "Required" });
      } else if (errors?.[config.key]) clearErrors(config.key);
      goNext();
    }
  }, [isMutationInCourt]);

  const onSkip = () => {};

  if (userType === "employee") {
    return (
      <React.Fragment>
        <LabelFieldPair style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <CardLabel style={{ fontWeight: "bold" }} className="card-label-smaller">
            {t("PT_MUTATION_COURT_PENDING_OR_NOT") + " *"}
          </CardLabel>
          <div className="field">
            <RadioButtons
              style={{ display: "flex" }}
              innerStyles={{ paddingRight: "250px" }}
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
        </LabelFieldPair>
      </React.Fragment>
    );
  }

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
