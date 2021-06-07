/* import { CardLabel, CardLabelDesc, Dropdown, FormStep, UploadFile } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { stringReplaceAll } from "../utils";

const SelectSpecialProofIdentity = ({ t, config, onSelect, userType, formData }) => {
  let index = window.location.href.charAt(window.location.href.length - 1);
  const [uploadedFile, setUploadedFile] = useState(formData?.owners?.documents?.specialProofIdentity?.fileStoreId || null);
  const [file, setFile] = useState(formData?.owners?.documents?.specialProofIdentity);
  const [error, setError] = useState(null);
  const cityDetails = Digit.ULBService.getCurrentUlb();
  const isUpdateProperty = formData?.isUpdateProperty || false;
  let isEditProperty = formData?.isEditProperty || false;
  const [dropdownValue, setDropdownValue] = useState(formData?.owners?.documents?.specialProofIdentity?.documentType);
  let dropdownData = [];
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const { data: Documentsob = {} } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "Documents");
  const docs = Documentsob?.PropertyTax?.Documents;
  const specialProofIdentity = Array.isArray(docs) && docs.filter((doc) => doc.code.includes("SPECIALCATEGORYPROOF"));
  if (specialProofIdentity.length > 0) {
    dropdownData = specialProofIdentity[0]?.dropdownData;
    dropdownData.forEach((data) => {
      data.i18nKey = stringReplaceAll(data.code, ".", "_");
    });

    dropdownData = dropdownData?.filter((dropdown) => dropdown.parentValue.includes(formData?.owners?.ownerType?.code));
    if (dropdownData.length == 1 && dropdownValue != dropdownData[0]) {
      setTypeOfDropdownValue(dropdownData[0]);
    }
  }

  function setTypeOfDropdownValue(dropdownValue) {
    setDropdownValue(dropdownValue);
  }

  const handleSubmit = () => {
    let fileStoreId = uploadedFile;
    let fileDetails = file;
    if (fileDetails) {
      fileDetails.documentType = dropdownValue;
      fileDetails.fileStoreId = fileStoreId ? fileStoreId : null;
    }
    let ownerDetails = formData.owners;
    if (ownerDetails && ownerDetails.documents) {
      ownerDetails.documents["specialProofIdentity"] = fileDetails;
    } else {
      ownerDetails["documents"] = [];
      ownerDetails.documents["specialProofIdentity"] = fileDetails;
    }
    onSelect(config.key, ownerDetails, "", index);
    // onSelect(config.key, { specialProofIdentity: fileDetails }, "", index);
  };
  const onSkip = () => onSelect();

  useEffect(() => {
    if (formData.owners && formData.owners[index] && formData.owners[index].ownerType.code === "NONE") onSelect("", {}, true, index);
  }, [formData.owners && formData.owners[index] && formData.owners[index].ownerType.code]);
  function selectfile(e) {
    setFile(e.target.files[0]);
  }
  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        if (file.size >= 2000000) {
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
            // setError(t("PT_FILE_UPLOAD_ERROR"));
          }
        }
      }
    })();
  }, [file]);

  return (
    <FormStep config={config} onSelect={handleSubmit} onSkip={onSkip} t={t} isDisabled={!uploadedFile || !dropdownValue || error}>
      <CardLabelDesc>{t(`PT_UPLOAD_RESTRICTIONS_TYPES`)}</CardLabelDesc>
      <CardLabelDesc>{t(`PT_UPLOAD_RESTRICTIONS_SIZE`)}</CardLabelDesc>
      <CardLabel>{`${t("PT_CATEGORY_DOCUMENT_TYPE")}`}</CardLabel>
      <Dropdown
        t={t}
        isMandatory={false}
        option={dropdownData}
        selected={dropdownValue}
        optionKey="i18nKey"
        select={setTypeOfDropdownValue}
        placeholder={t(`PT_MUTATION_SELECT_DOC_LABEL`)}
        disable={isUpdateProperty || isEditProperty}
      />
      <UploadFile
        extraStyleName={"propertyCreate"}
        accept=".jpg,.png,.pdf"
        onUpload={selectfile}
        onDelete={() => {
          setUploadedFile(null);
        }}
        message={uploadedFile ? `1 ${t(`PT_ACTION_FILEUPLOADED`)}` : t(`PT_ACTION_NO_FILEUPLOADED`)}
        error={error}
      />
      {error ? <div style={{ height: "20px", width: "100%", fontSize: "20px", color: "red", marginTop: "5px" }}>{error}</div> : ""}
      <div style={{ disabled: "true", height: "20px", width: "100%" }}></div>
    </FormStep>
  );
};

export default SelectSpecialProofIdentity;
 */

