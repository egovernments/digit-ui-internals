import { pdfDocumentName, pdfDownloadLink } from "./index";

const capitalize = (text) => text.substr(0, 1).toUpperCase() + text.substr(1);
const ulbCamel = (ulb) => ulb.toLowerCase().split(" ").map(capitalize).join(" ");

const getOwner = (application, t) => {
  application.owners = application?.tradeLicenseDetail?.owners?.filter((owner) => owner.status == "ACTIVE") || [];
  if (application?.tradeLicenseDetail?.subOwnerShipCategory == "INDIVIDUAL.SINGLEOWNER") {
    return {
      title: t("TL_COMMON_OWN_DETAILS"),
      values: [
        { title: t("TL_LOCALIZATION_OWNER_NAME"), value: application?.tradeLicenseDetail.owners[0]?.name || "N/A" },
        { title: t("TL_LOCALIZATION_OWNER_MOBILE"), value: application?.tradeLicenseDetail.owners[0]?.mobileNumber || "N/A" },
        { title: t("TL_NEW_OWNER_DETAILS_GENDER_LABEL"), value: t(application?.tradeLicenseDetail.owners[0]?.gender) || "N/A" },
      ],
    };
  } else if (application?.ownershipCategory.includes("INDIVIDUAL")) {
    let values = [];
    application?.tradeLicenseDetail.owners.map((owner) => {
      let doc = [
        { title: t("TL_LOCALIZATION_OWNER_NAME"), value: owner?.name || "N/A" },
        { title: t("TL_LOCALIZATION_OWNER_MOBILE"), value: owner?.mobileNumber || "N/A" },
        { title: t("TL_NEW_OWNER_DETAILS_GENDER_LABEL"), value: t(owner?.gender) || "N/A" },
      ];
      values.push(...doc);
    });
    return {
      title: t("PT_OWNERSHIP_INFO_SUB_HEADER"),
      values: values,
    };
  }
};
const getTradeDetails = (application, t) => {
  return {
    title: t("TL_COMMON_TR_DETAILS"),
    values: [
      { title: t("TL_APPLICATION_TYPE"), value: application?.applicationType || "N/A" },
      { title: t("TL_NEW_TRADE_DETAILS_LIC_TYPE_LABEL"), value: application?.licenseType || "N/A" },
      { title: t("TL_COMMON_TABLE_COL_TRD_NAME"), value: application?.tradeName || "N/A" },
      {
        title: t("reports.tl.fromDate"),
        value: application?.validFrom ? Digit.DateUtils.ConvertTimestampToDate(application?.validFrom, "dd/MM/yyyy") : "N/A",
      },
      {
        title: t("reports.tl.toDate"),
        value: application?.validTo ? Digit.DateUtils.ConvertTimestampToDate(application?.validTo, "dd/MM/yyyy") : "N/A",
      },
      { title: t("TL_NEW_TRADE_DETAILS_STRUCT_TYPE_LABEL"), value: t(`TL_${application?.tradeLicenseDetail?.structureType}`) || "N/A" },
      { title: t("TL_NEW_TRADE_DETAILS_STRUCT_SUB_TYPE_LABEL"), value: t(`TL_${application?.tradeLicenseDetail?.subOwnerShipCategory}`) || "N/A" },
      {
        title: t("TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL"),
        value: Digit.DateUtils.ConvertTimestampToDate(application?.commencementDate, "dd/MM/yyyy") || "N/A",
      },
    ],
  };
};
const getAccesory = (application, t) => {
  let values = [];
  application.tradeLicenseDetail?.accessories?.map((application) => {
    let value = [
      { title: t("TL_REVIEWACCESSORY_TYPE_LABEL"), value: t(application?.accessoryCategory) || "N/A" },
      { title: t("TL_NEW_TRADE_ACCESSORY_COUNT_LABEL"), value: t(application?.count) || "N/A" },
      { title: t("TL_NEW_TRADE_ACCESSORY_UOM_LABEL"), value: t(application?.uom) || "N/A" },
      { title: t("TL_NEW_TRADE_ACCESSORY_UOMVALUE_LABEL"), value: t(application?.uomValue) || "N/A" },
    ];
    values.push(...value);
  });

  return {
    title: t(""),
    values: values,
  };
};
const getTrade = (application, t) => {
  let values = [];
  application.tradeLicenseDetail?.tradeUnits?.map((ele) => {
    let value = [
      { title: t("TL_NEW_TRADE_DETAILS_TRADE_CAT_LABEL"), value: t(`TRADELICENSE_TRADETYPE_${ele?.tradeType.split(".")[0]}`) || "N/A" },
      { title: t("TL_NEW_TRADE_DETAILS_TRADE_TYPE_LABEL"), value: t(`TRADELICENSE_TRADETYPE_${ele?.tradeType.split(".")[1]}`) || "N/A" },
      {
        title: t("TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_LABEL"),
        value:
          t(
            `TRADELICENSE_TRADETYPE_${ele?.tradeType.split(".")[0]}_${ele?.tradeType.split(".")[1]}_${ele?.tradeType
              .split(".")[2]
              .split("-")
              .join("_")}`
          ) || "N/A",
      },
    ];
    values.push(...value);
  });

  return {
    title: t(""),
    values: values,
  };
};

const getPTAcknowledgementData = async (application, tenantInfo, t) => {
  console.log(application);
  const filesArray = application?.tradeLicenseDetail?.applicationDocuments?.map((value) => value?.fileStoreId);
  let res;
  if (filesArray) {
    res = await Digit.UploadServices.Filefetch(filesArray, application?.tenantId.split(".")[0]);
  }
  return {
    t: t,
    tenantId: tenantInfo?.code,
    name: `${t(tenantInfo?.i18nKey)} ${ulbCamel(t(`ULBGRADE_${tenantInfo?.city?.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_")}`))}`,
    email: "",
    phoneNumber: "",
    details: [
      {
        title: t("NOC_TASK_DETAILS_HEADER"),
        values: [
          { title: t("TL_COMMON_TABLE_COL_LIC_NO"), value: application?.licenseNumber || "N/A" },
          { title: t("TL_COMMON_TABLE_COL_APP_NO"), value: application?.applicationNumber },
          {
            title: t("TL_COMMON_TABLE_COL_APP_DATE"),
            value: Digit.DateUtils.ConvertTimestampToDate(application?.applicationDate, "dd/MM/yyyy"),
          },
        ],
      },
      getOwner(application, t),
      getTradeDetails(application, t),
      getTrade(application, t),
      getAccesory(application, t),
      {
        title: t("TL_COMMON_DOCS"),
        values:
          application?.tradeLicenseDetail?.applicationDocuments?.length > 0
            ? application?.tradeLicenseDetail?.applicationDocuments.map((document, index) => {
                let documentLink = pdfDownloadLink(res?.data, document?.fileStoreId);
                return {
                  title: t(document?.documentType || "N/A"),
                  value: pdfDocumentName(documentLink, index) || "N/A",
                };
              })
            : [],
      },
    ],
  };
};

export default getPTAcknowledgementData;
