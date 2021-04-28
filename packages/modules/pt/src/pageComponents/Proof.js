import React, { useState, useEffect } from "react";
import { FormStep, UploadFile, CardLabelDesc, Dropdown } from "@egovernments/digit-ui-react-components";

const Proof = ({ t, config, onSelect, userType, formData }) => {
  //let index = window.location.href.charAt(window.location.href.length - 1);
  let index = window.location.href.split("/").pop();
  const [uploadedFile, setUploadedFile] = useState(formData?.address?.documents?.ProofOfAddress?.fileStoreId || null);
  const [file, setFile] = useState(formData?.address?.documents?.ProofOfAddress);
  const [error, setError] = useState(null);
  const cityDetails = Digit.ULBService.getCurrentUlb();

  const [dropdownValue, setDropdownValue] = useState(formData?.address?.documents?.ProofOfAddress?.documentType || null);
  let dropdownData = [];
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const { data: Documentsob = {} } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "Documents");
  const docs = Documentsob?.PropertyTax?.Documents;
  const proofOfAddress = Array.isArray(docs) && docs.filter(doc => (doc.code).includes("ADDRESSPROOF"));
  if(proofOfAddress.length > 0) { 
    dropdownData = proofOfAddress[0]?.dropdownData;
    dropdownData.forEach(data => { data.i18nKey = data.code.replaceAll(".", "_") })
  }

  function setTypeOfDropdownValue(dropdownValue) {
    setDropdownValue(dropdownValue);
  }


  const handleSubmit = () => {
    let fileStoreId = uploadedFile;
    let fileDetails = file;
    if (fileDetails) fileDetails.documentType = dropdownValue?.code;
    if (fileDetails) fileDetails.fileStoreId = fileStoreId ? fileStoreId : null;
    let address = formData?.address;
    if (address && address.documents) {
      address.documents["ProofOfAddress"] = fileDetails;
    } else {
      address["documents"] = [];
      address.documents["ProofOfAddress"] = fileDetails;
    }
    onSelect(config.key, address, "", index);
    // onSelect(config.key, { specialProofIdentity: fileDetails }, "", index);
  };
  const onSkip = () => onSelect();

  function selectfile(e) {
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        if (file.size >= 5242880) {
          setError(t("PT_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
        } else {
          try {
            const response = await Digit.UploadServices.Filestorage("property-upload", file, "pb");
            if (response?.data?.files?.length > 0) {
              setUploadedFile(response?.data?.files[0]?.fileStoreId);
            } else {
              setError(t("PT_FILE_UPLOAD_ERROR"));
            }
          } catch (err) {
            console.error("Modal -> err ", err);
            setError(t("PT_FILE_UPLOAD_ERROR"));
          }
        }
      }
    })();
  }, [file]);

  return (
    <FormStep config={config} onSelect={handleSubmit} onSkip={onSkip} t={t} isDisabled={!uploadedFile}>
      <CardLabelDesc>{t(`PT_UPLOAD_RESTRICTIONS_TYPES`)}</CardLabelDesc>
      <CardLabelDesc>{t(`PT_UPLOAD_RESTRICTIONS_SIZE`)}</CardLabelDesc>
      <Dropdown
          t={t}
          isMandatory={false}
          option={dropdownData}
          selected={dropdownValue}
          optionKey="i18nKey"
          select={setTypeOfDropdownValue}
        />
      <UploadFile
        extraStyleName={"propertyCreate"}
        accept=".jpg,.png,.pdf"
        onUpload={selectfile}
        onDelete={() => {
          setUploadedFile(null);
        }}
        message={uploadedFile ? `1 ${t(`PT_ACTION_FILEUPLOADED`)}` : t(`PT_ACTION_NO_FILEUPLOADED`)}
      />
      <div style={{ disabled: "true", height: "20px", width: "100%" }}></div>
    </FormStep>
  );
};

export default Proof;
