import { TLService } from "../../elements/TL";

const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
  if (searcher == "") return str;
  while (str.includes(searcher)) {
    str = str.replace(searcher, replaceWith);
  }
  return str;
};


/* methid to get date from epoch */
const convertEpochToDate = (dateEpoch) => {
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

export const TLSearch = {
  all: async (tenantId, filters = {}) => {
    const response = await TLService.TLsearch({ tenantId, filters });
    return response;
  },
  application: async (tenantId, filters = {}) => {
    const response = await TLService.TLsearch({ tenantId, filters });
    return response.Licenses[0];
  },

  applicationDetails: async (t, tenantId, applicationNumber, userType) => {
    const filter = { applicationNumber };
    const response = await TLSearch.application(tenantId, filter);
    console.log(response, "from hookfrom hookfrom hookfrom hookfrom hookfrom hook");

    let employeeResponse = [];
    const tradedetails = {
      title: "TL_COMMON_TR_DETAILS",
      // asSectionHeader: true,
      values: [
        { title: "TL_FINANCIAL_YEAR_LABEL", value: response?.financialYear ? `FY${response?.financialYear}` : "NA" },
        { title: "TL_NEW_TRADE_DETAILS_LIC_TYPE_LABEL", value: response?.licenseType ? `TRADELICENSE_LICENSETYPE_${response?.licenseType}` : "NA" },
        { title: "TL_COMMON_TABLE_COL_TRD_NAME", value: response?.tradeName },
        { title: "TL_NEW_TRADE_DETAILS_STRUCT_TYPE_LABEL", value: response?.tradeLicenseDetail?.structureType ? `COMMON_MASTERS_STRUCTURETYPE_${response?.tradeLicenseDetail?.structureType?.split('.')[0]}` : "NA" },
        { title: "TL_NEW_TRADE_DETAILS_STRUCT_SUB_TYPE_LABEL", value: response?.tradeLicenseDetail?.structureType ? `COMMON_MASTERS_STRUCTURETYPE_${stringReplaceAll(response?.tradeLicenseDetail?.structureType, ".", "_")}` : "NA" },
        { title: "TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL", value: response?.commencementDate ? convertEpochToDate(response?.commencementDate) : "NA" },
        { title: "TL_NEW_GST_NUMBER_LABEL", value: response?.tradeLicenseDetail?.additionalDetail?.gstNo || "NA" },
        { title: "TL_NEW_OPERATIONAL_SQ_FT_AREA_LABEL", value: response?.tradeLicenseDetail?.operationalArea || "NA" },
        { title: "TL_NEW_NUMBER_OF_EMPLOYEES_LABEL", value: response?.tradeLicenseDetail?.noOfEmployees || "NA" },
      ],
    };

    const tradeUnits = {
      title: "TL_TRADE_UNITS_HEADER",
      additionalDetails: {
        units: response?.tradeLicenseDetail?.tradeUnits?.map((unit, index) => {
          let tradeSubType = stringReplaceAll(unit?.tradeType, ".", "_");
          tradeSubType = stringReplaceAll(tradeSubType, "-", "_");
          return {
            title: "TL_UNIT_HEADER",
            values: [
              { title: "TRADELICENSE_TRADECATEGORY_LABEL", value: unit?.tradeType ? `TRADELICENSE_TRADETYPE_${unit?.tradeType?.split('.')[0]}` : "NA" },
              { title: "TRADELICENSE_TRADETYPE_LABEL", value: unit?.tradeType ? `TRADELICENSE_TRADETYPE_${unit?.tradeType?.split('.')[1]}` : "NA" },
              { title: "TL_NEW_TRADE_SUB_TYPE_LABEL", value: tradeSubType ? `TRADELICENSE_TRADETYPE_${tradeSubType}` : "NA" },
              { title: "TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER", value: unit?.uom || "NA" },
              { title: "TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL", value: unit?.uomValue || "NA" },
            ],
          };
        })
      },
    };

    const accessories = {
      title: "TL_NEW_TRADE_DETAILS_HEADER_ACC",
      // asSectionHeader: true,
      additionalDetails: {
        accessories: response?.tradeLicenseDetail?.accessories?.map((unit, index) => {
          let accessoryCategory = "NA";
          if (unit?.accessoryCategory) {
            accessoryCategory = stringReplaceAll(unit?.accessoryCategory, ".", "_");
            accessoryCategory = `TRADELICENSE_ACCESSORIESCATEGORY_${stringReplaceAll(accessoryCategory, "-", "_")}`;
          }
          return {
            title: "TL_ACCESSORY_LABEL",
            values: [
              { title: "TL_NEW_TRADE_DETAILS_ACC_LABEL", value: accessoryCategory },
              { title: "TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER", value: unit?.uom || "NA" },
              { title: "TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL", value: unit?.uomValue || "NA" },
              { title: "TL_ACCESSORY_COUNT_LABEL", value: unit?.count || "NA" }
            ],
          };
        })
      },
    };

    const tradeAddress = {
      title: "TL_CHECK_ADDRESS",
      // asSectionHeader: true,
      values: [
        { title: "CORE_COMMON_PINCODE", value: response?.tradeLicenseDetail?.address?.pincode || "NA" },
        { title: "MYCITY_CODE_LABEL", value: response?.tradeLicenseDetail?.address?.city || "NA" },
        { title: "TL_LOCALIZATION_LOCALITY", value: response?.tradeLicenseDetail?.address?.locality?.name || "NA" },
        { title: "TL_LOCALIZATION_BUILDING_NO", value: response?.tradeLicenseDetail?.address?.doorNo || "NA" },
        { title: "TL_LOCALIZATION_STREET_NAME", value: response?.tradeLicenseDetail?.address?.street || "NA" }
      ],
    };

    const owners = {
      title: "ES_NEW_APPLICATION_OWNERSHIP_DETAILS",
      additionalDetails: {
        owners: response?.tradeLicenseDetail?.owners?.map((owner, index) => {
          let subOwnerShipCategory = response?.tradeLicenseDetail?.subOwnerShipCategory ? `COMMON_MASTERS_OWNERSHIPCATEGORY_${stringReplaceAll(response?.tradeLicenseDetail?.subOwnerShipCategory, ".", "_")}` : "NA";
          return {
            title: "TL_PAYMENT_PAID_BY_PLACEHOLDER",
            values: [
              { title: "TL_NEW_OWNER_DETAILS_OWNERSHIP_TYPE_LABEL", value: subOwnerShipCategory },
              { title: "TL_OWNER_S_NAME_LABEL", value: owner?.name || "NA" },
              { title: "TL_OWNER_S_MOBILE_NUM_LABEL", value: owner?.mobileNumber || "NA" },
              { title: "TL_GUARDIAN_S_NAME_LABEL", value: owner?.fatherOrHusbandName || "NA" },
              { title: "TL_RELATIONSHIP_WITH_GUARDIAN_LABEL", value: owner?.relationship || "NA" },
              { title: "TL_NEW_OWNER_DETAILS_GENDER_LABEL", value: owner?.gender || "NA" },
              { title: "TL_NEW_OWNER_DETAILS_EMAIL_LABEL", value: owner?.emailId || "NA" },
              { title: "TL_OWNER_SPECIAL_CATEGORY", value: owner?.ownerType ? `COMMON_MASTERS_OWNERTYPE_${owner?.ownerType}` : "NA" },
              { title: "TL_NEW_OWNER_DETAILS_ADDR_LABEL", value: owner?.permanentAddress || "NA" },
            ],
          };
        }),
        documents: [
          {
            title: "PT_COMMON_DOCS",
            values: response?.tradeLicenseDetail?.applicationDocuments?.map((document) => {
              return {
                title: `TL_NEW_${document?.documentType.replace(".", "_")}`,
                documentType: document?.documentType,
                documentUid: document?.documentUid,
                fileStoreId: document?.fileStoreId,
              };
            }),
          },
        ]
      },
    };

    response && employeeResponse.push(tradedetails);
    response?.tradeLicenseDetail?.tradeUnits && employeeResponse.push(tradeUnits);
    response?.tradeLicenseDetail?.accessories && employeeResponse.push(accessories);
    response && employeeResponse.push(tradeAddress);
    response?.tradeLicenseDetail?.owners && employeeResponse.push(owners);

    return {
      tenantId: response.tenantId,
      applicationDetails: employeeResponse,
      additionalDetails: response?.additionalDetails,
      applicationData: response,
    };
  },
};