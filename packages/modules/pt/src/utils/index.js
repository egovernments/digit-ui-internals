/*   method to check not null  if not returns false*/
export const checkForNotNull = (value = "") => {
  return value && value != null && value != undefined && value != "" ? true : false;
};

export const convertDotValues = (value = "") => {
  return (checkForNotNull(value) && ((value.replaceAll && value.replaceAll(".", "_")) || (value.replace && value.replace(".", "_")))) || "NA";
};

export const convertToLocale = (value = "", key = "") => {
  let convertedValue = convertDotValues(value);
  if (convertedValue == "NA") {
    return "PT_NA";
  }
  return `${key}_${convertedValue}`;
};

export const getPropertyTypeLocale = (value = "") => {
  return convertToLocale(value, "COMMON_PROPTYPE");
};

export const getPropertyUsageTypeLocale = (value = "") => {
  return convertToLocale(value, "COMMON_PROPUSGTYPE");
};

export const getPropertySubUsageTypeLocale = (value = "") => {
  return convertToLocale(value, "COMMON_PROPSUBUSGTYPE");
};
export const getPropertyOccupancyTypeLocale = (value = "") => {
  return convertToLocale(value, "PROPERTYTAX_OCCUPANCYTYPE");
};

export const getMohallaLocale = (value = "", tenantId = "") => {
  let convertedValue = convertDotValues(tenantId);
  if (convertedValue == "NA" || !checkForNotNull(value)) {
    return "PT_NA";
  }
  convertedValue = convertedValue.toUpperCase();
  return convertToLocale(value, `${convertedValue}_REVENUE`);
};

export const getPropertyOwnerTypeLocale = (value = "") => {
  return convertToLocale(value, "PROPERTYTAX_OWNERTYPE");
};

export const getFixedFilename = (filename = "", size = 5) => {
  if (filename.length <= size) {
    return filename;
  }
  return `${filename.substr(0, size)}...`;
};

export const shouldHideBackButton = (config = []) => {
  return config.filter((key) => window.location.href.includes(key.screenPath)).length > 0 ? true : false;
};

/*   style to keep the body height fixed across screens */
export const cardBodyStyle = {
  maxHeight: "calc(100vh - 20em)",
  overflowY: "auto",
};

export const propertyCardBodyStyle = {
  maxHeight: "calc(100vh - 10em)",
  overflowY: "auto",
};

export const setAddressDetails = (data) => {
  let { address } = data;

  let propAddress = {
    pincode: address?.pincode,
    landmark: address?.landmark,
    city: address?.city?.name,
    doorNo: address?.doorNo,
    street: address?.street,
    locality: {
      code: address?.locality?.code || "NA",
      area: address?.locality?.name,
    },
  };
  data.tenantId = address?.city?.code || "pb.amritsar";
  data.address = propAddress;
  return data;
}

export const setOwnerDetails = (data) => {
  const { address, owners } = data;
  let institution = {},
    owner = [];
  if (owners && owners.length > 0) {
    if (data?.ownershipCategory?.value === "INSTITUTIONALPRIVATE" || data?.ownershipCategory?.value === "INSTITUTIONALGOVERNMENT") {
      institution.designation = owners[0]?.designation;
      institution.name = owners[0]?.inistitutionName;
      institution.nameOfAuthorizedPerson = owners[0]?.name;
      institution.tenantId = address?.city?.code;
      institution.type = owners[0]?.inistitutetype?.value;
      owner.push({
        altContactNumber: owners[0]?.altContactNumber,
        correspondenceAddress: owners[0]?.permanentAddress,
        designation: owners[0]?.designation,
        emailId: owners[0]?.emailId,
        isCorrespondenceAddress: owners[0]?.isCorrespondenceAddress,
        mobileNumber: owners[0]?.mobileNumber,
        name: owners[0]?.name,
        ownerType: owners[0]?.ownerType?.code || "NONE",
      });
      data.institution = institution;
      data.owners = owner;
    } else {
      owners.map((ownr) => {
        let document = [];
        if (ownr?.ownerType?.code != "NONE") {
          document.push({
            fileStoreId: ownr.documents["specialProofIdentity"].fileStoreId || "",
            documentType: ownr.documents["specialProofIdentity"].documentType || "",
          });
        }
        owner.push({
          emailId: ownr?.emailId,
          fatherOrHusbandName: ownr?.fatherOrHusbandName,
          gender: ownr?.gender?.value,
          isCorrespondenceAddress: ownr?.isCorrespondenceAddress,
          mobileNumber: ownr?.mobileNumber,
          name: ownr?.name,
          ownerType: ownr?.ownerType?.code || "NONE",
          permanentAddress: ownr?.permanentAddress,
          relationship: ownr?.relationship?.code,
          documents: document,
        });
      });
      data.owners = owner;
    }
  }
  return data;
};

export const setDocumentDetails = (data) => {
  const { address, owners } = data;
  let documents = [];
  documents.push({
    fileStoreId: address?.documents["ProofOfAddress"]?.fileStoreId || "",
    documentType: address?.documents["ProofOfAddress"]?.documentType || "",
  });
  owners && documents.push({
    fileStoreId: owners[owners.length - 1]?.documents["proofIdentity"]?.fileStoreId || "",
    documentType: owners[owners.length - 1]?.documents["proofIdentity"]?.documentType || "",
  });
  data.documents = documents;
  return data;
};

