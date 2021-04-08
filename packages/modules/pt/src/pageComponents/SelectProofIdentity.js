import React, { useState, useEffect } from "react";
import { FormStep, UploadFile, CardLabelDesc } from "@egovernments/digit-ui-react-components";

const SelectProofIdentity = ({ t, config, onSelect, userType, formData }) => {
  let index = window.location.href.charAt(window.location.href.length - 1);
  const [uploadedFile, setUploadedFile] = useState(formData?.owners[index]?.documents?.proofIdentity?.fileStoreId || null);
  const [file, setFile] = useState(formData?.owners[index]?.documents?.proofIdentity);
  const [error, setError] = useState(null);
  const cityDetails = Digit.ULBService.getCurrentUlb();
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
            // TODO: change module in file storage
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

  const handleSubmit = () => {
    let fileStoreId = uploadedFile;
    let fileDetails = file;
    if (fileDetails) {
      fileDetails = { ...fileDetails };
      fileDetails.documentType = "IDENTITYPROOF";
      fileDetails.fileStoreId = fileStoreId ? fileStoreId : null;
    }
    let ownerDetails = formData.owners && formData.owners[index];
    if (ownerDetails && ownerDetails.documents) {
      ownerDetails.documents["proofIdentity"] = { ...fileDetails };
    } else {
      ownerDetails["documents"] = [];
      ownerDetails.documents["proofIdentity"] = { ...fileDetails };
    }
    onSelect(config.key, ownerDetails, "", index);
    // onSelect(config.key, { specialProofIdentity: fileDetails }, "", index);
  };

  function onAdd() {
    let newIndex = parseInt(index) + 1;
    onSelect("owner-details", {}, false, newIndex, true);
  }
  return (
    <FormStep
      t={t}
      config={config}
      onSelect={handleSubmit}
      onSkip={onSkip}
      isDisabled={!uploadedFile}
      onAdd={onAdd}
      isMultipleAllow={formData?.ownershipCategory?.value == "INDIVIDUAL.MULTIPLEOWNERS"}
    >
      <CardLabelDesc>{t(`PT_UPLOAD_RESTRICTIONS_TYPES`)}</CardLabelDesc>
      <CardLabelDesc>{t(`PT_UPLOAD_RESTRICTIONS_SIZE`)}</CardLabelDesc>
      <UploadFile
        accept=".jpg"
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

export default SelectProofIdentity;
