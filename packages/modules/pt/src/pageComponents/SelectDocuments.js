import React, { useEffect, useState } from "react";
import { CardLabel, LabelFieldPair, Dropdown, UploadFile, Toast, Loader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectDocuments = ({ t, config, onSelect, userType, formData, setError: setFormError, clearErrors: clearFormErrors, formState }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const [documents, setDocuments] = useState(formData?.documents?.documents || []);
  const [error, setError] = useState(null);

  let action = "create";

  const { pathname } = useLocation();
  const isEditScreen = pathname.includes("/modify-application/");

  if (isEditScreen) action = "update";

  const { isLoading, data } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", [
    "UsageCategory",
    "OccupancyType",
    "Floor",
    "OwnerType",
    "OwnerShipCategory",
    "Documents",
    "SubOwnerShipCategory",
    "OwnerShipCategory",
  ]);

  // console.log(data);

  const propertyTaxDocuments = data?.PropertyTax?.Documents;

  const goNext = () => {
    onSelect(config.key, { documents, propertyTaxDocumentsLength: propertyTaxDocuments?.length });
  };

  useEffect(() => {
    goNext();
  }, [documents]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      {propertyTaxDocuments?.map((document, index) => {
        // if (document.code === "OWNER.SPECIALCATEGORYPROOF") {
        //   if (formData?.owners?.every((user) => user.ownerType.code === "NONE" || !user.ownerType?.code)) {
        //     return null;
        //   }
        // }
        return (
          <SelectDocument
            key={index}
            document={document}
            action={action}
            t={t}
            error={error}
            setError={setError}
            setDocuments={setDocuments}
            documents={documents}
            formData={formData}
            setFormError={setFormError}
            clearFormErrors={clearFormErrors}
            config={config}
            formState={formState}
          />
        );
      })}
      {error && <Toast label={error} onClose={() => setError(null)} error />}
    </div>
  );
};

