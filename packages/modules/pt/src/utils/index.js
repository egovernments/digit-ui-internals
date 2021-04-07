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

/*   method to convert collected details to proeprty create object */
export const convertToProperty = (data = {}) => {
  console.log("jag", data);
  const { address, owners } = data;
  const loc = address?.locality.code;
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
      ownershipCategory: "INDIVIDUAL.SINGLEOWNER",
      owners: (owners &&
        owners.map((owners, index) => ({
          name: owners?.name || "Ajit",
          mobileNumber: owners?.mobileNumber || "9965664222",
          fatherOrHusbandName: owners?.fatherOrHusbandName,
          emailId: null,
          permanentAddress: owners?.permanentAddress,
          relationship: owners?.relationship?.code,
          ownerType: owners?.ownerType?.code || "NONE",
          gender: owners?.gender?.value,
          isCorrespondenceAddress: null,
        }))) || [
          {
            name: "Jagan",
            mobileNumber: "9965664222",
            fatherOrHusbandName: "E",
            emailId: null,
            permanentAddress: "1111, 1111, Back Side 33 KVA Grid Patiala Road - Area1, Amritsar, ",
            relationship: "FATHER",
            ownerType: "FREEDOMFIGHTER",
            gender: "MALE",
            isCorrespondenceAddress: null,
          },
        ],
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
