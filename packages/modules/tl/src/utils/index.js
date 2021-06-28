/*   method to check not null  if not returns false*/
export const checkForNotNull = (value = "") => {
  return value && value != null && value != undefined && value != "" ? true : false;
};

export const convertDotValues = (value = "") => {
  return (
    (checkForNotNull(value) && ((value.replaceAll && value.replaceAll(".", "_")) || (value.replace && stringReplaceAll(value, ".", "_")))) || "NA"
  );
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

export const getCityLocale = (value = "") => {
  let convertedValue = convertDotValues(value);
  if (convertedValue == "NA" || !checkForNotNull(value)) {
    return "PT_NA";
  }
  convertedValue = convertedValue.toUpperCase();
  return convertToLocale(convertedValue, `TENANT_TENANTS`);
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
    ...address,
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

  data.address = propAddress;
  return data;
};

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
      let document = [];
      if (owners[0]?.documents["proofIdentity"]?.fileStoreId) {
        document.push({
          fileStoreId: owners[0]?.documents["proofIdentity"]?.fileStoreId || "",
          documentType: owners[0]?.documents["proofIdentity"]?.documentType?.code || "",
        });
      }
      owner.push({
        altContactNumber: owners[0]?.altContactNumber,
        correspondenceAddress: owners[0]?.permanentAddress,
        designation: owners[0]?.designation,
        emailId: owners[0]?.emailId,
        isCorrespondenceAddress: owners[0]?.isCorrespondenceAddress,
        mobileNumber: owners[0]?.mobileNumber,
        name: owners[0]?.name,
        ownerType: owners[0]?.ownerType?.code || "NONE",
        documents: document,
      });
      data.institution = institution;
      data.owners = owner;
    } else {
      owners.map((ownr) => {
        let document = [];
        if (ownr?.ownerType?.code != "NONE") {
          document.push({
            fileStoreId: ownr?.documents["specialProofIdentity"]?.fileStoreId || "",
            documentType: ownr?.documents["specialProofIdentity"]?.documentType?.code || "",
          });
        }
        if (ownr?.documents["proofIdentity"]?.fileStoreId) {
          document.push({
            fileStoreId: ownr?.documents["proofIdentity"]?.fileStoreId || "",
            documentType: ownr?.documents["proofIdentity"]?.documentType?.code || "",
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
  if (address?.documents["ProofOfAddress"]?.id) {
    documents.push({
      fileStoreId: address?.documents["ProofOfAddress"]?.fileStoreId || "",
      documentType: address?.documents["ProofOfAddress"]?.documentType?.code || "",
      id: address?.documents["ProofOfAddress"]?.id || "",
      status: address?.documents["ProofOfAddress"]?.status || "",
    });
  } else {
    documents.push({
      fileStoreId: address?.documents["ProofOfAddress"]?.fileStoreId || "",
      documentType: address?.documents["ProofOfAddress"]?.documentType?.code || "",
    });
  }

  owners &&
    owners.length > 0 &&
    owners.map((owner) => {
      if (owner.documents && owner.documents["proofIdentity"]) {
        if (owner?.documents["proofIdentity"]?.id) {
          documents.push({
            fileStoreId: owner?.documents["proofIdentity"].fileStoreId || "",
            documentType: owner?.documents["proofIdentity"].documentType?.code || "",
            id: owner?.documents["proofIdentity"]?.id || "",
            status: owner?.documents["proofIdentity"]?.status || "",
          });
        } else {
          documents.push({
            fileStoreId: owner?.documents["proofIdentity"].fileStoreId || "",
            documentType: owner?.documents["proofIdentity"].documentType?.code || "",
          });
        }
      }
      if (owner.documents && owner.documents["specialProofIdentity"]) {
        if (owner?.documents["specialProofIdentity"]?.id) {
          documents.push({
            fileStoreId: owner?.documents["specialProofIdentity"]?.fileStoreId || "",
            documentType: owner?.documents["specialProofIdentity"]?.documentType?.code || "",
            id: owner?.documents["specialProofIdentity"]?.id || "",
            status: owner?.documents["specialProofIdentity"]?.status || "",
          });
        } else {
          documents.push({
            fileStoreId: owner?.documents["specialProofIdentity"]?.fileStoreId || "",
            documentType: owner?.documents["specialProofIdentity"]?.documentType?.code || "",
          });
        }
      }
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
};

const getFloorNumber = (data) => {
  let floorcode = data?.Floorno?.i18nKey;
  if (floorcode.charAt(floorcode.length - 3) === "_" && floorcode.charAt(floorcode.length - 2) === "_") {
    return "-" + floorcode.charAt(floorcode.length - 1);
  } else {
    if (floorcode.charAt(floorcode.length - 2) !== "_") {
      return floorcode.charAt(floorcode.length - 2) + floorcode.charAt(floorcode.length - 1);
    } else {
      return floorcode.charAt(floorcode.length - 1);
    }
  }
};

export const getSuperBuiltUparea = (data) => {
  let builtUpArea;
  if (data?.selfOccupied?.i18nKey === "PT_YES_IT_IS_SELFOCCUPIED") {
    builtUpArea = parseInt(data?.floordetails?.builtUpArea);
  } else {
    if (data?.selfOccupied?.i18nKey === "PT_PARTIALLY_RENTED_OUT") {
      builtUpArea = parseInt(data?.landarea?.floorarea) + parseInt(data?.Constructiondetails?.RentArea);
    } else {
      builtUpArea = parseInt(data?.Constructiondetails?.RentArea);
    }
    if (data?.IsAnyPartOfThisFloorUnOccupied.i18nKey === "PT_COMMON_YES") {
      builtUpArea = builtUpArea + parseInt(data?.UnOccupiedArea?.UnOccupiedArea);
    }
  }
  return builtUpArea;
};

export const getnumberoffloors = (data) => {
  let unitlenght = data?.units?.length;
  if (data?.noOofBasements?.i18nKey === "PT_ONE_BASEMENT_OPTION") {
    return parseInt(unitlenght) + 1;
  } else if (data?.noOofBasements?.i18nKey === "PT_TWO_BASEMENT_OPTION") {
    return parseInt(unitlenght) + 2;
  }
  return parseInt(unitlenght);
};

export const getusageCategory = (data, i) => {
  if (data?.isResdential?.i18nKey === "PT_COMMON_YES") {
    return data?.isResdential?.code;
  } else if (data?.usageCategoryMajor?.code === "NONRESIDENTIAL.OTHERS") {
    return data?.isResdential?.code;
  } else {
    if (data?.PropertyType?.code?.includes("INDEPENDENTPROPERTY")) {
      if (data?.units[i]?.selfOccupied?.i18nKey === "PT_YES_IT_IS_SELFOCCUPIED") {
        return data?.units[i]?.subuagecode;
      } else {
        return data?.units[i]?.Subusagetypeofrentedareacode;
      }
    } else {
      if (data?.selfOccupied?.i18nKey === "PT_YES_IT_IS_SELFOCCUPIED") {
        return data?.subusagetype?.subuagecode;
      } else {
        return data?.Subusagetypeofrentedarea?.Subusagetypeofrentedareacode;
      }
    }
  }
};

export const getunits = (data) => {
  let unit = [];
  if (data?.selfOccupied?.i18nKey === "PT_YES_IT_IS_SELFOCCUPIED" && data?.IsAnyPartOfThisFloorUnOccupied.i18nKey === "PT_COMMON_YES") {
    unit.push({
      occupancyType: data?.selfOccupied?.code,
      floorNo: getFloorNumber(data),
      constructionDetail: {
        builtUpArea: parseInt(data?.floordetails?.builtUpArea) - parseInt(data?.UnOccupiedArea?.UnOccupiedArea),
      },
      tenantId: data.tenantId,
      usageCategory: getusageCategory(data),
    });
    unit.push({
      occupancyType: data?.IsAnyPartOfThisFloorUnOccupied?.code,
      floorNo: getFloorNumber(data),
      constructionDetail: {
        builtUpArea: parseInt(data?.UnOccupiedArea?.UnOccupiedArea),
      },
      tenantId: data.tenantId,
      usageCategory: getusageCategory(data),
    });
  } else if (data?.selfOccupied?.i18nKey === "PT_YES_IT_IS_SELFOCCUPIED" && data?.IsAnyPartOfThisFloorUnOccupied.i18nKey !== "PT_COMMON_YES") {
    unit.push({
      occupancyType: data?.selfOccupied?.code,
      floorNo: getFloorNumber(data),
      constructionDetail: {
        builtUpArea: parseInt(data?.floordetails?.builtUpArea),
      },
      tenantId: data.tenantId,
      usageCategory: getusageCategory(data),
    });
  } else {
    if (data?.selfOccupied?.i18nKey === "PT_PARTIALLY_RENTED_OUT") {
      unit.push({
        occupancyType: "SELFOCCUPIED",
        floorNo: getFloorNumber(data),
        constructionDetail: {
          builtUpArea: parseInt(data?.landarea?.floorarea),
        },
        tenantId: data.tenantId,
        usageCategory:
          data?.isResdential?.i18nKey === "PT_COMMON_YES" || data?.usageCategoryMajor?.code === "NONRESIDENTIAL.OTHERS"
            ? data?.isResdential?.code
            : data?.subusagetype?.subuagecode,
      });
    }
    unit.push({
      occupancyType: data?.selfOccupied?.code,
      arv: data?.Constructiondetails?.AnnualRent,
      floorNo: getFloorNumber(data),
      constructionDetail: {
        builtUpArea: parseInt(data?.Constructiondetails?.RentArea),
      },
      tenantId: data.tenantId,
      usageCategory: getusageCategory(data),
    });
    if (data?.IsAnyPartOfThisFloorUnOccupied.i18nKey === "PT_COMMON_YES") {
      unit.push({
        occupancyType: data?.IsAnyPartOfThisFloorUnOccupied?.code,
        floorNo: getFloorNumber(data),
        constructionDetail: {
          builtUpArea: parseInt(data?.UnOccupiedArea?.UnOccupiedArea),
        },
        tenantId: data.tenantId,
        usageCategory: getusageCategory(data),
      });
    }
  }
  data?.extraunitFPB ? (unit = unit.concat(data?.extraunitFPB)) : "";
  return unit;
};

export const getunitarray = (i, unitsdata, unit, data) => {
  if (unitsdata[i].active === true) {
    unit.push(unitsdata[i]);
  } else if (
    unitsdata[i].selfOccupied?.i18nKey === "PT_YES_IT_IS_SELFOCCUPIED" &&
    unitsdata[i].IsAnyPartOfThisFloorUnOccupied?.i18nKey === "PT_COMMON_YES"
  ) {
    unit.push({
      occupancyType: unitsdata[i].selfOccupied?.code,
      floorNo: i === "-1" ? "-1" : i === "-2" ? "-2" : i,
      constructionDetail: {
        builtUpArea: parseInt(unitsdata[i].builtUpArea) - parseInt(unitsdata[i].UnOccupiedArea),
      },
      tenantId: data.tenantId,
      usageCategory: getusageCategory(data, i),
    });
    unit.push({
      occupancyType: unitsdata[i]?.IsAnyPartOfThisFloorUnOccupied?.code,
      floorNo: i === "-1" ? "-1" : i === "-2" ? "-2" : i,
      constructionDetail: {
        builtUpArea: parseInt(unitsdata[i]?.UnOccupiedArea),
      },
      tenantId: data.tenantId,
      usageCategory: getusageCategory(data, i),
    });
  } else if (
    unitsdata[i]?.selfOccupied?.i18nKey === "PT_YES_IT_IS_SELFOCCUPIED" &&
    unitsdata[i]?.IsAnyPartOfThisFloorUnOccupied.i18nKey !== "PT_COMMON_YES"
  ) {
    unit.push({
      occupancyType: unitsdata[i].selfOccupied?.code,
      floorNo: i === "-1" ? "-1" : i === "-2" ? "-2" : i,
      constructionDetail: {
        builtUpArea: parseInt(unitsdata[i]?.builtUpArea),
      },
      tenantId: data.tenantId,
      usageCategory: getusageCategory(data, i),
    });
  } else {
    if (unitsdata[i]?.selfOccupied?.i18nKey === "PT_PARTIALLY_RENTED_OUT") {
      unit.push({
        occupancyType: "SELFOCCUPIED",
        floorNo: i === "-1" ? "-1" : i === "-2" ? "-2" : i,
        constructionDetail: {
          builtUpArea: parseInt(unitsdata[i]?.floorarea),
        },
        tenantId: data.tenantId,
        usageCategory:
          data?.isResdential?.i18nKey === "PT_COMMON_YES" || data?.usageCategoryMajor?.code === "NONRESIDENTIAL.OTHERS"
            ? data?.isResdential?.code
            : unitsdata[i].subuagecode,
      });
    }
    unit.push({
      occupancyType: unitsdata[i].selfOccupied?.code,
      arv: unitsdata[i].AnnualRent,
      floorNo: i === "-1" ? "-1" : i === "-2" ? "-2" : i,
      constructionDetail: {
        builtUpArea: parseInt(unitsdata[i]?.RentArea),
      },
      tenantId: data.tenantId,
      usageCategory: getusageCategory(data, i),
    });
    if (unitsdata[i]?.IsAnyPartOfThisFloorUnOccupied.i18nKey === "PT_COMMON_YES") {
      unit.push({
        occupancyType: unitsdata[i]?.IsAnyPartOfThisFloorUnOccupied?.code,
        floorNo: i === "-1" ? "-1" : i === "-2" ? "-2" : i,
        constructionDetail: {
          builtUpArea: parseInt(unitsdata[i]?.UnOccupiedArea),
        },
        tenantId: data.tenantId,
        usageCategory: getusageCategory(data, i),
      });
    }
  }
  return unit;
};

export const getunitsindependent = (data) => {
  let unit = [];
  let unitsdata = [];
  unitsdata = data?.units;

  let i;
  for (i = 0; i < unitsdata.length && unitsdata.length > 0; i++) {
    unit = getunitarray(i, unitsdata, unit, data);
  }
  if (isthere1Basement(data?.noOofBasements?.i18nKey) || isthere2Basement(data?.noOofBasements?.i18nKey)) {
    unit = getunitarray("-1", unitsdata, unit, data);
  }
  if (isthere2Basement(data?.noOofBasements?.i18nKey)) {
    unit = getunitarray("-2", unitsdata, unit, data);
  }
  return unit;
};

export const setPropertyDetails = (data) => {
  let unitleghtvalue = getnumberoffloors(data);
  let propertyDetails = {};
  if (data?.PropertyType?.code?.includes("VACANT")) {
    propertyDetails = {
      units: [],
      landArea: parseInt(data?.landarea?.floorarea),
      propertyType: data?.PropertyType?.code,
      noOfFloors: 0,
      usageCategory: getUsageType(data),
    };
  } else if (data?.PropertyType?.code?.includes("SHAREDPROPERTY")) {
    /*  update this case tulika*/
    propertyDetails = {
      units: getunits(data),
      landArea: data?.floordetails?.plotSize,
      propertyType: data?.PropertyType?.code,
      noOfFloors: 1,
      superBuiltUpArea: getSuperBuiltUparea(data),
      usageCategory: getUsageType(data),
    };
  } else if (data?.PropertyType?.code?.includes("INDEPENDENTPROPERTY")) {
    /*  update this case tulika*/
    let unitleghtvalue = getnumberoffloors(data);
    propertyDetails = {
      units: getunitsindependent(data),
      landArea: data?.units[0]?.plotSize,
      propertyType: data?.PropertyType?.code,
      noOfFloors: unitleghtvalue,
      superBuiltUpArea: null,
      usageCategory: getUsageType(data),
    };
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
    };
  }

  data.propertyDetails = propertyDetails;
  return data;
};

export const getownerarray = (data) => {
  let ownerarray = [];
  data?.owners.owners.map((ob) => {
    ownerarray.push({
      mobileNumber: ob.mobilenumber,
      name: ob.name,
      fatherOrHusbandName: "",
      relationship: "",
      dob: null,
      gender: ob.gender.code,
      permanentAddress: data?.owners?.permanentAddress,
    });
  });
  return ownerarray;
};

export const gettradeunits = (data) => {
  let tradeunits = [];
  data?.TradeDetails?.units.map((ob) => {
    tradeunits.push({ tradeType: ob.tradesubtype.code, uom: ob.unit, uomValue: ob.uom });
  });
  return tradeunits;
};

export const getaccessories = (data) => {
  let tradeaccessories = [];
  data?.TradeDetails?.accessories.map((ob) => {
    tradeaccessories.push({ uom: ob.unit, accessoryCategory: ob.accessory.code, uomValue: ob.uom, count: ob.accessorycount });
  });
  return tradeaccessories;
};

export const convertToTrade = (data = {}) => {
  console.info("tradeformdata", data);
  const formdata = {
    Licenses: [
      {
        action: "INITIATE",
        applicationType: "NEW",
        commencementDate: Date.parse(data?.TradeDetails?.CommencementDate),
        financialYear: "2021-22",
        licenseType: "PERMANENT",
        tenantId: data?.address?.city?.code,
        tradeLicenseDetail: {
          address: {
            city: data?.address?.city?.code,
            locality: {
              code: data?.address?.locality?.code,
            },
            tenantId: data?.tenantId,
            pincode: data?.address?.pincode,
            doorNo: data?.address?.doorNo,
            street: data?.address?.street,
            landmark: data?.address?.landmark,
          },
          applicationDocuments: null,
          accessories: data?.TradeDetails?.accessories ? getaccessories(data) : null,
          // owners: [
          //   {mobileNumber: "7878787878",
          //    name: "testg",
          //     fatherOrHusbandName: "DA",
          //      relationship: "FATHER",
          //      dob: 950380199000,
          //      gender: "MALE",
          //      permanentAddress: "VXF",
          // }
          // ],
          owners: getownerarray(data),
          structureType: data?.TradeDetails?.VehicleType ? data?.TradeDetails?.VehicleType.code : data?.TradeDetails?.BuildingType.code,
          subOwnerShipCategory: data?.ownershipCategory?.code,
          // tradeUnits:[
          //   {tradeType: "GOODS.MANUFACTURE.TST-18", uom: null, uomValue: null}
          // ],
          tradeUnits: gettradeunits(data),
        },
        tradeName: data?.TradeDetails?.TradeName,
        wfDocuments: [],
        applicationDocuments: [],
        workflowCode: "NewTL",
      },
    ],
  };

  console.info("TradeCreated", formdata);
  return formdata;
};

export const getwfdocuments = (data) => {
  let wfdoc = [];
  let doc = data ? data.owners.documents : [];
  doc && wfdoc.push({
    fileName:doc["OwnerPhotoProof"].name,
    fileStoreId:doc["OwnerPhotoProof"].fileStoreId,
    documentType:"OWNERPHOTO",
    tenantId:data?.tenantId,
  });
  doc && wfdoc.push({
    fileName:doc["ProofOfIdentity"].name,
    fileStoreId:doc["ProofOfIdentity"].fileStoreId,
    documentType:"OWNERIDPROOF",
    tenantId:data?.tenantId,
  });
  doc && wfdoc.push({
    fileName:doc["ProofOfOwnership"].name,
    fileStoreId:doc["ProofOfOwnership"].fileStoreId,
    documentType:"OWNERSHIPPROOF",
    tenantId:data?.tenantId,
  });
  return wfdoc;
}

export const convertToUpdateTrade = (data = {},datafromflow, tenantId) => {
  //datafromflow = JSON.parse(sessionStorage.getItem("TL-CREATE-FORMDATA"));
  console.log("data from create",data);
  console.log("datafromflow",datafromflow);
  let formdata1 = {
    Licenses: [
    ]
  }
  formdata1.Licenses[0] = {...data.Licenses[0],
  }
  formdata1.Licenses[0].action = "APPLY";
  formdata1.Licenses[0].wfDocuments =  getwfdocuments(datafromflow),
  formdata1.Licenses[0].tradeLicenseDetail.applicationDocuments = getwfdocuments(datafromflow),
  // let wfdoc = [];
  // let doc = datafromflow ? datafromflow.owners.documents : [];
  // doc && wfdoc.push({
  //   fileName:doc["OwnerPhotoProof"].name,
  //   fileStoreId:doc["OwnerPhotoProof"].fileStoreId,
  //   documentType:"OWNERPHOTO",
  //   tenantId:data.Licenses[0].tenantId,
  // });
  // doc && wfdoc.push({
  //   fileName:doc["ProofOfIdentity"].name,
  //   fileStoreId:doc["ProofOfIdentity"].fileStoreId,
  //   documentType:"OWNERIDPROOF",
  //   tenantId:data.Licenses[0].tenantId,
  // });
  // doc && wfdoc.push({
  //   fileName:doc["ProofOfOwnership"].name,
  //   fileStoreId:doc["ProofOfOwnership"].fileStoreId,
  //   documentType:"OWNERSHIPPROOF",
  //   tenantId:data.Licenses[0].tenantId,
  // });
  // formdata1.wfDocuments = wfdoc;
  console.info("formdata1",formdata1);
  return formdata1;
}

export const convertToEditTrade = (data) => {
  console.log("dataforedit",data);
  let formdata = {
    Licenses:[
      { 
        id:data?.id,
        tenantId:data?.tenantId,
        businessService:data?.businessService,
        licenseType:data?.licenseType,
        applicationType:"RENEWAL",
        workflowCode:"EDITRENEWAL",
        licenseNumber:data?.licenseNumber,
        applicationNumber:data?.applicationNumber,
        tradeName:data?.tradeName,
        applicationDate:data?.applicationDate,
        commencementDate:data?.commencementDate,
        issuedDate:data?.issuedDate,
        financialYear:data?.financialYear,
        validFrom:data?.validFrom,
        validTo:data?.validTo,
        action:"INITIATE",
        wfDocuments:[],
        status:data?.status,
        tradeLicenseDetail: {
          address: data.tradeLicenseDetail.address,
          applicationDocuments: data.tradeLicenseDetail.applicationDocuments,
          accessories: data?.TradeDetails?.accessories ? getaccessories(data) : null,
          owners: getownerarray(data),
          structureType: data?.TradeDetails?.VehicleType ? data?.TradeDetails?.VehicleType.code : data?.TradeDetails?.BuildingType.code,
          subOwnerShipCategory: data?.ownershipCategory?.code,
          tradeUnits: gettradeunits(data),
        },
        calculation:null,
        auditDetails:data?.auditDetails,    
      }
    ]
  }
  console.log("there",formdata);
  return formdata;
}

export const getTradeforEdit = (data) => {
  console.log(data);
}

export const setUpdateOwnerDetails = (data = []) => {
  const { institution, owners } = data;
  if (data?.ownershipCategory?.value === "INSTITUTIONALPRIVATE" || data?.ownershipCategory?.value === "INSTITUTIONALGOVERNMENT") {
    if (data?.ownershipCategory?.value === "INSTITUTIONALPRIVATE" || data?.ownershipCategory?.value === "INSTITUTIONALGOVERNMENT") {
      institution.designation = owners[0]?.designation;
      institution.name = owners[0]?.inistitutionName;
      institution.nameOfAuthorizedPerson = owners[0]?.name;
      institution.tenantId = data?.address?.city?.code;
      institution.type = owners[0]?.inistitutetype?.value;
      let document = [];
      if (owners[0]?.documents["proofIdentity"]?.fileStoreId && owners[0].documents["proofIdentity"].id) {
        document.push({
          fileStoreId: owners[0].documents["proofIdentity"].fileStoreId || "",
          documentType: owners[0].documents["proofIdentity"].documentType?.code || "",
          id: owners[0].documents["proofIdentity"].id || "",
          status: owners[0].documents["proofIdentity"].status || "",
        });
      } else {
        document.push({
          fileStoreId: owners[0].documents["proofIdentity"].fileStoreId || "",
          documentType: owners[0].documents["proofIdentity"].documentType?.code || "",
        });
      }
      data.owners.forEach((owner) => {
        owner.altContactNumber = owners[0]?.altContactNumber;
        owner.correspondenceAddress = owners[0]?.permanentAddress;
        owner.designation = owners[0]?.designation;
        owner.emailId = owners[0]?.emailId;
        owner.isCorrespondenceAddress = owners[0]?.isCorrespondenceAddress;
        owner.mobileNumber = owners[0]?.mobileNumber;
        owner.name = owners[0]?.name;
        owner.ownerType = owners[0]?.ownerType?.code || "NONE";
        owner.documents = document;
      });
      data.institution = institution;
    }
  } else {
    data.owners.forEach((owner) => {
      let document = [];
      if (owner?.ownerType?.code != "NONE") {
        if (owner.documents["specialProofIdentity"].id) {
          document.push({
            fileStoreId: owner.documents["specialProofIdentity"].fileStoreId || "",
            documentType: owner.documents["specialProofIdentity"].documentType?.code || "",
            id: owner.documents["specialProofIdentity"].id || "",
            status: owner.documents["specialProofIdentity"].status || "",
          });
        } else {
          document.push({
            fileStoreId: owner.documents["specialProofIdentity"].fileStoreId || "",
            documentType: owner.documents["specialProofIdentity"].documentType?.code || "",
          });
        }
      }
      if (owner?.documents["proofIdentity"]?.fileStoreId) {
        if (owner.documents["proofIdentity"].id) {
          document.push({
            fileStoreId: owner.documents["proofIdentity"].fileStoreId || "",
            documentType: owner.documents["proofIdentity"].documentType?.code || "",
            id: owner.documents["proofIdentity"].id || "",
            status: owner.documents["proofIdentity"].status || "",
          });
        } else {
          document.push({
            fileStoreId: owner.documents["proofIdentity"].fileStoreId || "",
            documentType: owner.documents["proofIdentity"].documentType?.code || "",
          });
        }
      }
      owner.gender = owner?.gender?.code;
      owner.ownerType = owner?.ownerType?.code;
      owner.relationship = owner?.relationship?.code;
      owner.documents = document;
    });
  }
  return data;
};
export const setUpdatedDocumentDetails = (data) => {
  const { address, owners } = data;
  let documents = [];
  if (address?.documents["ProofOfAddress"]?.id) {
    documents.push({
      fileStoreId: address?.documents["ProofOfAddress"]?.fileStoreId || "",
      documentType: address?.documents["ProofOfAddress"]?.documentType?.code || "",
      id: address?.documents["ProofOfAddress"]?.id || "",
      status: address?.documents["ProofOfAddress"]?.status || "",
    });
  } else {
    documents.push({
      fileStoreId: address?.documents["ProofOfAddress"]?.fileStoreId || "",
      documentType: address?.documents["ProofOfAddress"]?.documentType?.code || "",
    });
  }

  owners &&
    owners.length > 0 &&
    owners.map((owner) => {
      owner.documents.map((document) => {
        documents.push(document);
      });
    });
  data.documents = documents;
  return data;
};
export const convertToUpdateProperty = (data = {}) => {
  console.info("propertyFormData", data);
  let isResdential = data.isResdential;
  let propertyType = data.PropertyType;
  let selfOccupied = data.selfOccupied;
  let Subusagetypeofrentedarea = data.Subusagetypeofrentedarea || null;
  let subusagetype = data.subusagetype || null;
  let IsAnyPartOfThisFloorUnOccupied = data.IsAnyPartOfThisFloorUnOccupied || null;
  let builtUpArea = data?.floordetails?.builtUpArea || null;
  let noOfFloors = data?.noOfFloors;
  let noOofBasements = data?.noOofBasements;
  let unit = data?.units;
  let basement1 = Array.isArray(data?.units) && data?.units["-1"] ? data?.units["-1"] : null;
  let basement2 = Array.isArray(data?.units) && data?.units["-2"] ? data?.units["-2"] : null;
  data = setAddressDetails(data);
  data = setUpdateOwnerDetails(data);
  data = setUpdatedDocumentDetails(data);
  data = setPropertyDetails(data);

  const formdata = {
    Property: {
      id: data.id,
      accountId: data.accountId,
      acknowldgementNumber: data.acknowldgementNumber,
      propertyId: data.propertyId,
      status: data.status || "INWORKFLOW",
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
        isResdential: isResdential,
        propertyType: propertyType,
        selfOccupied: selfOccupied,
        Subusagetypeofrentedarea: Subusagetypeofrentedarea,
        subusagetype: subusagetype,
        IsAnyPartOfThisFloorUnOccupied: IsAnyPartOfThisFloorUnOccupied,
        builtUpArea: builtUpArea,
        noOfFloors: noOfFloors,
        noOofBasements: noOofBasements,
        unit: unit,
        basement1: basement1,
        basement2: basement2,
      },

      creationReason: getCreationReason(data),
      source: "MUNICIPAL_RECORDS",
      channel: "CITIZEN",
      workflow: getWorkflow(data),
    },
  };

  // let propertyInitialObject = JSON.parse(sessionStorage.getItem("propertyInitialObject"));
  // if (checkArrayLength(propertyInitialObject?.units) && checkIsAnArray(formdata.Property?.units) && data?.isEditProperty) {
  //   propertyInitialObject.units = propertyInitialObject.units.filter((unit) => unit.active);
  //   let oldUnits = propertyInitialObject.units.map((unit) => {
  //     return { ...unit, active: false };
  //   });
  //   formdata.Property?.units.push(...oldUnits);
  // }
  /* if (
    checkArrayLength(propertyInitialObject?.owners) &&
    checkIsAnArray(formdata.Property?.owners) &&
    data?.isEditProperty &&
    data.isUpdateProperty == false
  ) {
    propertyInitialObject.owners = propertyInitialObject.owners.filter((owner) => owner.status === "ACTIVE");
    let oldOwners = propertyInitialObject.owners.map((owner) => {
      return { ...owner, status: "INACTIVE" };
    });
    formdata.Property?.owners.push(...oldOwners);
  } else {
    formdata.Property.owners = [...propertyInitialObject.owners];
  } */

  // if (checkArrayLength(propertyInitialObject?.owners) && checkIsAnArray(formdata.Property?.owners)) {
  //   formdata.Property.owners = [...propertyInitialObject.owners];
  // }
  // if (propertyInitialObject?.auditDetails) {
  //   formdata.Property["auditDetails"] = { ...propertyInitialObject.auditDetails };
  // }
  // console.info("propertyUpdated", formdata);
  return formdata;
};

/*   method to check value  if not returns NA*/
export const checkForNA = (value = "") => {
  return checkForNotNull(value) ? value : "PT_NA";
};

export const getCommencementDataFormat = (date) => {
  let newDate = new Date(date).getFullYear().toString() +"-"+ (new Date(date).getMonth() + 1).toString()+"-" + new Date(date).getDate().toString()
  return newDate;
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
  return checkForNotNull(value) && value.includes("ONE") ? true : false;
};

export const isthere2Basement = (value = "") => {
  return checkForNotNull(value) && value.includes("TWO") ? true : false;
};

export const isPropertyselfoccupied = (value = "") => {
  return checkForNotNull(value) && value.includes("SELFOCCUPIED") ? true : false;
};

export const isPropertyPartiallyrented = (value = "") => {
  return checkForNotNull(value) && value.includes("PARTIALLY") ? true : false;
};

export const ispropertyunoccupied = (value = "") => {
  return checkForNotNull(value) && value.includes("YES") ? true : false;
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

export const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
  if (searcher == "") return str;
  while (str.includes(searcher)) {
    str = str.replace(searcher, replaceWith);
  }
  return str;
};

export const checkIsAnArray = (obj = []) => {
  return obj && Array.isArray(obj) ? true : false;
};
export const checkArrayLength = (obj = [], length = 0) => {
  return checkIsAnArray(obj) && obj.length > length ? true : false;
};

export const getWorkflow = (data = {}) => {
  return {
    action: data?.isEditProperty ? "REOPEN" : "OPEN",
    businessService: `PT.${getCreationReason(data)}`,
    moduleName: "PT",
  };
};

export const getCreationReason = (data = {}) => {
  return data?.isUpdateProperty ? "UPDATE" : "CREATE";
};
