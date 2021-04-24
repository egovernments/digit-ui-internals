import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header, Card, KeyNote, LinkButton, Loader, MultiLink } from "@egovernments/digit-ui-react-components";
import { useHistory, useLocation, useParams } from "react-router-dom";
import getPDFData from "../../getPDFData";
import { getVehicleType } from "../../utils";
import { ApplicationTimeline } from "../../components/ApplicationTimeline";

const ApplicationDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const { state: locState } = useLocation();
  const tenantId = locState?.tenantId || Digit.ULBService.getCurrentTenantId();
  const state = tenantId?.split(".")[0];

  const { isLoading, isError, error, data: application, error: errorApplication } = Digit.Hooks.fsm.useApplicationDetail(
    t,
    tenantId,
    id,
    {},
    "CITIZEN"
  );

  const { data: paymentsHistory } = Digit.Hooks.fsm.usePaymentHistory(tenantId, id);

  const coreData = Digit.Hooks.useCoreData();

  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    console.log(application?.pdfData, errorApplication);
  }, [application, errorApplication]);

  if (isLoading || !application) {
    return <Loader />;
  }

  if (application?.applicationDetails?.length === 0) {
    history.goBack();
  }

  const tenantInfo = coreData.tenants.find((tenant) => tenant.code === application?.tenantId);

  const handleDownloadPdf = async () => {
    const data = getPDFData({ ...application?.pdfData }, tenantInfo, t);
    Digit.Utils.pdf.generate(data);
    setShowOptions(false);
  };

  const downloadPaymentReceipt = async () => {
    // console.log("print payment receipt", paymentsHistory)
    const receiptFile = { filestoreIds: [paymentsHistory.Payments[0]?.fileStoreId] };
    const fileStore = await Digit.PaymentService.printReciept(state, { fileStoreIds: receiptFile.filestoreIds[0] });
    window.open(fileStore[receiptFile.filestoreIds[0]], "_blank");
    setShowOptions(false);
  };

  const dowloadOptions =
    paymentsHistory?.Payments?.length > 0
      ? [
          {
            label: t("CS_COMMON_APPLICATION_ACKNOWLEDGEMENT"),
            onClick: handleDownloadPdf,
          },
          {
            label: t("CS_COMMON_PAYMENT_RECEIPT"),
            onClick: downloadPaymentReceipt,
          },
        ]
      : [
          {
            label: t("CS_COMMON_APPLICATION_ACKNOWLEDGEMENT"),
            onClick: handleDownloadPdf,
          },
        ];

  return (
    <React.Fragment>
      <MultiLink onHeadClick={() => setShowOptions(!showOptions)} displayOptions={showOptions} options={dowloadOptions} />
      <Header>{t("CS_FSM_APPLICATION_DETAIL_TITLE_APPLICATION_DETAILS")}</Header>
      <Card style={{ position: "relative" }}>
        {application?.applicationDetails?.map(({ title, value, child, caption, map }, index) => {
          return (
            <KeyNote key={index} keyValue={t(title)} note={t(value) || ((!map || !child) && "N/A")} caption={t(caption)}>
              {child && typeof child === "object" ? React.createElement(child.element, { ...child }) : child}
            </KeyNote>
          );
        })}
        <ApplicationTimeline application={application?.pdfData} id={id} />
      </Card>
    </React.Fragment>
  );
};

export default ApplicationDetails;