const getUsageType = (data) => {
  if (data?.isResdential?.code == "RESIDENTIAL") {
    return data?.isResdential?.code;
  } else {
    return data?.usageCategoryMajor?.code;
  }
}

export const setPropertyDetails = (data) => {

  let propertyDetails = {}
  if (data?.PropertyType?.code?.includes('VACANT')) {
    propertyDetails = {
      units: [],
      landArea: data?.landarea?.floorarea,
      propertyType: data?.PropertyType?.code,
      noOfFloors: 0,
      usageCategory: getUsageType(data),
    }
  } else if (data?.PropertyType?.code?.includes('SHAREDPROPERTY')) {
    /*  update this case tulika*/
    propertyDetails = {
      units: [
        {
          occupancyType: "SELFOCCUPIED",
          floorNo: "0",
          constructionDetail: {
            builtUpArea: 16.67,
          },
          tenantId: data.tenantId,
          usageCategory: "RESIDENTIAL",
        },
      ],
      landArea: "2000",
      propertyType: data?.PropertyType?.code,
      noOfFloors: 1,
      superBuiltUpArea: 16.67,
      usageCategory: getUsageType(data),
    }

  } else if (data?.PropertyType?.code?.includes('INDEPENDENTPROPERTY')) {
    /*  update this case tulika*/
    propertyDetails = {
      units: [
        {
          occupancyType: "SELFOCCUPIED",
          floorNo: "0",
          constructionDetail: {
            builtUpArea: 16.67,
          },
          tenantId: data.tenantId,
          usageCategory: "RESIDENTIAL",
        },
      ],
      landArea: "2000",
      propertyType: data?.PropertyType?.code,
      noOfFloors: 1,
      superBuiltUpArea: 16.67,
      usageCategory: getUsageType(data),
    }

  } else {

    propertyDetails = {
      units: [
        {
          occupancyType: "SELFOCCUPIED",
          floorNo: "0",
          constructionDetail: {
            builtUpArea: 16.67,
          },
          tenantId: data.tenantId,
          usageCategory: "RESIDENTIAL",
        },
      ],
      landArea: "2000",
      propertyType: data?.PropertyType?.code,
      noOfFloors: 1,
      superBuiltUpArea: 16.67,
      usageCategory: getUsageType(data),
    }

  }

  data.propertyDetails = propertyDetails;
  return data;
}

/*   method to convert collected details to proeprty create object */
export const convertToProperty = (data = {}) => {
  console.info("propertyFormData", data);


  data = setDocumentDetails(data);
  data = setOwnerDetails(data);
  data = setAddressDetails(data);
  data = setPropertyDetails(data);


  const formdata = {
    Property: {
      tenantId: data.tenantId,
      address: data.address,

      ownershipCategory: data?.ownershipCategory?.value,
      owners: data.owners,
      institution: data.institution || null,

      documents: data.documents || [],
      ...data.propertyDetails,

      additionalDetails: {
        inflammable: false,
        heightAbove36Feet: false,
      },

      creationReason: "CREATE",
      source: "MUNICIPAL_RECORDS",
      channel: "CFC_COUNTER"

    },
  };
  console.info("propertyCreated", formdata)
  return formdata;
};

/*   method to check value  if not returns NA*/
export const checkForNA = (value = "") => {
  return checkForNotNull(value) ? value : "PT_NA";
};

/*   method to check value  if not returns NA*/
export const isPropertyVacant = (value = "") => {
  return checkForNotNull(value) && value.includes("VACANT") ? true : false;
};

/*   method to check value equal to flat / part of building if not returns NA  */
export const isPropertyFlatorPartofBuilding = (value = "") => {
  return checkForNotNull(value) && value.includes("SHAREDPROPERTY") ? true : false;
};

export const isPropertyIndependent = (value = "") => {
  return checkForNotNull(value) && value.includes("INDEPENDENT") ? true : false;
};

export const isthere1Basement = (value = "") => {
  return checkForNotNull(value) && value.includes("1") ? true : false;
};

export const isthere2Basement = (value = "") => {
  return checkForNotNull(value) && value.includes("2") ? true : false;
};

export const isPropertyselfoccupied = (value = "") => {
  return checkForNotNull(value) && value.includes("Self") ? true : false;
};

export const ispropertyunoccupied = (value = "") => {
  return checkForNotNull(value) && value.includes("Yes") ? true : false;
};
/*   method to get required format from fielstore url*/
export const pdfDownloadLink = (documents = {}, fileStoreId = "", format = "") => {
  /* Need to enhance this util to return required format*/

  let downloadLink = documents[fileStoreId] || "";
  let differentFormats = downloadLink?.split(",") || [];
  let fileURL = "";
  differentFormats.length > 0 &&
    differentFormats.map((link) => {
      if (!link.includes("large") && !link.includes("medium") && !link.includes("small")) {
        fileURL = link;
      }
    });
  return fileURL;
};

/*   method to get filename  from fielstore url*/
export const pdfDocumentName = (documentLink = "", index = 0) => {
  let documentName = decodeURIComponent(documentLink.split("?")[0].split("/").pop().slice(13)) || `Document - ${index + 1}`;
  return documentName;
};

/* methid to get date from epoch */
export const convertEpochToDate = (dateEpoch) => {
  // Returning null in else case because new Date(null) returns initial date from calender
  if (dateEpoch) {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  } else {
    return null;
  }
};