function SelectDocument({
  t,
  document: doc,
  setDocuments,
  error,
  setError,
  documents,
  action,
  formData,
  setFormError,
  clearFormErrors,
  config,
  formState,
  fromRawData,
}) {
  const filteredDocument = documents?.filter((item) => item?.documentType?.includes(doc?.code))[0];
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [selectedDocument, setSelectedDocument] = useState(
    filteredDocument
      ? { ...filteredDocument, active: filteredDocument?.status === "ACTIVE", code: filteredDocument?.documentType }
      : doc?.dropdownData?.length === 1
      ? doc?.dropdownData[0]
      : {}
  );
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(() => filteredDocument?.fileStoreId || null);

  const handleSelectDocument = (value) => setSelectedDocument(value);

  function selectfile(e) {
    setFile(e.target.files[0]);
  }
  const { dropdownData } = doc;
  const { dropdownFilter, enabledActions, filterCondition } = doc?.additionalDetails;
  var dropDownData = dropdownData;
  let hideInput = false;

  const [isHidden, setHidden] = useState(hideInput);

  const addError = () => {
    let type = formState.errors?.[config.key]?.type;
    if (!Array.isArray(type)) type = [];
    if (!type.includes(doc.code)) {
      type.push(doc.code);
      setFormError(config.key, { type });
    }
  };

  const removeError = () => {
    let type = formState.errors?.[config.key]?.type;
    if (!Array.isArray(type)) type = [];
    if (type.includes(doc?.code)) {
      type = type.filter((e) => e != doc?.code);
      if (!type.length) {
        clearFormErrors(config.key);
      } else {
        setFormError(config.key, { type });
      }
    }
  };

  useEffect(() => {
    if (selectedDocument?.code) {
      setDocuments((prev) => {
        const filteredDocumentsByDocumentType = prev?.filter((item) => item?.documentType !== selectedDocument?.code);

        if (uploadedFile?.length === 0 || uploadedFile === null) {
          return filteredDocumentsByDocumentType;
        }

        const filteredDocumentsByFileStoreId = filteredDocumentsByDocumentType?.filter((item) => item?.fileStoreId !== uploadedFile);
        return [
          ...filteredDocumentsByFileStoreId,
          {
            documentType: selectedDocument?.code,
            fileStoreId: uploadedFile,
            documentUid: uploadedFile,
          },
        ];
      });
    }
    if (!isHidden) {
      if (!uploadedFile || !selectedDocument?.code) {
        addError();
      } else if (uploadedFile && selectedDocument?.code) {
        removeError();
      }
    } else if (isHidden) {
      removeError();
    }
  }, [uploadedFile, selectedDocument, isHidden]);

  useEffect(() => {
    if (action === "update") {
      const originalDoc = formData?.originalData?.documents?.filter((e) => e.documentType.includes(doc?.code))[0];
      const docType = dropDownData.filter((e) => e.code === originalDoc?.documentType)[0];
      // console.log(dropDownData, docType, doc?.code, "inside update docs");
      if (!docType) setHidden(true);
      else {
        setSelectedDocument(docType);
        setUploadedFile(originalDoc?.fileStoreId);
      }
    } else if (action === "create") {
    }
  }, []);

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        if (file.size >= 5242880) {
          setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
          // if (!formState.errors[config.key]) setFormError(config.key, { type: doc?.code });
        } else {
          try {
            setUploadedFile(null);
            const response = await Digit.UploadServices.Filestorage("PT", file, tenantId?.split(".")[0]);
            if (response?.data?.files?.length > 0) {
              setUploadedFile(response?.data?.files[0]?.fileStoreId);
            } else {
              setError(t("CS_FILE_UPLOAD_ERROR"));
            }
          } catch (err) {
            console.error("Modal -> err ", err);
            setError(t("CS_FILE_UPLOAD_ERROR"));
          }
        }
      }
    })();
  }, [file]);

  if (filterCondition) {
    const { filterValue, jsonPath, onArray, arrayAttribute, formDataPath, formArrayAttrPath } = filterCondition;
    if (action === "create") {
      const value = formDataPath.reduce((acc, key) => {
        if (key.charAt(0).toUpperCase() + key.slice(1) === "PropertyType") return acc["PropertyType"];
        return acc?.[key];
      }, formData);

      if (doc.code === "OWNER.SPECIALCATEGORYPROOF") console.log(filterValue, jsonPath, arrayAttribute, doc.code);

      // console.log(value, onArray, "find value here");
      if (value) {
        if (onArray) {
          const valueArr = value?.map((e) => formArrayAttrPath.reduce((acc, f) => acc?.[f], e) || e);
          hideInput = valueArr?.some((e) => filterValue.includes(e));
        } else {
          hideInput = filterValue?.includes(value);
        }
        if (hideInput !== isHidden) setHidden(hideInput);
        if (hideInput) return null;
      }
    }

    if (action === "update") {
      const a = fromRawData ? jsonPath : jsonPath?.split("Properties[0].propertyDetails[0].")[1];
      const keyArr = a?.split(".")?.map((e) => (e.includes("[") ? e.split("[")[1]?.split("]")[0] : e));
      const value = keyArr.reduce((acc, curr) => acc[curr], formData?.originalData);
      if (value) {
        if (onArray) {
          hideInput = value?.some((e) => filterValue?.includes(e[arrayAttribute]));
        } else hideInput = filterValue?.includes(value);
        if (hideInput !== isHidden) setHidden(hideInput);
        if (hideInput) return null;
      }
    }
  }

  if (dropdownFilter) {
    const { formDataPath, formArrayAttrPath, onArray, parentJsonpath, arrayAttribute } = dropdownFilter;
    // console.log(dropdownFilter, doc?.code);
    if (["create", "update"].includes(action)) {
      const arr = formDataPath;
      const value = arr.reduce((acc, key) => acc?.[key], formData);
      const attrForFormArray = formArrayAttrPath;
      if (value) {
        if (!onArray) dropDownData = dropdownData.filter((e) => e.parentValue.includes(value));
        else {
          const valueMap = value.map((e) => attrForFormArray?.reduce((acc, key) => acc[key], e) || e);
          dropDownData = dropdownData.filter((e) => e.parentValue.some((val) => valueMap.includes(val)));
        }
      }
    }
  }
  if (dropDownData?.length === 0) return null;

  return (
    <div style={{ marginBottom: "24px" }}>
      {doc?.hasDropdown ? (
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">{t(doc?.code)}</CardLabel>
          <Dropdown
            className="form-field"
            selected={selectedDocument}
            disable={dropDownData?.length === 0 || enabledActions?.[action].disableDropdown}
            option={dropDownData}
            select={handleSelectDocument}
            optionKey="code"
            t={t}
          />
        </LabelFieldPair>
      ) : null}
      <LabelFieldPair>
        <CardLabel className="card-label-smaller"></CardLabel>
        <div className="field">
          <UploadFile
            onUpload={selectfile}
            onDelete={() => {
              setUploadedFile(null);
            }}
            message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
            textStyles={{ width: "100%" }}
            disabled={enabledActions?.[action].disableUpload || !selectedDocument?.code}
          />
        </div>
      </LabelFieldPair>
    </div>
  );
}

export default SelectDocuments;
