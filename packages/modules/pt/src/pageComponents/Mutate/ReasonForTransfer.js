import React, { useEffect, useState } from "react";
import { Dropdown, FormStep, RadioButtons } from "@egovernments/digit-ui-react-components";

const ReasonForTransfer = (props) => {
  const { t, config, onSelect, userType, formData } = props;

  const { data, isLoading } = Digit.Hooks.pt.useMDMS("pb", "PropertyTax", "ReasonForTransfer", {});

  const [menu, setMenu] = useState([]);

  useEffect(() => {
    if (data) {
      let opt = data.PropertyTax.ReasonForTransfer.map((e) => ({ ...e, i18nKey: "PROPERTYTAX_REASONFORTRANSFER_" + e.code }));
      console.log(opt, "inside reason");
      setMenu(opt);
    }
  }, [data]);

  const [reasonForTransfer, setSelected] = useState(formData?.[config.key]?.reasonForTransfer);
  const goNext = () => {
    onSelect(config.key, { ...formData?.[config.key], reasonForTransfer });
  };
  const onSkip = () => {};

  return (
    <React.Fragment>
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!reasonForTransfer}>
        <div>
          <RadioButtons
            t={t}
            optionsKey="i18nKey"
            isMandatory={config.isMandatory}
            options={menu}
            onSelect={setSelected}
            selectedOption={reasonForTransfer}
          />
        </div>
      </FormStep>
    </React.Fragment>
  );
};

export default ReasonForTransfer;
