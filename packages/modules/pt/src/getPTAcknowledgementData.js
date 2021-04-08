import {
  getFixedFilename,
  getPropertyTypeLocale,
  getPropertyOwnerTypeLocale,
  getPropertyUsageTypeLocale,
  getPropertySubUsageTypeLocale,
  getPropertyOccupancyTypeLocale,
  getMohallaLocale,
} from "./utils";

const capitalize = (text) => text.substr(0, 1).toUpperCase() + text.substr(1);
const ulbCamel = (ulb) => ulb.toLowerCase().split(" ").map(capitalize).join(" ");

const getPTAcknowledgementData = (application, tenantInfo, t) => {
  return {
    t: t,
    tenantId: tenantInfo?.code,
    name: `${t(tenantInfo?.i18nKey)} ${ulbCamel(t(`ULBGRADE_${tenantInfo?.city?.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_")}`))}`,
    email: tenantInfo?.emailId,
    phoneNumber: tenantInfo?.contactNumber,
    heading: t("PT_ACKNOWLEDGEMENT"),
    details: [
      {
        title: t("CS_TITLE_APPLICATION_DETAILS"),
        values: [
          { title: t("PT_APPLICATION_NO"), value: application?.acknowldgementNumber },
          { title: t("PT_PROPERRTYID"), value: application?.propertyId },
          {
            title: t("CS_APPLICATION_DETAILS_APPLICATION_DATE"),
            value: Digit.DateUtils.ConvertTimestampToDate(application?.auditDetails?.createdTime, "dd/MM/yyyy"),
          },
        ],
      },
      {
        title: t("PT_OWNERSHIP_INFO_SUB_HEADER"),
        values: [
          { title: t("PT_OWNERSHIP_INFO_NAME"), value: application?.owners[0]?.name || "N/A" },
          { title: t("PT_OWNERSHIP_INFO_MOBILE_NO"), value: application?.owners[0]?.mobileNumber || "N/A" },
          { title: t("PT_SEARCHPROPERTY_TABEL_GUARDIANNAME"), value: application?.owners[0]?.fatherOrHusbandName || "N/A" },
          { title: t("PT_OWNERSHIP_INFO_GENDER"), value: application?.owners[0]?.gender || "N/A" },
          { title: t("PT_FORM3_OWNERSHIP_TYPE"), value: t(application?.ownershipCategory) || "N/A" },
          { title: t("PT_OWNERSHIP_INFO_EMAIL_ID"), value: application?.owners[0]?.emailId || "N/A" },
          { title: t("PT_OWNERSHIP_INFO_USER_CATEGORY"), value: t(getPropertyOwnerTypeLocale(application?.owners[0]?.ownerType)) || "N/A" },
          { title: t("PT_OWNERSHIP_INFO_CORR_ADDR"), value: application?.owners[0]?.permanentAddress || "N/A" },
        ],
      },
      {
        title: t("PT_ASSESMENT_INFO_SUB_HEADER"),
        values: [
          { title: t("PT_ASSESMENT_INFO_USAGE_TYPE"), value: t(getPropertyUsageTypeLocale(application?.usageCategory)) || "N/A" },
          { title: t("PT_ASSESMENT_INFO_TYPE_OF_BUILDING"), value: t(getPropertyTypeLocale(application?.propertyType)) || "N/A" },
          { title: t("PT_ASSESMENT_INFO_PLOT_SIZE"), value: t(application?.landArea) || "N/A" },
          { title: t("PT_ASSESMENT_INFO_NO_OF_FLOOR"), value: t(application?.noOfFloors) || "N/A" },
          { title: t("PT_ASSESSMENT_UNIT_USAGE_TYPE"), value: t(getPropertySubUsageTypeLocale(application?.usageCategory)) || "N/A" },
          { title: t("PT_ASSESMENT_INFO_OCCUPLANCY"), value: t(getPropertyOccupancyTypeLocale(application?.units[0]?.occupancyType)) || "N/A" },
          { title: t("PT_FORM2_BUILT_AREA"), value: t(application?.units[0]?.constructionDetail?.builtUpArea) || "N/A" },
          { title: t("PT_FORM2_TOTAL_ANNUAL_RENT"), value: t(application?.units[0]?.arv) || "N/A" },
        ],
      },
      {
        title: t("PT_PROPERTY_ADDRESS_SUB_HEADER"),
        values: [
          { title: t("PT_PROPERTY_ADDRESS_PINCODE"), value: application?.address?.pincode || "N/A" },
          { title: t("PT_PROPERTY_ADDRESS_CITY"), value: application?.address?.city || "N/A" },
          {
            title: t("PT_PROPERTY_ADDRESS_MOHALLA"),
            value: t(`${getMohallaLocale(application?.address?.locality?.code, application?.tenantId)}`) || "N/A",
          },
          { title: t("PT_PROPERTY_ADDRESS_STREET_NAME"), value: application?.address?.street || "N/A" },
          { title: t("PT_PROPERTY_ADDRESS_HOUSE_NO"), value: application?.address?.doorNo || "N/A" },
          { title: t("PT_PROPERTY_ADDRESS_LANDMARK"), value: application?.address?.landmark || "N/A" },
        ],
      },
      {
        title: t("PT_COMMON_DOCS"),
        values:
          application.documents.length > 0
            ? application.documents.map((document) => {
                return {
                  title: t(document?.documentType || "N/A"),
                  value: (document?.documentUid && getFixedFilename(document.documentUid)) || "N/A",
                };
              })
            : "NA",
      },
    ],
  };
};

export default getPTAcknowledgementData;
