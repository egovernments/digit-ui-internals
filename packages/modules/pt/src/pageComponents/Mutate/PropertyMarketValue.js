import React, { useState } from "react";
import { FormStep, TextInput } from "@egovernments/digit-ui-react-components";

const PropertyMarketValue = (props) => {
  const { t, config, onSelect, userType, formData } = props;
  const [marketValue, setSelected] = useState(formData?.[config.key]?.marketValue);

  const goNext = () => {
    onSelect(config.key, { ...formData?.[config.key], marketValue });
  };
  const onSkip = () => {};

  return (
    <React.Fragment>
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!marketValue}>
        <div>
          <TextInput type={"number"} onChange={(e) => setSelected(e.target.value)} value={marketValue} />
        </div>
      </FormStep>
    </React.Fragment>
  );
};

export default PropertyMarketValue;
