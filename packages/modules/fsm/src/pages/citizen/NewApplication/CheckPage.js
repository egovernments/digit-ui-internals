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

  const { address, propertyType, subtype, pitType, pitDetail } = value;
  // console.log("find values here ", value)

  const pitDetailValues = pitDetail ? Object.values(pitDetail).filter((value) => !!value) : null;

  const pitMeasurement = pitDetailValues?.reduce((previous, current, index, array) => {
    if (index === array.length - 1) {
      return previous + current + "m";
    } else {
      return previous + current + "m x ";
    }
  }, "");

  return (
    <Card>
      <CardHeader>{t("CS_CHECK_CHECK_YOUR_ANSWERS")}</CardHeader>
      <CardText>{t("CS_CHECK_CHECK_YOUR_ANSWERS_TEXT")}</CardText>
      <CardSubHeader>{t("CS_CHECK_PROPERTY_DETAILS")}</CardSubHeader>
      <StatusTable>
        <Row
          label={t("CS_CHECK_PROPERTY_TYPE")}
          text={t(propertyType.i18nKey)}
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/property-type" />}
        />
        <Row
          label={t("CS_CHECK_PROPERTY_SUB_TYPE")}
          text={t(subtype.i18nKey)}
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/property-subtype" />}
        />
        <Row
          label={t("CS_CHECK_ADDRESS")}
          text={`${address?.doorNo ? `${address?.doorNo} ` : ""} ${address?.street ? `${address?.street}, ` : ""}${t(address?.locality.code)}, ${t(
            address?.city.code
          )}`}
          actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/pincode" />}
        />
        {address?.landmark && (
          <Row
            label={t("CS_CHECK_LANDMARK")}
            text={address?.landmark}
            actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/landmark" />}
          />
        )}
        {address?.slumArea?.code === true && (
            <Row label={t("CS_APPLICATION_DETAILS_SLUM_NAME")}
              text={t(address?.slumData?.i18nKey)}
              actionButton={<ActionButton jumpTo="/digit-ui/citizen/fsm/new-application/slum-details" />}
            />
          )
        }
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
        )}
      </StatusTable>
      {/* <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("CS_CHECK_INFO_TEXT")} /> */}
      <SubmitBar label="Submit" onSubmit={onSubmit} />
    </Card>
  );
};

export default CheckPage;
