import { FormComposer, Loader, Modal } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { configCancelConfig } from "./Modal/CancelConfig";
// t={t} tenantId={tenantId} applicationData={data} closeModal={closeModal} submitAction={submitAction}
const ReceiptCancelModal = ({ t, action, tenantId, closeModal, submitAction, applicationData, billData }) => {
  const history = useHistory();
  const [config, setConfig] = useState({});
  const [Reasons, setReasons] = useState([]);
  const [selectedReason, selecteReason] = useState("");
  const tenantIds = Digit.ULBService.getCurrentTenantId() || '';
  const tenant = tenantIds.split && tenantIds.split('.')[0] || '';
  const { isLoading, isError, errors, data, ...rest } = Digit.Hooks.receipts.useReceiptsMDMS(
    tenant,
    "CancelReceiptReason"
  );

  useEffect(() => {

    return setConfig(
      configCancelConfig({
        t,
        selectedReason,
        Reasons,
        selectReason,
      })
    );

  }, []);

  const Heading = (props) => {
    return <h1 className="heading-m">{props.label}</h1>;
  };

  function selectReason(e) {
    selecteReason(e);
  }
  const Close = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  );

  const CloseBtn = (props) => {
    return (
      <div className="icon-bg-secondary" onClick={props.onClick}>
        <Close />
      </div>
    );
  };


  useEffect(() => {
    setReasons(data?.["common-masters"]?.CancelReceiptReason);
  }, [data]);


  function submit(data) {
    // useHRMSUpdate
    data.effectiveFrom = new Date(data.effectiveFrom).getTime();
    data.reasonForDeactivation = selectedReason.code;

    Employees[0]["reactivationDetails"].push(data);
    Employees[0].isActive = true;

    history.push("/digit-ui/employee/hrms/response", { Employees, key: "UPDATE", action: "ACTIVATION" });

  }

  return config?.form ? (
    <Modal
      headerBarMain={<Heading label={t(config?.label?.heading)} />}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      actionCancelOnSubmit={closeModal}
      actionSaveLabel={t(config?.label?.submit)}
      actionSaveOnSubmit={() => { }}
      formId="modal-action"
      isDisabled={!selectedReason}
    >
      <FormComposer config={config?.form} noBoxShadow inline disabled={true} childrenAtTheBottom onSubmit={submit} formId="modal-action" />
    </Modal>
  ) : (
    <Loader />
  );
};
export default ReceiptCancelModal;
