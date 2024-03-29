import React, { useState, useEffect } from "react";
import FSMActionModal from "./FSMActionModal";
import PTActionModal from "./PTActionModal";
import TLActionModal from "./TLActionModal";

const ActionModal = (props) => {
  if (props?.businessService.includes("PT")) {
    return <PTActionModal {...props} />;
  }

  if (props?.businessService.includes("NewTL") || props?.businessService.includes("TL") || props?.businessService.includes("EDITRENEWAL") || props?.businessService.includes("DIRECTRENEWAL")) {
    return <TLActionModal {...props} />;
  }
  // return <FSMActionModal {...props} />;
};

export default ActionModal;
