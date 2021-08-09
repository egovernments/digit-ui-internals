import { Card, CardCaption, TextInput, CardHeader, Label, StatusTable, Row } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import Timeline from "./Timeline";

const PlotDetails = () => {
  const { t } = useTranslation()
  return (
    <div>
      <Timeline />
      <Card>
        <CardCaption>{t(`BPA_SCRUTINY_DETAILS`)}</CardCaption>
        <CardHeader>{t(`BPA_PLOT_DETAILS_TITLE`)}</CardHeader>
        <StatusTable>
          <Row label={t(`BPA_BOUNDARY_PLOT_AREA_LABEL`)} text={'2000 sq.ft'} />
          <Row label={t(`BPA_BOUNDARY_PLOT_NO_LABEL`)} text={'12 A'} />
          <Row label={t(`BPA_BOUNDARY_KHATA_NO_LABEL`)} text={'14'}/>
        </StatusTable>
        <Label>{t(`BPA_BOUNDARY_HOLDING_NO_LABEL`)}</Label>
        <TextInput />
        <Label>{t(`BPA_BOUNDARY_LAND_REG_DETAIL_LABEL`)}</Label>
        <TextInput />
      </Card>
    </div>
  )
};

export default PlotDetails;