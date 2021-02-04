import React from "react";

import PopUp from "../atoms/PopUp";
import HeaderBar from "../atoms/HeaderBar";
import ButtonSelector from "../atoms/ButtonSelector";
import Toast from "../atoms/Toast";

const Modal = ({
  headerBarMain,
  headerBarEnd,
  children,
  actionCancelLabel,
  actionCancelOnSubmit,
  actionSaveLabel,
  actionSaveOnSubmit,
  error,
  setError,
}) => {
  return (
    <PopUp>
      <div className="popup-module">
        <HeaderBar main={headerBarMain} end={headerBarEnd} />
        <div className="popup-module-main">
          {children}
          <div className="popup-module-action-bar">
            <ButtonSelector theme="border" label={actionCancelLabel} onSubmit={actionCancelOnSubmit} />
            <ButtonSelector label={actionSaveLabel} onSubmit={actionSaveOnSubmit} />
          </div>
        </div>
      </div>
      {error && <Toast label={error} onClose={() => setError(null)} error />}
    </PopUp>
  );
};

export default Modal;
