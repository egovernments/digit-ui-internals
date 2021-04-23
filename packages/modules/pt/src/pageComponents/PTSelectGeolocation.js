import React, { useState } from "react";
import { LocationSearchCard } from "@egovernments/digit-ui-react-components";
import { cardBodyStyle } from "../utils";

const PTSelectGeolocation = ({ t, config, onSelect, formData = {} }) => {
  const [pincode, setPincode] = useState(formData?.address?.pincode || "");
  const [geoLocation, setGeoLocation] = useState(formData?.address?.geoLocation || {});
  const tenants = Digit.Hooks.pt.useTenants();
  const [pincodeServicability, setPincodeServicability] = useState(null);
  const isEditProperty = formData?.isEditProperty || false;

  const onSkip = () => onSelect();
  const onChange = (code, location) => {
    setPincodeServicability(null);
    const foundValue = tenants?.find((obj) => obj.pincode?.find((item) => item == code));
    if (!foundValue) {
      setPincodeServicability("PT_COMMON_PINCODE_NOT_SERVICABLE");
      setPincode("");
      setGeoLocation({});
    } else {
      setPincode(code);
      setGeoLocation(location);
    }
  };

  return (
    <LocationSearchCard
      header={t("PT_GEOLOCATON_HEADER")}
      cardText={t("PT_GEOLOCATION_TEXT")}
      nextText={t("PT_COMMON_NEXT")}
      skipAndContinueText={t("CORE_COMMON_SKIP_CONTINUE")}
      skip={onSkip}
      t={t}
      position={geoLocation}
      onSave={() => onSelect(config.key, { geoLocation, pincode }, false)}
      onChange={(code, location) => onChange(code, location)}
      disabled={pincode === "" || isEditProperty}
      forcedError={t(pincodeServicability)}
      cardBodyStyle={cardBodyStyle}
    />
  );
};

export default PTSelectGeolocation;
