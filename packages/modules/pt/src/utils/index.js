export const getPropertyTypeLocale = (value) => {
  return `PROPERTYTYPE_MASTERS_${value?.split(".")[0]}`;
};

export const getPropertySubtypeLocale = (value) => `PROPERTYTYPE_MASTERS_${value}`;

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
  console.log('jag', data)
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
          code: loc && loc.split("_").length == 4 ? loc.split("_")[3] : "NA",
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


/*   method to check not null  if not returns false*/
export const checkForNotNull = (value = "") => {
  return value && value != null && value != undefined && value != '' ? true : false;
}

/*   method to check value  if not returns NA*/
export const checkForNA = (value = "") => {
  return checkForNotNull(value) ? value : 'PT_NA';
}

/*   method to check value  if not returns NA*/
export const isPropertyVacant = (value = "") => {
  return checkForNotNull(value) && value.includes('VACANT') ? true : false;
}