import React, { useState, useEffect } from "react";
import { FormStep, UploadFile, CardLabelDesc, Dropdown, CardLabel } from "@egovernments/digit-ui-react-components";
import { stringReplaceAll } from "../utils";

const SelectOwnershipProof = ({ t, config, onSelect, userType, formData }) => {
  debugger;
  //let index = window.location.href.charAt(window.location.href.length - 1);
  let index = window.location.href.split("/").pop();
  const [uploadedFile, setUploadedFile] = useState(formData?.owners?.documents?.ProofOfOwnership?.fileStoreId || null);
  const [file, setFile] = useState(formData?.owners?.documents?.ProofOfOwnership);
  const [error, setError] = useState(null);
  const cityDetails = Digit.ULBService.getCurrentUlb();

  const [dropdownValue, setDropdownValue] = useState(formData?.owners?.documents?.ProofOfOwnership?.documentType || null);
  let dropdownData = [];
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const { data: Documentsob = {} } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "Documents");
  const docs = Documentsob?.PropertyTax?.Documents;
  const proofOfOwnership = Array.isArray(docs) && docs.filter((doc) => doc.code.includes("ADDRESSPROOF"));
  if (proofOfOwnership.length > 0) {
    dropdownData = proofOfOwnership[0]?.dropdownData;
    dropdownData.forEach((data) => {
      data.i18nKey = stringReplaceAll(data.code, ".", "_");
    });
  }

  function setTypeOfDropdownValue(dropdownValue) {
    setDropdownValue(dropdownValue);
  }

  const handleSubmit = () => {
    let fileStoreId = uploadedFile;
    let fileDetails = file;
    if (fileDetails) fileDetails.documentType = dropdownValue;
    if (fileDetails) fileDetails.fileStoreId = fileStoreId ? fileStoreId : null;
    let owners = formData?.owners;
    if (owners && owners.documents) {
      owners.documents["ProofOfOwnership"] = fileDetails;
    } else {
      owners["documents"] = [];
      owners.documents["ProofOfOwnership"] = fileDetails;
    }
    onSelect(config.key, owners, "", index);
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
        if (file.size >= 2000000) {
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
            // setError(t("PT_FILE_UPLOAD_ERROR"));
          }
        }
      }
    })();
  }, [file]);

  return (
    <FormStep config={config} onSelect={handleSubmit} onSkip={onSkip} t={t} isDisabled={!uploadedFile || !dropdownValue || error}>
      <CardLabelDesc>{t(`TL_UPLOAD_RESTRICTIONS_TYPES`)}</CardLabelDesc>
      <CardLabelDesc>{t(`TL_UPLOAD_RESTRICTIONS_SIZE`)}</CardLabelDesc>
      <CardLabel>{`${t("TL_CATEGORY_DOCUMENT_TYPE")}`}</CardLabel>
      <Dropdown
        t={t}
        isMandatory={false}
        option={dropdownData}
        selected={dropdownValue}
        optionKey="i18nKey"
        select={setTypeOfDropdownValue}
        //placeholder={t(`PT_MUTATION_SELECT_DOC_LABEL`)}
      />
      <UploadFile
        extraStyleName={"propertyCreate"}
        accept=".jpg,.png,.pdf"
        onUpload={selectfile}
        onDelete={() => {
          setUploadedFile(null);
        }}
        message={uploadedFile ? `1 ${t(`TL_ACTION_FILEUPLOADED`)}` : t(`TL_ACTION_NO_FILEUPLOADED`)}
        error={error}
      />
      {error ? <div style={{ height: "20px", width: "100%", fontSize: "20px", color: "red", marginTop: "5px" }}>{error}</div> : ""}
      <div style={{ disabled: "true", height: "20px", width: "100%" }}></div>
    </FormStep>
  );
};

export default SelectOwnershipProof;
