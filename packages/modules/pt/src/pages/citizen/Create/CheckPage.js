import { Card, CardHeader, CardSubHeader, CardText, LinkButton, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { cardBodyStyle, checkForNA, getFixedFilename, isPropertyVacant } from "../../../utils";

const ActionButton = ({ jumpTo }) => {
  const { t } = useTranslation();
  const history = useHistory();
  function routeTo() {
    history.push(jumpTo);
  }

  return <LinkButton label={t("CS_COMMON_CHANGE")} className="check-page-link-button" onClick={routeTo} />;
};

const CheckPage = ({ onSubmit, value = {} }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const {
    address,
    isResdential,
    PropertyType,
    noOfFloors,
    noOofBasements,
    units = [{}],
    landarea,
    UnOccupiedArea,
    city_complaint,
    locality_complaint,
    street,
    doorNo,
    landmark,
    ownerType,
    ownershipCategory,
    owners,
  } = value;
  return (
    <Card>
      <CardHeader>{t("CS_CHECK_CHECK_YOUR_ANSWERS")}</CardHeader>
      <div style={{ ...cardBodyStyle, maxHeight: "calc(100vh - 15em)" }}>
        <CardText>{t("CS_CHECK_CHECK_YOUR_ANSWERS_TEXT")}</CardText>
        <CardSubHeader>{t("PT_PROPERTY_ADDRESS_SUB_HEADER")}</CardSubHeader>
        <StatusTable>
          <Row
            label={t("PT_PROPERTY_ADDRESS_SUB_HEADER")}
            text={`${address?.doorNo ? `${address?.doorNo}, ` : ""} ${address?.street ? `${address?.street}, ` : ""}${
              address?.landmark ? `${address?.landmark}, ` : ""
            }${t(address?.locality.code)}, ${t(address?.city.code)},${t(address?.pincode) ? `${address.pincode}` : " "}`}
            actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/pincode" />}
          />
          <Row
            label={t("PT_PROOF_OF_ADDRESS_SUB_HEADER")}
            text={`${(address?.documents?.ProofOfAddress?.name && getFixedFilename(address.documents.ProofOfAddress.name)) || "na"}`}
            actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/proof" />}
          />
        </StatusTable>
        <CardSubHeader>{t("PT_OWNERSHIP_DETAILS_SUB_HEADER")}</CardSubHeader>
        <StatusTable>
          <Row
            label={t("PT_FORM3_OWNERSHIP_TYPE")}
            text={t(checkForNA(ownershipCategory?.i18nKey))}
            actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/owner-ship-details@0" />}
          />
        </StatusTable>
        <div>
          {owners &&
            owners.map &&
            owners.map((owner, index) => (
              <div key={index}>
                {owners.length != 1 && (
                  <CardSubHeader>
                    {t("PT_OWNER_SUB_HEADER")} - {index + 1}
                  </CardSubHeader>
                )}
                {(ownershipCategory?.value == "INSTITUTIONALPRIVATE" || ownershipCategory?.value == "INSTITUTIONALGOVERNMENT")? 
                <div>
                <StatusTable>
                  <Row
                    label={t("PT_COMMON_INSTITUTION_NAME")}
                    text={`${t(checkForNA(owner?.inistitutionName))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/inistitution-details/"}${index}`} />}
                  />
                  <Row
                    label={t("PT_TYPE_OF_INSTITUTION")}
                    text={`${t(checkForNA(owner?.inistitutetype?.code))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/inistitution-details/"}${index}`} />}
                  />
                  <Row
                    label={t("PT_OWNER_NAME")}
                    text={`${t(checkForNA(owner?.name))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/inistitution-details/"}${index}`} />}
                  />
                  <Row
                    label={`${t("PT_COMMON_AUTHORISED_PERSON_DESIGNATION")}`}
                    text={`${t(checkForNA(owner?.designation))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/inistitution-details/"}${index}`} />}
                  />
                  <Row
                    label={`${t("PT_FORM3_MOBILE_NUMBER")}`}
                    text={`${t(checkForNA(owner?.mobileNumber))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/inistitution-details/"}${index}`} />}
                  />
                  <Row
                    label={`${t("PT_OWNERSHIP_INFO_TEL_PHONE_NO")}`}
                    text={`${t(checkForNA(owner?.altContactNumber))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/inistitution-details/"}${index}`} />}
                  />
                  <Row
                    label={`${t("PT_FORM3_EMAIL_ID")}`}
                    text={`${t(checkForNA(owner?.emailId))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/inistitution-details/"}${index}`} />}
                  />
                  <Row
                    label={`${t("PT_OWNERSHIP_INFO_CORR_ADDR")}`}
                    text={`${t(checkForNA(owner?.permanentAddress))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/institutional-owner-address/"}${index}`} />}
                  />
                  <Row
                    label={`${t("PT_COMMON_SAME_AS_PROPERTY_ADDRESS")}`}
                    text={`${t(checkForNA(owner?.isCorrespondenceAddress))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/institutional-owner-address/"}${index}`} />}
                  />
                </StatusTable>
                </div>:<div>
                <StatusTable>
                  <Row
                    label={t("PT_OWNER_NAME")}
                    text={`${t(checkForNA(owner?.name))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/owner-details/"}${index}`}/>}
                  />
                  <Row
                    label={t("PT_FORM3_GENDER")}
                    text={`${t(checkForNA(owner?.gender?.code))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/owner-details/"}${index}`}/>}
                  />
                  <Row
                    label={`${t("PT_FORM3_MOBILE_NUMBER")}`}
                    text={`${t(checkForNA(owner?.mobileNumber))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/owner-details/"}${index}`}/>}
                  />
                  <Row
                    label={t("PT_FORM3_GUARDIAN_NAME")}
                    text={`${t(checkForNA(owner?.fatherOrHusbandName))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/owner-details/"}${index}`} />}
                  />
                  <Row
                    label={t("PT_FORM3_RELATIONSHIP")}
                    text={`${t(checkForNA(owner?.relationship?.code))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/owner-details/"}${index}`} />}
                  />
                  <Row
                    label={t("PT_SPECIAL_OWNER_CATEGORY")}
                    text={`${t(checkForNA(owner?.ownerType?.code))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/special-owner-category/"}${index}`} />}
                  />
                  <Row
                    label={`${t("PT_OWNERS_ADDRESS")}`}
                    text={`${t(checkForNA(owner?.permanentAddress))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/owner-address/"}${index}`} />}
                  />
                  <Row
                    label={`${t("PT_COMMON_SAME_AS_PROPERTY_ADDRESS")}`}
                    text={`${t(checkForNA(owner?.isCorrespondenceAddress))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/owner-address/"}${index}`} />}
                  />
                </StatusTable>
                </div>}
              </div>
            ))}
        </div>
        <CardSubHeader>{t("PT_ASSESMENT_INFO_SUB_HEADER")}</CardSubHeader>
        <StatusTable>
          <Row
            label={t("PT_RESIDENTIAL_PROP_LABEL")}
            text={`${t(checkForNA(isResdential?.i18nKey))}`}
            actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/isResidential" />}
          />
          <Row
            label={t("PT_ASSESMENT1_PROPERTY_TYPE")}
            text={`${t(checkForNA(PropertyType?.i18nKey))}`}
            actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/property-type" />}
          />
          {!isPropertyVacant(PropertyType?.i18nKey) && (
            <Row
              label={t("PT_ASSESMENT_INFO_NO_OF_FLOOR")}
              text={`${t(checkForNA(noOfFloors?.i18nKey))}`}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/number-of-floors" />}
            />
          )}
          {!isPropertyVacant(PropertyType?.i18nKey) && (
            <Row
              label={t("PT_PROPERTY_DETAILS_NO_OF_BASEMENTS_LABEL")}
              text={`${t(checkForNA(noOofBasements?.i18nKey))}`}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/number-of-basements@0" />}
            />
          )}
          {isPropertyVacant(PropertyType?.i18nKey) && (
            <Row
              label={t("PT_ASSESMENT1_PLOT_SIZE")}
              text={`${t(checkForNA(landarea?.floorarea))} ${(landarea?.floorarea && "sq.ft") || ""}`}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/floordetails/0" />}
            />
          )}
        </StatusTable>
        {!isPropertyVacant(PropertyType?.i18nKey) && <CardSubHeader>{t("PT_GROUND_FLOOR_DETAILS_LABEL")}</CardSubHeader>}
        {!isPropertyVacant(PropertyType?.i18nKey) && (
          <StatusTable>
            <Row
              label={t("PT_ASSESMENT1_PLOT_SIZE")}
              text={`${t(checkForNA(units[0]?.plotSize))} ${(units[0]?.plotSize && "sq.ft") || ""}`}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/floordetails/0" />}
            />
            <Row
              label={t("PT_BUILT_UP_AREA_LABEL")}
              text={`${t(checkForNA(units[0]?.builtUpArea))} ${(units[0]?.builtUpArea && "sq.ft") || ""}`}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/floordetails/0" />}
            />
            <Row
              label={t("PT_PROPERTY_RENTED_AREA_LABEL")}
              text={`${t(checkForNA(units["s"]?.RentArea))} ${(units["s"]?.RentArea && "sq.ft") || ""}`}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/rental-details" />}
            />
            <Row
              label={t("PT_PROPERTY_ANNUAL_RENT_LABEL")}
              text={`${t(checkForNA(units["s"]?.AnnualRent))} ${(units["s"]?.AnnualRent && "sq.ft") || ""}`}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/rental-details" />}
            />
            <Row
              label={t("PT_PROPERTY_UNOCCUPIED_AREA_LABEL")}
              text={`${t(checkForNA(units["a"]?.UnOccupiedArea))} ${(units["a"]?.UnOccupiedArea && "sq.ft") || ""}`}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/un-occupied-area" />}
            />
          </StatusTable>
        )}
      </div>
      <SubmitBar label="Submit" onSubmit={onSubmit} />
    </Card>
  );
};

export default CheckPage;
