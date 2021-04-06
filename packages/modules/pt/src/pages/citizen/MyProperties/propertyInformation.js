import { Card, CardSubHeader, Header, LinkButton, Loader, Row, StatusTable } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { getFixedFilename } from "../../../utils";
import { propertyCardBodyStyle } from "../../../utils";

const PropertyInformation = () => {
  const { t } = useTranslation();
  const { propertyIds } = useParams();

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { isLoading, isError, error, data } = Digit.Hooks.pt.usePropertySearch({ tenantId, filters: { propertyIds } });

  const property = data?.Properties[0] || " ";
  let docs = [];
  docs = property?.documents;
  let unit = [];
  let owners = [];
  owners = property?.owners;
  unit = property?.units;
  if (isLoading) {
    return <Loader />;
  }

  const ActionButton = ({ jumpTo }) => {
    const { t } = useTranslation();
    const history = useHistory();
    function routeTo() {
      history.push(jumpTo);
    }
    return <LinkButton label={t("PT_OWNER_HISTORY")} className="check-page-link-button" onClick={routeTo} />;
  };

  return (
    <React.Fragment>
      <Header>{t("PT_PROPERTY_INFORMATION")}</Header>
      <div style={{ ...propertyCardBodyStyle, maxHeight: "calc(100vh - 10em)" }}>
      <Card>
        <StatusTable>
          <Row label={t("PT_PROPERTY_PTUID")} text={`${property.propertyId || "NA"}`} />
          <Row label={t("Total Property Due")} text={"3223"} />
        </StatusTable>
        <CardSubHeader>{t("PT_PROPERTY_ADDRESS_SUB_HEADER")}</CardSubHeader>
        <StatusTable>
          <Row label={t("PT_PROPERTY_ADDRESS_PINCODE")} text={`${property.pincode || "NA"}`} />
          <Row label={t("PT_COMMON_CITY")} text={`${property.address?.city || "NA"}`} />
          <Row label={t("PT_COMMON_LOCALITY_OR_MOHALLA")} text={t("PB_AMRITSAR_REVENUE_SUN04")} />
          <Row label={t("PT_PROPERTY_ADDRESS_STREET_NAME")} text={`${property.street || "NA"}`} />
          <Row label={t("PT_PROPERTY_ADDRESS_COLONY_NAME")} text={`${property.address?.buildingName || "NA"}`} />
        </StatusTable>
        <CardSubHeader>{t("PT_PROPERTY_ASSESSMENT_DETAILS_HEADER")}</CardSubHeader>
        <StatusTable>
          <Row label={t("PT_ASSESMENT_INFO_USAGE_TYPE")} text={`${property.usageCategory || "NA"}`} />
          <Row label={t("PT_COMMON_PROPERTY_TYPE")} text={`${t(property?.propertyType.toLowerCase().split(".")[1])}` || "NA"} />
          <Row label={t("PT_ASSESMENT1_PLOT_SIZE")} text={`${property.landArea || "NA"}`} />
          <Row label={t("PT_ASSESMENT_INFO_NO_OF_FLOOR")} text={`${property.noOfFloors || "NA"}`} />
        </StatusTable>
        <CardSubHeader>{t("Ground Floor")}</CardSubHeader>
        <CardSubHeader>{t("Unit 1")}</CardSubHeader>
        <div style={{ border: "groove" }}>
          <StatusTable>
            <Row
              label={t("PT_ASSESSMENT_UNIT_USAGE_TYPE")}
              text={`${(Array.isArray(property) && property.units[0].usageCategory.toLowerCase()) || "NA"}`}
            />
            <Row label={t("PT_OCCUPANY_TYPE_LABEL")} text={`${(Array.isArray(property) && property.units[0].occupancyType.toLowerCase()) || "NA"}`} />
            <Row
              label={t("PT_BUILTUP_AREA_LABEL")}
              text={`${(Array.isArray(property) && property.units[0].constructionDetail?.builtUpArea) || "NA"}`}
            />
          </StatusTable>
        </div>
        <div>
          {Array.isArray(unit) &&
            unit.length > 1 &&
            unit.map((unit, index) => (
              <div key={index}>
                <CardSubHeader>
                  {index} {t("Floor")}
                </CardSubHeader>
                <CardSubHeader>{t("Unit 1")}</CardSubHeader>
                <StatusTable>
                  <Row label={t("PT_ASSESSMENT_UNIT_USAGE_TYPE")} text={`${property.units?.usageCategory.toLowerCase() || "NA"}`} />
                  <Row label={t("PT_OCCUPANY_TYPE_LABEL")} text={`${property.units?.occupancyType.toLowerCase() || "NA"}`} />
                  <Row label={t("PT_BUILTUP_AREA_LABEL")} text={`${property.units?.constructionDetail?.builtUpArea || "NA"}`} />
                </StatusTable>
              </div>
            ))}
        </div>
        <CardSubHeader>{t("PT_COMMON_PROPERTY_OWNERSHIP_DETAILS_HEADER")}</CardSubHeader>
        <div>
          {Array.isArray(owners) &&
            owners.map((owners, index) => (
              <div key={index}>
                <CardSubHeader>
                  {t("PT_OWNER_SUB_HEADER")} - {index + 1}
                </CardSubHeader>
                <StatusTable>
                  <Row label={t("PT_COMMON_APPLICANT_NAME_LABEL")} text={`${owners?.name || "NA"}`} actionButton={<ActionButton jumpTo="" />} />
                  <Row label={t("PT_FORM3_GUARDIAN_NAME")} text={`${owners?.fatherOrHusbandName || "NA"}`} />
                  <Row label={t("PT_COMMON_GENDER_LABEL")} text={`${owners?.gender ? owners?.gender.toLowerCase() : "NA"}`} />
                  <Row
                    label={t("PT_FORM3_OWNERSHIP_TYPE")}
                    text={`${property?.ownershipCategory ? t(property?.ownershipCategory.toLowerCase().split(".")[1]) : "NA"}`}
                  />
                  <Row label={t("PT_FORM3_MOBILE_NUMBER")} text={`${t(owners?.mobileNumber)}` || "NA"} />
                  <Row label={t("PT_MUTATION_AUTHORISED_EMAIL")} text={`${t("NA")}`} />
                  <Row label={t("PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY")} text={`${t(owners?.ownerType).toLowerCase()}` || "NA"} />
                  <Row label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={`${t(owners?.correspondenceAddress)}` || "NA"} />
                </StatusTable>
              </div>
            ))}
        </div>
        <CardSubHeader>{t("PT_COMMON_DOCS")}</CardSubHeader>
        <div>
          {Array.isArray(docs) ? (
            docs.length > 0 &&
            docs.map((docs, index) => (
              <div key="index">
                <span>
                  {t("PT_COMMON_DOCS")} - {index + 1}
                </span>
                <StatusTable>
                  <Row label={t("PT_OWNERSHIP_DOCUMENT_TYPE")} text={`${t(docs?.documentType || "NA")}`} />
                  <Row label={t("PT_OWNERSHIP_DOCUMENT_ID")} text={`${t((docs?.documentUid && getFixedFilename(docs.documentUid, 17)) || "NA")}`} />
                </StatusTable>
              </div>
            ))
          ) : (
            <StatusTable>
              <Row text="PT_NO_DOCUMENTS_MSG" />
            </StatusTable>
          )}
        </div>
      </Card>
      </div>
    </React.Fragment>
  );
};

export default PropertyInformation;
