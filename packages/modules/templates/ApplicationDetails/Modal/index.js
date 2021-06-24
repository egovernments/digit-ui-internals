import React, { useState, useEffect } from "react";
import FSMActionModal from "./FSMActionModal";
import PTActionModal from "./PTActionModal";

const ActionModal = (props) => {
  console.log(props.action, "inside action modal index");
  if (props?.businessService.includes("PT")) {
    return <PTActionModal {...props} />;
  }

  // return <FSMActionModal {...props} />;
};

export default ActionModal;
