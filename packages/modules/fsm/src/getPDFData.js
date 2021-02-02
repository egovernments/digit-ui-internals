import { getPropertyTypeLocale, getPropertySubtypeLocale } from "./utils";

const capitalize = (text) => text.substr(0, 1).toUpperCase() + text.substr(1);
const ulbCamel = (ulb) => ulb.toLowerCase().split(" ").map(capitalize).join(" ");

function getBase64Image(logoId) {
  const img = document.getElementById(logoId);
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/png");
}

// TODO: add localization
const getPDFData = (application, tenantInfo, t) => {
  return {
    t: t,
    logo: getBase64Image("pdf-logo"),
    // logo:
    //   "data:image/jpeg;base64,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",
    name: `${t(tenantInfo.i18nKey)} ${ulbCamel(t("ULBGRADE_MUNICIPAL_CORPORATION"))}`,
    email: tenantInfo.emailId,
    phoneNumber: tenantInfo.contactNumber,
    heading: "PDF_HEADER_DESLUDGING_REQUEST_ACKNOWLEDGEMENT",
    details: [
      {
        title: t("CS_TITLE_APPLICATION_DETAILS"),
        values: [
          { title: t("CS_MY_APPLICATION_APPLICATION_NO"), value: application.applicationNo },
          {
            title: t("CS_APPLICATION_DETAILS_APPLICATION_DATE"),
            value: Digit.DateUtils.ConvertTimestampToDate(application.auditDetails.createdTime, "dd/MM/yyyy"),
          },
          { title: t("CS_APPLICATION_DETAILS_APPLICATION_CHANNEL"), value: application.source || "NA" },
        ],
      },
      {
        title: t("CS_APPLICATION_DETAILS_APPLICANT_DETAILS"),
        values: [
          { title: t("CS_APPLICATION_DETAILS_APPLICANT_NAME"), value: application.citizen.name || "NA" },
          { title: t("CS_APPLICATION_DETAILS_APPLICANT_MOBILE"), value: application.citizen.mobileNumber || "NA" },
        ],
      },
      {
        title: t("CS_APPLICATION_DETAILS_PROPERTY_DETAILS"),
        values: [
          { title: t("CS_APPLICATION_DETAILS_PROPERTY_TYPE"), value: t(getPropertyTypeLocale(application.propertyUsage)) || "NA" },
          { title: t("CS_APPLICATION_DETAILS_PROPERTY_SUB_TYPE"), value: t(getPropertySubtypeLocale(application.propertyUsage)) || "NA" },
        ],
      },
      {
        title: t("CS_APPLICATION_DETAILS_PROPERTY_LOCATION_DETAILS"),
        values: [
          { title: t("CS_APPLICATION_DETAILS_PINCODE"), value: application.address.pincode || "NA" },
          { title: t("CS_APPLICATION_DETAILS_CITY"), value: application.address.city || "NA" },
          { title: t("CS_APPLICATION_DETAILS_MOHALLA"), value: application.address.locality.name || "NA" },
          { title: t("CS_APPLICATION_DETAILS_STREET"), value: application.address.street || "NA" },
          { title: t("CS_APPLICATION_DETAILS_BUILDING"), value: application.address.buildingName || "NA" },
          { title: t("CS_APPLICATION_DETAILS_LANDMARK"), value: application.address.landmark || "NA" },
        ],
      },
      {
        title: t("CS_APPLICATION_DETAILS_PIT_DETAILS"),
        values: [
          {
            title: t("CS_APPLICATION_DETAILS_PIT_TYPE"),
            value: application.sanitationtype ? t("PITTYPE_MASTERS_" + application.sanitationtype) : "NA",
          },
          {
            title: t("CS_APPLICATION_DETAILS_DIMENSION"),
            value: application.pitDetail.height
              ? application.pitDetail.length
                ? `${application.pitDetail.length}m * ${application.pitDetail.width}m * ${application.pitDetail.height}m`
                : `${application.pitDetail.diameter}m * ${application.pitDetail.height}m`
              : "NA",
          },
          {
            title: t("CS_APPLICATION_DETAILS_DISTANCE_FROM_ROAD"),
            value: application?.pitDetail?.distanceFromRoad !== 0 ? `${application.pitDetail.distanceFromRoad}m` : "NA",
          },
          { title: t("CS_APPLICATION_DETAILS_TRIPS"), value: application?.noOfTrips || "NA" },
          { title: t("CS_APPLICATION_DETAILS_AMOUNT_PER_TRIP"), value: application?.noOfTrips === 0 ? "NA" : `₹ ${application.noOfTrips}` },
          {
            title: t("CS_APPLICATION_DETAILS_AMOUNT_DUE"),
            value: application?.amountDue && application?.amountDue !== 0 ? `₹ ${application.amountDue}` : "NA",
          },
        ],
      },
    ],
  };
};

export default getPDFData;
