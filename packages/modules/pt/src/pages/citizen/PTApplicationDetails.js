import { Card, CardSubHeader, Header, Loader, Row, StatusTable } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import PTWFApplicationTimeline from "../../pageComponents/PTWFApplicationTimeline";
import { getFixedFilename } from "../../utils";

const PTApplicationDetails = () => {
  const { t } = useTranslation();
  const { acknowledgementIds } = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { isLoading, isError, error, data } = Digit.Hooks.pt.usePropertySearch({
    tenantId,
    filters: { acknowledgementIds },
  });

  const application = data?.Properties[0];
  let unit = [];
  unit = application?.units;
  let owners = [];
  owners = application?.owners;
  let docs = [];
  docs = application?.documents;
  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <Header>{t("PT_MUTATION_APPLICATION_DETAILS")}</Header>
      <Card>
        <StatusTable>
          <Row label={t("PT_APPLICATION_NUMBER_LABEL")} text={application?.acknowldgementNumber} />
          <Row label={t("PT_SEARCHPROPERTY_TABEL_PTUID")} text={application?.propertyId} />
          <Row label={t("PT_APPLICATION_CHANNEL_LABEL")} text="online" />
        </StatusTable>
        <CardSubHeader>{t("PT_PROPERTY_ADDRESS_SUB_HEADER")}</CardSubHeader>
        <StatusTable>
          <Row label={t("PT_PROPERTY_ADDRESS_PINCODE")} text={`${t(application?.address?.pincode)}` || "NA"} />
          <Row label={t("PT_COMMON_CITY")} text={`${t(application?.address?.city)}` || "NA"} />
          <Row label={t("PT_COMMON_LOCALITY_OR_MOHALLA")} text={`${t(application?.address?.locality?.name)}` || "NA"} />
          <Row label={t("PT_PROPERTY_ADDRESS_STREET_NAME")} text={`${t(application?.address?.street)}` || "NA"} />
          <Row label={t("PT_PROPERTY_ADDRESS_COLONY_NAME")} text={`${t(application?.address?.buildingName)}` || "NA"} />
        </StatusTable>
        <CardSubHeader>{t("PT_PROPERTY_ASSESSMENT_DETAILS_HEADER")}</CardSubHeader>
        <StatusTable>
          <Row label={t("PT_ASSESMENT_INFO_USAGE_TYPE")} text={`${t(application?.usageCategory)}` || "NA"} />
          <Row label={t("PT_COMMON_PROPERTY_TYPE")} text={`${t(application?.propertyType.toLowerCase().split(".")[1])}` || "NA"} />
          <Row label={t("PT_ASSESMENT1_PLOT_SIZE")} text={`${t(application?.landArea)}` || "NA"} />
          <Row label={t("PT_ASSESMENT_INFO_NO_OF_FLOOR")} text={`${t(application?.noOfFloors)}` || "NA"} />
        </StatusTable>
        <CardSubHeader>{t("Ground Floor")}</CardSubHeader>
        <CardSubHeader>{t("Unit 1")}</CardSubHeader>
        <div style={{ border: "groove" }}>
          <StatusTable>
            <Row label={t("PT_ASSESSMENT_UNIT_USAGE_TYPE")} text={`${t(unit[0].usageCategory)}` || "NA"} />
            <Row label={t("PT_OCCUPANY_TYPE_LABEL")} text={`${t(unit[0].occupancyType)}` || "NA"} />
            <Row label={t("PT_BUILTUP_AREA_LABEL")} text={`${t(unit[0].constructionDetail?.builtUpArea)}` || "NA"} />
          </StatusTable>
        </div>
        <div>
          {unit.length > 1 &&
            unit.map((unit, index) => (
              <div key={index}>
                <CardSubHeader>
                  {index} {t("Floor")}
                </CardSubHeader>
                <CardSubHeader>{t("Unit 1")}</CardSubHeader>
                <StatusTable>
                  <Row label={t("PT_ASSESSMENT_UNIT_USAGE_TYPE")} text={`${t(unit?.usageCategory)}` || "NA"} />
                  <Row label={t("PT_OCCUPANY_TYPE_LABEL")} text={`${t(unit?.occupancyType)}` || "NA"} />
                  <Row label={t("PT_BUILTUP_AREA_LABEL")} text={`${t(unit?.constructionDetail?.builtUpArea)}` || "NA"} />
                </StatusTable>
              </div>
            ))}
        </div>
        <CardSubHeader>{t("PT_COMMON_PROPERTY_OWNERSHIP_DETAILS_HEADER")}</CardSubHeader>
        <div>
          {owners.map((owners, index) => (
            <div key={index}>
              <CardSubHeader>
                {t("PT_OWNER_SUB_HEADER")} - {index + 1}
              </CardSubHeader>
              <StatusTable>
                <Row label={t("PT_COMMON_APPLICANT_NAME_LABEL")} text={`${t(owners?.name)}` || "NA"} />
                <Row label={t("PT_FORM3_GUARDIAN_NAME")} text={`${t(owners?.fatherOrHusbandName)}` || "NA"} />
                <Row label={t("PT_COMMON_GENDER_LABEL")} text={`${t(owners?.gender)}` || "NA"} />
                <Row label={t("PT_FORM3_OWNERSHIP_TYPE")} text={`${t(application?.ownershipCategory.toLowerCase().split(".")[1])}` || "NA"} />
                <Row label={t("PT_FORM3_MOBILE_NUMBER")} text={`${t(owners?.mobileNumber)}`} />
                <Row label={t("PT_MUTATION_AUTHORISED_EMAIL")} text={`${t("NA")}`} />
                <Row label={t("PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY")} text={`${t(owners?.ownerType).toLowerCase()}`} />
                <Row label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={`${t(owners?.correspondenceAddress)}` || "NA"} />
              </StatusTable>
            </div>
          ))}
        </div>
        <CardSubHeader>{t("PT_COMMON_DOCS")}</CardSubHeader>
        <div>
          {docs.length > 0 &&
            docs.map((docs, index) => (
              <div key="index">
                <CardSubHeader>
                  {t("PT_COMMON_DOCS")} - {index + 1}
                </CardSubHeader>
                <StatusTable>
                  <Row label={t("PT_OWNERSHIP_DOCUMENT_TYPE")} text={`${t(docs?.documentType || 'NA')}`} />
                  <Row label={t("PT_OWNERSHIP_DOCUMENT_ID")} text={`${t(docs?.documentUid && getFixedFilename(docs.documentUid, 17) || 'NA')}`} />
                </StatusTable>
              </div>
            ))}
        </div>
        <PTWFApplicationTimeline application={application} id={acknowledgementIds} />
      </Card>
    </React.Fragment>
  );
};

export default PTApplicationDetails;
