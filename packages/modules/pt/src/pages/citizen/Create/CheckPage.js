import { Card, CardHeader, CardSubHeader, CardText, LinkButton, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {
  cardBodyStyle,
  checkForNA,
  getFixedFilename,
  isPropertyVacant,
  isPropertyFlatorPartofBuilding,
  isthere1Basement,
  isthere2Basement,
  isPropertyselfoccupied,
  ispropertyunoccupied,
  isPropertyIndependent,
} from "../../../utils";

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
    Floorno,
    ownershipCategory,
    Constructiondetails,
    IsAnyPartOfThisFloorUnOccupied,
    propertyArea,
    selfOccupied,
    owners,
  } = value;
  let flatplotsize;
  if (isPropertyselfoccupied(selfOccupied?.i18nKey)) {
    flatplotsize = parseInt(landarea?.floorarea);
    if (ispropertyunoccupied(IsAnyPartOfThisFloorUnOccupied?.i18nKey)) {
      flatplotsize = flatplotsize + parseInt(UnOccupiedArea?.UnOccupiedArea);
    }
  } else {
    flatplotsize = parseInt(landarea?.floorarea) + parseInt(Constructiondetails?.RentArea);
    if (!ispropertyunoccupied(IsAnyPartOfThisFloorUnOccupied?.i18nKey)) {
      flatplotsize = flatplotsize + parseInt(UnOccupiedArea?.UnOccupiedArea);
    }
  }
  if (isPropertyIndependent(PropertyType?.i18nKey)) {
    flatplotsize = parseInt(propertyArea?.builtUpArea) + parseInt(propertyArea?.plotSize);
  }
  console.log(flatplotsize);
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
                <StatusTable>
                  <Row
                    label={t("PT_COMMON_APPLICANT_NAME_LABEL")}
                    text={`${t(checkForNA(owner?.name))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/owner-details/"}${index}`} />}
                  />
                  <Row
                    label={t("PT_COMMON_GENDER_LABEL")}
                    text={`${t(checkForNA(owner?.gender?.code))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/owner-details/"}${index}`} />}
                  />
                  <Row
                    label={t("PT_FORM3_GUARDIAN_NAME")}
                    text={`${t(checkForNA(owner?.fatherOrHusbandName))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/owner-details/"}${index}`} />}
                  />
                  <Row
                    label={`${t("COMMON_OWNER")} ${t("PT_ADDRESS_LABEL")}`}
                    text={`${t(checkForNA(owner?.permanentAddress))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/owner-address/"}${index}`} />}
                  />
                </StatusTable>
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
          {!isPropertyVacant(PropertyType?.i18nKey) && !isPropertyFlatorPartofBuilding(PropertyType?.i18nKey) && (
            <Row
              label={t("PT_ASSESMENT_INFO_NO_OF_FLOOR")}
              text={`${t(checkForNA(noOfFloors?.i18nKey))}`}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/number-of-floors" />}
            />
          )}
          {!isPropertyVacant(PropertyType?.i18nKey) && !isPropertyFlatorPartofBuilding(PropertyType?.i18nKey) && (
            <Row
              label={t("PT_PROPERTY_DETAILS_NO_OF_BASEMENTS_LABEL")}
              text={`${t(checkForNA(noOofBasements?.i18nKey))}`}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/number-of-basements@0" />}
            />
          )}
          {isPropertyVacant(PropertyType?.i18nKey) && !isPropertyFlatorPartofBuilding(PropertyType?.i18nKey) && (
            <Row
              label={t("PT_ASSESMENT1_PLOT_SIZE")}
              text={`${t(checkForNA(landarea?.floorarea))} ${(landarea?.floorarea && "sq.ft") || ""}`}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/area" />}
            />
          )}
          {isPropertyFlatorPartofBuilding(PropertyType?.i18nKey) && (
            <Row
              label={t("PT_ASSESMENT1_PLOT_SIZE")}
              text={`${t(checkForNA(flatplotsize))} ${(flatplotsize && "sq.ft") || ""}`}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/area" />}
            />
          )}
          {isPropertyIndependent(PropertyType?.i18nKey) && (
            <Row
              label={t("PT_ASSESMENT1_PLOT_SIZE")}
              text={`${t(checkForNA(flatplotsize))} ${(flatplotsize && "sq.ft") || ""}`}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/area" />}
            />
          )}
        </StatusTable>
        {!isPropertyVacant(PropertyType?.i18nKey) && isPropertyFlatorPartofBuilding(PropertyType?.i18nKey) && (
          <CardSubHeader>{`${t(Floorno?.i18nKey)} Details`}</CardSubHeader>
        )}
        {!isPropertyVacant(PropertyType?.i18nKey) && isPropertyFlatorPartofBuilding(PropertyType?.i18nKey) && (
          <StatusTable>
            {/* <Row
              label={t("PT_ASSESMENT1_PLOT_SIZE")}
              text={`${t(checkForNA(units[0]?.plotSize))} ${(units[0]?.plotSize && "sq.ft") || ""}`}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/floordetails/0" />}
            /> */}
            <Row
              label={t("PT_ASSESMENT_INFO_OCCUPLANCY")}
              //text={`${t(checkForNA(units[0]?.builtUpArea))} ${(units[0]?.builtUpArea && "sq.ft") || ""}`}
              text={`${t(checkForNA(selfOccupied?.i18nKey))}`}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/is-this-floor-self-occupied" />}
            />
            <Row
              label={t("PT_BUILT_UP_AREA_LABEL")}
              //text={`${t(checkForNA(units[0]?.builtUpArea))} ${(units[0]?.builtUpArea && "sq.ft") || ""}`}
              text={`${t(checkForNA(landarea?.floorarea))} ${(landarea?.floorarea && "sq.ft") || ""}`}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/area" />}
            />
            {!isPropertyselfoccupied(selfOccupied?.i18nKey) && (
              <Row
                label={t("PT_PROPERTY_RENTED_AREA_LABEL")}
                text={`${t(checkForNA(Constructiondetails?.RentArea))} ${(Constructiondetails?.RentArea && "sq.ft") || ""}`}
                actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/rental-details" />}
              />
            )}
            {!isPropertyselfoccupied(selfOccupied?.i18nKey) && (
              <Row
                label={t("PT_PROPERTY_ANNUAL_RENT_LABEL")}
                text={`${t(checkForNA(Constructiondetails?.AnnualRent))} ${(Constructiondetails?.AnnualRent && "sq.ft") || ""}`}
                actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/rental-details" />}
              />
            )}
            <Row
              label={t("PT_PROPERTY_UNOCCUPIED_AREA_LABEL")}
              text={`${t(checkForNA(UnOccupiedArea?.UnOccupiedArea))} ${(UnOccupiedArea?.UnOccupiedArea && "sq.ft") || ""}`}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/un-occupied-area" />}
            />
          </StatusTable>
        )}
        <div>
          {!isPropertyVacant(PropertyType?.i18nKey) &&
            !isPropertyFlatorPartofBuilding(PropertyType?.i18nKey) &&
            units &&
            units.map &&
            units.map((owner, index) => (
              <div key={index}>
                <CardSubHeader>
                  {t(`PROPERTYTAX_FLOOR_${index}`)} {t("PT_DETAILS_HEADER")}
                </CardSubHeader>
                <StatusTable>
                  <Row
                    label={t("PT_ASSESMENT_INFO_OCCUPLANCY")}
                    //text={`${t(checkForNA(units[0]?.builtUpArea))} ${(units[0]?.builtUpArea && "sq.ft") || ""}`}
                    text={`${t(checkForNA(units[index]?.selfOccupied?.i18nKey))}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/is-this-floor-self-occupied/"}${index}`} />}
                  />
                  <Row
                    label={t("PT_BUILT_UP_AREA_LABEL")}
                    //text={`${t(checkForNA(units[0]?.builtUpArea))} ${(units[0]?.builtUpArea && "sq.ft") || ""}`}
                    text={`${t(checkForNA(units[index]?.floorarea))} ${(units[index]?.floorarea && "sq.ft") || ""}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/area/"}${index}`} />}
                  />
                  {!isPropertyselfoccupied(units[index]?.selfOccupied?.i18nKey) && (
                    <Row
                      label={t("PT_PROPERTY_RENTED_AREA_LABEL")}
                      text={`${t(checkForNA(units[index]?.RentArea))} ${(units[index]?.RentArea && "sq.ft") || ""}`}
                      actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/rental-details/"}${index}`} />}
                    />
                  )}
                  {!isPropertyselfoccupied(units[index]?.selfOccupied?.i18nKey) && (
                    <Row
                      label={t("PT_PROPERTY_ANNUAL_RENT_LABEL")}
                      text={`${t(checkForNA(units[index]?.AnnualRent))} ${(units[index]?.AnnualRent && "sq.ft") || ""}`}
                      actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/rental-details/"}${index}`} />}
                    />
                  )}
                  <Row
                    label={t("PT_PROPERTY_UNOCCUPIED_AREA_LABEL")}
                    text={`${t(checkForNA(units[index]?.UnOccupiedArea))} ${(units[index]?.UnOccupiedArea && "sq.ft") || ""}`}
                    actionButton={<ActionButton jumpTo={`${"/digit-ui/citizen/pt/property/new-application/un-occupied-area/"}${index}`} />}
                  />
                </StatusTable>
              </div>
            ))}
        </div>
        <div>
          {isthere1Basement(noOofBasements?.i18nKey) && (
            <div>
              <CardSubHeader>
                {t("PROPERTYTAX_FLOOR__1")} {t("PT_DETAILS_HEADER")}
              </CardSubHeader>
              <StatusTable>
                <Row
                  label={t("PT_ASSESMENT_INFO_OCCUPLANCY")}
                  //text={`${t(checkForNA(units[0]?.builtUpArea))} ${(units[0]?.builtUpArea && "sq.ft") || ""}`}
                  text={`${t(checkForNA(units["-1"]?.selfOccupied?.i18nKey))}`}
                  actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/is-this-floor-self-occupied/-1" />}
                />
                <Row
                  label={t("PT_BUILT_UP_AREA_LABEL")}
                  //text={`${t(checkForNA(units[0]?.builtUpArea))} ${(units[0]?.builtUpArea && "sq.ft") || ""}`}
                  text={`${t(checkForNA(units["-1"]?.floorarea))} ${(units["-1"]?.floorarea && "sq.ft") || ""}`}
                  actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/area/-1" />}
                />
                {!isPropertyselfoccupied(units["-1"]?.selfOccupied?.i18nKey) && (
                  <Row
                    label={t("PT_PROPERTY_RENTED_AREA_LABEL")}
                    text={`${t(checkForNA(units["-1"]?.RentArea))} ${(units["-1"]?.RentArea && "sq.ft") || ""}`}
                    actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/rental-details/-1" />}
                  />
                )}
                {!isPropertyselfoccupied(units["-1"]?.selfOccupied?.i18nKey) && (
                  <Row
                    label={t("PT_PROPERTY_ANNUAL_RENT_LABEL")}
                    text={`${t(checkForNA(units["-1"]?.AnnualRent))} ${(units["-1"]?.AnnualRent && "sq.ft") || ""}`}
                    actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/rental-details/-1" />}
                  />
                )}
                <Row
                  label={t("PT_PROPERTY_UNOCCUPIED_AREA_LABEL")}
                  text={`${t(checkForNA(units["-1"]?.UnOccupiedArea))} ${(units["-1"]?.UnOccupiedArea && "sq.ft") || ""}`}
                  actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/un-occupied-area/-1" />}
                />
              </StatusTable>
            </div>
          )}
        </div>
        <div>
          {isthere2Basement(noOofBasements?.i18nKey) && (
            <div>
              <CardSubHeader>
                {t("PROPERTYTAX_FLOOR__2")} {t("PT_DETAILS_HEADER")}
              </CardSubHeader>
              <StatusTable>
                <Row
                  label={t("PT_ASSESMENT_INFO_OCCUPLANCY")}
                  //text={`${t(checkForNA(units[0]?.builtUpArea))} ${(units[0]?.builtUpArea && "sq.ft") || ""}`}
                  text={`${t(checkForNA(units["-2"]?.selfOccupied?.i18nKey))}`}
                  actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/is-this-floor-self-occupied/-2" />}
                />
                <Row
                  label={t("PT_BUILT_UP_AREA_LABEL")}
                  //text={`${t(checkForNA(units[0]?.builtUpArea))} ${(units[0]?.builtUpArea && "sq.ft") || ""}`}
                  text={`${t(checkForNA(units["-2"]?.floorarea))} ${(units["-2"]?.floorarea && "sq.ft") || ""}`}
                  actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/area/-2" />}
                />
                {!isPropertyselfoccupied(units["-2"]?.selfOccupied?.i18nKey) && (
                  <Row
                    label={t("PT_PROPERTY_RENTED_AREA_LABEL")}
                    text={`${t(checkForNA(units["-2"]?.RentArea))} ${(units["-2"]?.RentArea && "sq.ft") || ""}`}
                    actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/rental-details/-2" />}
                  />
                )}
                {!isPropertyselfoccupied(units["-2"]?.selfOccupied?.i18nKey) && (
                  <Row
                    label={t("PT_PROPERTY_ANNUAL_RENT_LABEL")}
                    text={`${t(checkForNA(units["-2"]?.AnnualRent))} ${(units["-2"]?.AnnualRent && "sq.ft") || ""}`}
                    actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/rental-details/-2" />}
                  />
                )}
                <Row
                  label={t("PT_PROPERTY_UNOCCUPIED_AREA_LABEL")}
                  text={`${t(checkForNA(units["-2"]?.UnOccupiedArea))} ${(units["-2"]?.UnOccupiedArea && "sq.ft") || ""}`}
                  actionButton={<ActionButton jumpTo="/digit-ui/citizen/pt/property/new-application/un-occupied-area/-2" />}
                />
              </StatusTable>
            </div>
          )}
        </div>
      </div>
      <SubmitBar label="Submit" onSubmit={onSubmit} />
    </Card>
  );
};

export default CheckPage;
