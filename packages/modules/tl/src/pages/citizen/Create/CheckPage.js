import React from "react";
import {
  Card,
  CardCaption,
  CardHeader,
  CardLabel,
  CardSubHeader,
  StatusTable,
  Row,
  ActionLinks,
  LinkButton,
  SubmitBar,
  CardText,
} from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TLDocument from "../../../pageComponents/TLDocumets";

const ActionButton = ({ jumpTo }) => {
  const { t } = useTranslation();
  const history = useHistory();

  function routeTo() {
    history.push(jumpTo);
  }

  return <LinkButton label={t("CS_COMMON_CHANGE")} className="check-page-link-button" onClick={routeTo} />;
};

const CheckPage = ({ onSubmit, value }) => {
  const { t } = useTranslation();
  const history = useHistory();
  console.log(value);

  const { TradeDetails, address, owners, propertyType, subtype, pitType, pitDetail } = value;
  // console.log("find values here ", value)

  //   const pitDetailValues = pitDetail ? Object.values(pitDetail).filter((value) => !!value) : null;

  //   const pitMeasurement = pitDetailValues?.reduce((previous, current, index, array) => {
  //     if (index === array.length - 1) {
  //       return previous + current + "m";
  //     } else {
  //       return previous + current + "m x ";
  //     }
  //   }, "");

  return (
    <Card>
      <CardHeader>{t("CS_CHECK_CHECK_YOUR_ANSWERS")}</CardHeader>
      <CardText>{t("CS_CHECK_CHECK_YOUR_ANSWERS_TEXT")}</CardText>
      <CardSubHeader>{t("TL_LOCALIZATION_TRADE_DETAILS")}</CardSubHeader>
      <StatusTable>
        <Row
          label={t("TL_LOCALIZATION_TRADE_NAME")}
          text={t(TradeDetails?.TradeName)}
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/tl/tradelicence/new-application/info" />}
        />
        <Row
          label={t("TL_STRUCTURE_TYPE")}
          text={t(`TL_${TradeDetails?.StructureType.code}`)}
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/tl/tradelicence/new-application/info" />}
        />
        <Row
          label={t("TL_STRUCTURE_SUB_TYPE")}
          text={t(TradeDetails?.VehicleType ? TradeDetails?.VehicleType.i18nKey : TradeDetails?.BuildingType.i18nKey)}
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/tl/tradelicence/new-application/info" />}
        />
        <Row
          label={t("TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL")}
          text={t(TradeDetails?.CommencementDate)}
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/tl/tradelicence/new-application/info" />}
        />
        {TradeDetails.units.map((unit, index) => (
          <div key={index}>
            <CardSubHeader>
              {t("TL_UNIT_HEADER")}-{index + 1}
            </CardSubHeader>
            <Row
              label={t("TL_NEW_TRADE_DETAILS_TRADE_CAT_LABEL")}
              text={t(unit?.tradecategory.i18nKey)}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/tl/tradelicence/new-application/info" />}
            />
            <Row
              label={t("TL_NEW_TRADE_DETAILS_TRADE_TYPE_LABEL")}
              text={t(unit?.tradetype.i18nKey)}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/tl/tradelicence/new-application/info" />}
            />
            <Row
              label={t("TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_LABEL")}
              text={t(unit?.tradesubtype.i18nKey)}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/tl/tradelicence/new-application/info" />}
            />
            <Row
              label={t("TL_UNIT_OF_MEASURE_LABEL")}
              text={t(unit?.unit)}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/tl/tradelicence/new-application/info" />}
            />
            <Row
              label={t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL")}
              text={t(unit?.uom)}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/tl/tradelicence/new-application/info" />}
            />
          </div>
        ))}
        {TradeDetails.accessories &&
          TradeDetails.accessories.map((acc, index) => (
            <div key={index}>
              <CardSubHeader>
                {t("TL_ACCESSORY_LABEL")}-{index + 1}
              </CardSubHeader>
              <Row
                label={t("TL_TRADE_ACC_HEADER")}
                text={t(acc?.accessory.i18nKey)}
                actionButton={<ActionButton jumpTo="/digit-ui/citizen/tl/tradelicence/new-application/info" />}
              />
              <Row
                label={t("TL_NEW_TRADE_ACCESSORY_COUNT")}
                text={t(acc?.accessorycount)}
                actionButton={<ActionButton jumpTo="/digit-ui/citizen/tl/tradelicence/new-application/info" />}
              />
              <Row
                label={t("TL_ACC_UOM_LABEL")}
                text={t(acc?.unit)}
                actionButton={<ActionButton jumpTo="/digit-ui/citizen/tl/tradelicence/new-application/info" />}
              />
              <Row
                label={t("TL_ACC_UOM_VALUE_LABEL")}
                text={t(acc?.uom)}
                actionButton={<ActionButton jumpTo="/digit-ui/citizen/tl/tradelicence/new-application/info" />}
              />
            </div>
          ))}
        <CardSubHeader>{t("TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS")}</CardSubHeader>
        <Row
          label={t("CS_CHECK_ADDRESS")}
          text={`${address?.doorNo?.trim() ? `${address?.doorNo?.trim()}, ` : ""} ${address?.street?.trim() ? `${address?.street?.trim()}, ` : ""}${t(
            address?.locality?.i18nkey
          )}, ${t(address?.city.code)} ${address?.pincode?.trim() ? `,${address?.pincode?.trim()}` : ""}`}
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/tl/tradelicence/new-application/info" />}
        />
        <CardSubHeader>{t("TL_NEW_OWNER_DETAILS_HEADER")}</CardSubHeader>
        {owners.owners &&
          owners.owners.map((owner, index) => (
            <div key={index}>
              <CardSubHeader>
                {t("TL_PAYMENT_PAID_BY_PLACEHOLDER")}-{index + 1}
              </CardSubHeader>
              <Row
                label={t("TL_COMMON_TABLE_COL_OWN_NAME")}
                text={t(owner?.name)}
                actionButton={<ActionButton jumpTo="/digit-ui/citizen/tl/tradelicence/new-application/info" />}
              />
              <Row
                label={t("TL_NEW_OWNER_DETAILS_GENDER_LABEL")}
                text={t(owner?.gender?.name)}
                actionButton={<ActionButton jumpTo="/digit-ui/citizen/tl/tradelicence/new-application/info" />}
              />
              <Row
                label={t("TL_MOBILE_NUMBER_LABEL")}
                text={t(owner?.mobilenumber)}
                actionButton={<ActionButton jumpTo="/digit-ui/citizen/tl/tradelicence/new-application/info" />}
              />
            </div>
          ))}
        <CardSubHeader>{t("COMMON_DOCS")}</CardSubHeader>
        <div>
          {owners?.documents["OwnerPhotoProof"] ? (
            <TLDocument value={value}></TLDocument>
          ) : (
            <StatusTable>
              <Row text="PT_NO_DOCUMENTS_MSG" />
            </StatusTable>
          )}
        </div>
        {/* <Row
          label={t("CS_CHECK_PROPERTY_SUB_TYPE")}
          text={t(subtype.i18nKey)}
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/property-subtype" />}
        />
        <Row
          label={t("CS_CHECK_ADDRESS")}
          text={`${address?.doorNo?.trim() ? `${address?.doorNo?.trim()}, ` : ""} ${address?.street?.trim() ? `${address?.street?.trim()}, ` : ""}${t(
            address?.locality?.i18nkey
          )}, ${t(address?.city.code)}`}
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/pincode" />}
        />
        {address?.landmark?.trim() && (
          <Row
            label={t("CS_CHECK_LANDMARK")}
            text={address?.landmark?.trim()}
            actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/landmark" />}
          />
        )}
        {address?.slumArea?.code === true && (
          <Row
            label={t("CS_APPLICATION_DETAILS_SLUM_NAME")}
            text={t(address?.slumData?.i18nKey)}
            actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/slum-details" />}
          />
        )}
        {pitType && (
          <Row
            label={t("CS_CHECK_PIT_TYPE")}
            text={t(pitType.i18nKey)}
            actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/pit-type" />}
          />
        )}
        {pitMeasurement && (
          <Row
            label={t("CS_CHECK_SIZE")}
            text={[
              pitMeasurement,
              {
                value:
                  pitDetailValues?.length === 3
                    ? `${t(`CS_COMMON_LENGTH`)} x ${t(`CS_COMMON_BREADTH`)} x ${t(`CS_COMMON_DEPTH`)}`
                    : `${t(`CS_COMMON_DIAMETER`)} x ${t(`CS_COMMON_DEPTH`)}`,
                className: "card-text",
                style: { fontSize: "16px" },
              },
            ]}
            actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/tank-size" />}
          />
        )} */}
      </StatusTable>
      {/* <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("CS_CHECK_INFO_TEXT")} /> */}
      <SubmitBar label={t("CS_COMMON_SUBMIT")} onSubmit={onSubmit} />
    </Card>
  );
};

export default CheckPage;
