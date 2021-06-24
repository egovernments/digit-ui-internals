import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Header, Card, Row, LinkButton, Loader, MultiLink, SubmitBar } from "@egovernments/digit-ui-react-components";
import { useHistory, useLocation, useParams } from "react-router-dom";
import getPDFData from "../../../utils/getTLAcknowledgementData";

const ApplicationDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { tenantId } = useParams();
  const history = useHistory();
  const [bill, setBill] = useState(null);

  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};

  const { isLoading, isError, error, data: application, error: errorApplication } = Digit.Hooks.tl.useTLSearchApplication({
    tenantId: tenantId,
    applicationNumber: id,
  });

  const { data: paymentsHistory } = Digit.Hooks.tl.useTLPaymentHistory(tenantId, id);
  useEffect(() => {
    console.log(application);
    if (application) {
      Digit.PaymentService.fetchBill(tenantId, {
        consumerCode: application[0]?.applicationNumber,
        businessService: application[0]?.businessService,
      }).then((res) => {
        setBill(res?.Bill[0]);
      });
    }
  }, [application]);

  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {}, [application, errorApplication]);

  if (isLoading) {
    return <Loader />;
  }

  if (application?.applicationDetails?.length === 0) {
    history.goBack();
  }

  const handleDownloadPdf = async () => {
    const tenantInfo = tenants.find((tenant) => tenant.code === application[0]?.tenantId);
    let res = application[0];
    console.log(tenantInfo);
    const data = getPDFData({ ...res }, tenantInfo, t);
    data.then((ress) => Digit.Utils.pdf.generate(ress));
    setShowOptions(false);
  };

  const downloadPaymentReceipt = async () => {
    const receiptFile = { filestoreIds: [paymentsHistory.Payments[0]?.fileStoreId] };
    if (!receiptFile?.fileStoreIds?.[0]) {
      const newResponse = await Digit.PaymentService.generatePdf(tenantId, { Payments: [paymentsHistory.Payments[0]] }, "tradelicense-receipt");
      const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: newResponse.filestoreIds[0] });
      window.open(fileStore[newResponse.filestoreIds[0]], "_blank");
      setShowOptions(false);
    } else {
      const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: receiptFile.filestoreIds[0] });
      window.open(fileStore[receiptFile.filestoreIds[0]], "_blank");
      setShowOptions(false);
    }
  };

  const downloadTLcertificate = async () => {
    const TLcertificatefile = await Digit.PaymentService.generatePdf(tenantId, { Licenses: application }, "tlcertificate");
    const receiptFile = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: TLcertificatefile.filestoreIds[0] });
    window.open(receiptFile[TLcertificatefile.filestoreIds[0]], "_blank");
    setShowOptions(false);
  };

  const dowloadOptions =
    paymentsHistory?.Payments?.length > 0
      ? [
          {
            label: t("TL_CERTIFICATE"),
            onClick: downloadTLcertificate,
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
      <Card style={{ position: "relative", marginTop: "2rem" }}>
        {application?.map((application, index) => {
          return (
            <div key={index} className="employee-data-table">
              <Row
                className="employee-data-table"
                label={t("TL_COMMON_TABLE_COL_APP_NO")}
                text={application?.applicationNumber}
                textStyle={{ whiteSpace: "pre", border: "none" }}
              />
              <Row label={t("TL_APPLICATION_CATEGORY")} text={t("ACTION_TEST_TRADE_LICENSE")} textStyle={{ whiteSpace: "pre" }} />
              {application?.tradeLicenseDetail.owners.map((ele, index) => {
                return (
                  <Row
                    label={`${t("TL_COMMON_TABLE_COL_OWN_NAME")} ${application?.tradeLicenseDetail.owners.length > 0 ? index : ""}`}
                    text={t(ele.name)}
                    textStyle={{ whiteSpace: "pre" }}
                  />
                );
              })}
              <Row
                style={{ border: "none" }}
                label={t("TL_COMMON_TABLE_COL_TRD_NAME")}
                text={application?.tradeName}
                textStyle={{ whiteSpace: "pre" }}
              />
              <Row
                style={{ border: "none" }}
                label={t("TL_COMMON_TABLE_COL_STATUS")}
                text={t(`WF_NEWTL_${application?.status}`)}
                textStyle={{ whiteSpace: "pre" }}
              />
              <Row
                style={{ border: "none" }}
                label={t("TL_COMMON_TABLE_COL_SLA_NAME")}
                text={`${application?.SLA / (1000 * 60 * 60 * 24)} Days`}
                textStyle={{ whiteSpace: "pre" }}
              />
              {application?.tradeLicenseDetail?.tradeUnits?.map((ele, index) => {
                return (
                  <div key={index}>
                    <Row
                      label={t("TL_NEW_TRADE_DETAILS_TRADE_CAT_LABEL")}
                      text={t(`TRADELICENSE_TRADETYPE_${ele?.tradeType.split(".")[0]}`)}
                      textStyle={{ whiteSpace: "pre" }}
                    />
                    <Row
                      style={{ border: "none" }}
                      label={t("TL_NEW_TRADE_DETAILS_TRADE_TYPE_LABEL")}
                      text={t(`TRADELICENSE_TRADETYPE_${ele?.tradeType.split(".")[1]}`)}
                      textStyle={{ whiteSpace: "pre" }}
                    />
                    <Row
                      style={{ border: "none" }}
                      label={t("TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_LABEL")}
                      text={t(
                        `TRADELICENSE_TRADETYPE_${ele?.tradeType.split(".")[0]}_${ele?.tradeType.split(".")[1]}_${ele?.tradeType
                          .split(".")[2]
                          .split("-")
                          .join("_")}`
                      )}
                      textStyle={{ whiteSpace: "pre" }}
                    />
                  </div>
                );
              })}
              {application?.tradeLicenseDetail?.accessories?.map((ele, index) => {
                return (
                  <div key={index}>
                    <Row
                      style={{ border: "none" }}
                      label={t("TL_REVIEWACCESSORY_TYPE_LABEL")}
                      text={t(`TL_${ele?.accessoryCategory.split("-").join("_")}`)}
                      textStyle={{ whiteSpace: "pre" }}
                    />
                    <Row label={t("TL_NEW_TRADE_ACCESSORY_COUNT_LABEL")} text={ele?.count} textStyle={{ whiteSpace: "pre" }} />
                    <Row label={t("TL_NEW_TRADE_ACCESSORY_UOM_LABEL")} text={ele?.uom} textStyle={{ whiteSpace: "pre" }} />
                    <Row label={t("TL_NEW_TRADE_ACCESSORY_UOMVALUE_LABEL")} text={ele?.uomValue} textStyle={{ whiteSpace: "pre" }} />
                  </div>
                );
              })}
              {application?.tradeLicenseDetail?.owners?.map((ele, index) => {
                return (
                  <div key={index}>
                    <Row
                      style={{ border: "none" }}
                      label={t("TL_NEW_TRADE_ADDRESS_LABEL")}
                      text={ele?.permanentAddress}
                      textStyle={{ whiteSpace: "pre" }}
                    />
                  </div>
                );
              })}
              {application?.status == "PENDINGPAYMENT" ? (
                <Link
                  to={{
                    pathname: `/digit-ui/citizen/payment/collect/${application?.businessService}/${application?.applicationNumber}`,
                    state: { bill, tenantId: state.tenantId },
                  }}
                >
                  <SubmitBar label={t("COMMON_MAKE_PAYMENT")} />
                </Link>
              ) : null}
            </div>
          );
        })}
      </Card>
    </React.Fragment>
  );
};

export default ApplicationDetails;
