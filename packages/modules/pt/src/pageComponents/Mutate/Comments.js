import React, { useState } from "react";
import { TextInput, FormStep, TextArea } from "@egovernments/digit-ui-react-components";

const Comments = (props) => {
  const { t, config, onSelect, userType, formData } = props;

  const [remarks, setSelected] = useState(formData?.[config.key]?.remarks);

  const goNext = () => {
    onSelect(config.key, { ...formData?.[config.key], remarks });
  };
  const onSkip = () => {};

  return (
    <React.Fragment>
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip}>
        <div>
          <TextArea onChange={(e) => setSelected(e.target.value)} value={remarks} />
        </div>
      </FormStep>
    </React.Fragment>
  );
};

export default Comments;
