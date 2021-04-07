/*   method to check not null  if not returns false*/
export const checkForNotNull = (value = "") => {
  return value && value != null && value != undefined && value != "" ? true : false;
};


export const convertDotValues = (value = "") => {
  return checkForNotNull(value) && (value.replaceAll && value.replaceAll('.', '_') || value.replace && value.replace('.', '_')) || 'NA';
}



export const convertToLocale = (value = "", key = "") => {
  let convertedValue = convertDotValues(value);
  if (convertedValue == 'NA') {
    return 'PT_NA';
  }
  return `${key}_${convertedValue}`;
}


export const getPropertyTypeLocale = (value = "") => {
  return convertToLocale(value, 'COMMON_PROPTYPE');
}


export const getPropertyUsageTypeLocale = (value = "") => {
  return convertToLocale(value, 'COMMON_PROPUSGTYPE');
}


export const getPropertySubUsageTypeLocale = (value = "") => {
  return convertToLocale(value, 'COMMON_PROPSUBUSGTYPE');
}
export const getPropertyOccupancyTypeLocale = (value = "") => {
  return convertToLocale(value, 'PROPERTYTAX_OCCUPANCYTYPE');
}


export const getMohallaLocale = (value = "", tenantId = "") => {
  let convertedValue = convertDotValues(tenantId);
  if (convertedValue == 'NA' || !checkForNotNull(value)) {
    return 'PT_NA';
  }
  convertedValue=convertedValue.toUpperCase();
  return convertToLocale(value, `${convertedValue}_REVENUE`);
}

export const getPropertyOwnerTypeLocale = (value = "") => {
  return convertToLocale(value, 'PROPERTYTAX_OWNERTYPE');
}


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

export const getIntistitutionDetails = (data) => {
  const { address, owners } = data;
  let institution = {}, owner = [];
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
        ownerType: ownr?.ownerType?.code || "NONE"
      })
      data.institution = institution;
      data.owners = owner;
    } else {
      owners.map(ownr => {
        owner.push({
          emailId: ownr?.emailId,
          fatherOrHusbandName: ownr?.fatherOrHusbandName,
          gender: ownr?.gender?.value,
          isCorrespondenceAddress: ownr?.isCorrespondenceAddress,
          mobileNumber: ownr?.mobileNumber,
          name: ownr?.name,
          ownerType: ownr?.ownerType?.code || "NONE",
          permanentAddress: ownr?.permanentAddress,
          relationship: ownr?.relationship?.code
        })
      })
      data.owners = owner;
    }
  }
  return data;
}

/*   method to convert collected details to proeprty create object */
export const convertToProperty = (data = {}) => {
  console.log("jag", data);
  const { address, owners } = data;
  const loc = address?.locality.code;
  data = getIntistitutionDetails(data);
  const formdata = {
    Property: {
      tenantId: address?.city?.code || "pb.amritsar",
      address: {
        pincode: address?.pincode,
        landmark: address?.landmark,
        city: address?.city?.name,
        doorNo: address?.doorNo,
        buildingName: "NA",
        locality: {
          //code: loc && loc.split("_").length == 4 ? loc.split("_")[3] : "NA",
          code: address?.locality?.code || "NA",
          area: address?.locality?.name,
        },
      },
      usageCategoryMinor: null,
      units: [
        {
          occupancyType: "SELFOCCUPIED",
          floorNo: "0",
          constructionDetail: {
            builtUpArea: 16.67,
          },
          tenantId: address?.city?.code,
          usageCategory: "RESIDENTIAL",
        },
      ],
      usageCategoryMajor: "RESIDENTIAL",
      landArea: "2000",
      propertyType: "BUILTUP.SHAREDPROPERTY",
      noOfFloors: 1,
      ownershipCategory: data?.ownershipCategory?.value,
      owners: data.owners,
      institution: data.institution || null,
      additionalDetails: {
        inflammable: false,
        heightAbove36Feet: false,
      },
      source: "MUNICIPAL_RECORDS",
      channel: "CFC_COUNTER",
      documents: [
        {
          documentType: "OWNER.ADDRESSPROOF.WATERBILL",
          fileStoreId: "19caf3fe-a98b-4207-94cd-d2092f9f78a2",
          documentUid: "file1.jpg",
        },
        {
          documentType: "OWNER.IDENTITYPROOF.PAN",
          fileStoreId: "985f53c5-f09f-4d17-8fa7-5593cf1de47a",
          documentUid: "file.jpg",
        },
        {
          documentType: "OWNER.REGISTRATIONPROOF.GIFTDEED",
          fileStoreId: "6aaf6f3e-21fb-4e4f-8c5b-2d98eeff2709",
          documentUid: "doc.pdf",
        },
        {
          documentType: "OWNER.USAGEPROOF.ELECTRICITYBILL",
          fileStoreId: "858cc6b5-969c-479d-a89a-91d7319e5b07",
          documentUid: "doc.pdf",
        },
        {
          documentType: "OWNER.CONSTRUCTIONPROOF.BPACERTIFICATE",
          fileStoreId: "044616b2-7556-4903-9908-941f03ac6a70",
          documentUid: "doc.pdf",
        },
      ],
      superBuiltUpArea: 16.67,
      usageCategory: "RESIDENTIAL",
      creationReason: "CREATE",
    },
  };
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
