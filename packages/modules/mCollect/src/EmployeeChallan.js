import { Card, CardSubHeader, Header, Row, StatusTable, SubmitBar, ActionBar, Menu } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useHistory, useRouteMatch } from "react-router-dom";
import { stringReplaceAll, convertEpochToDate } from "./utils";
import ActionModal from "./components/Modal";
import { downloadAndPrintChallan, downloadAndPrintReciept } from "./utils";

const EmployeeChallan = (props) => {
  const { t } = useTranslation();
  const { challanno } = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [challanBillDetails, setChallanBillDetails] = useState([]);
  const [totalDueAmount, setTotalDueAmount] = useState(0);

  const [displayMenu, setDisplayMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const history = useHistory();
  const { url } = useRouteMatch();
  const [isDisplayDownloadMenu, setIsDisplayDownloadMenu] = useState(false);

  useEffect(() => {
    switch (selectedAction) {
      case "CANCEL_CHALLAN":
        return setShowModal(true);
      case "UPDATE_CHALLAN":
        return history.push("/digit-ui/employee/fsm/modify-application/" + challanno);
      default:
        console.log("default case");
        break;
    }
  }, [selectedAction]);

  function onActionSelect(action) {
    setSelectedAction(action);
    setDisplayMenu(false);
  }

  const closeModal = () => {
    setSelectedAction(null);
    setShowModal(false);
  };

  const submitAction = (data) => {
    Digit.MCollectService.update({ Challan: data?.Challan }, tenantId).then((result) => {
      if (result.challans && result.challans.length > 0) {
        const challan = result.challans[0];
        history.push(
          `/digit-ui/employee/mcollect/acknowledgement?purpose=challan&status=success&tenantId=${challan?.tenantId}&serviceCategory=${challan.businessService}&challanNumber=${challan.challanNo}&applicationStatus=${challan.applicationStatus}`,
          { from: url }
        );
        // const challan = result.challans[0];
        // Digit.MCollectService.generateBill(challan.challanNo, tenantId, challan.businessService, "challan").then((response) => {
        //   if (response.Bill && response.Bill.length > 0) {

        //   }
        // });
      }
    });
    closeModal();
  };

  const { isLoading, isError, error, data, ...rest } = Digit.Hooks.mcollect.useMCollectSearch({ tenantId, filters: { challanNo: challanno } });
  var challanDetails = data?.challans?.filter(function (item) {
    return item.challanNo === challanno;
  })[0];
  let billDetails = [];
  useEffect(() => {
    async function fetchMyAPI() {
      billDetails = [];
      let res = await Digit.PaymentService.searchBill(tenantId, {
        consumerCode: data?.challans[0]?.challanNo,
        service: data?.challans[0]?.businessService,
      });
      res?.Bill[0]?.billDetails[0]?.billAccountDetails?.map((bill) => {
        billDetails.push(bill);
      });
      setTotalDueAmount(res?.Bill[0]?.totalAmount);
      setChallanBillDetails(billDetails);
      console.log(res, "resresresres");
    }
    if (data?.challans && data?.challans?.length > 0) {
      fetchMyAPI();
    }
  }, [data]);

  const workflowActions = ["CANCEL_CHALLAN", "UPDATE_CHALLAN"];

  function onDownloadActionSelect(action) {
    action == "CHALLAN" ? downloadAndPrintChallan(challanno) : downloadAndPrintReciept(challanDetails?.businessService, challanno);
  }

  return (
    <React.Fragment>
      <div style={{ width: "100%", fontFamily: "calibri", color: "#FF0000", display: "flex", justifyContent: "space-between" }}>
        <Header>{`${t("CHALLAN_DETAILS")}`} </Header>
        <div>
          <SubmitBar label={t("TL_DOWNLOAD")} onSubmit={() => setIsDisplayDownloadMenu(!isDisplayDownloadMenu)} />
          {isDisplayDownloadMenu ? (
            <div
              style={{
                boxShadow: "0 8px 10px 1px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%), 0 5px 5px -3px rgb(0 0 0 / 20%)",
                height: "auto",
                backgroundColor: "#fff",
                textAlign: "left",
                marginBottom: "4px",
                width: "240px",
                padding: "0px 10px",
                lineHeight: "30px",
                cursor: "pointer",
                position: "absolute",
                color: "black",
                fontSize: "18px",
              }}
            >
              <Menu
                localeKeyPrefix="UC"
                options={challanDetails?.applicationStatus === "PAID" ? ["CHALLAN", "RECEIPT"] : ["CHALLAN"]}
                t={t}
                onSelect={onDownloadActionSelect}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <Card>
          <CardSubHeader>
            {t("UC_CHALLAN_NO")} : {challanno}{" "}
          </CardSubHeader>
          <hr style={{ width: "34%", border: "1px solid #D6D5D4" }} />
          <StatusTable style={{ padding: "10px 0px" }}>
            {challanBillDetails?.map((data) => {
              return <Row label={t(stringReplaceAll(data?.taxHeadCode, ".", "_"))} text={`₹${data?.amount}`} textStyle={{ whiteSpace: "pre" }} />;
            })}
            <hr style={{ width: "34%", border: "1px solid #D6D5D4" }} />
            <Row label={<b style={{ padding: "10px 0px" }}>{t("UC_TOTAL_DUE_AMOUT_LABEL")}</b>} text={`₹${totalDueAmount}`} />
          </StatusTable>
          <CardSubHeader>{t("UC_SERVICE_DETAILS_LABEL")}</CardSubHeader>
          <StatusTable>
            <Row
              label={`${t("UC_SERVICE_CATEGORY_LABEL")}:`}
              text={`${t(`BILLINGSERVICE_BUSINESSSERVICE_${stringReplaceAll(challanDetails?.businessService?.toUpperCase(), ".", "_")}`)}`}
              textStyle={{ whiteSpace: "pre" }}
            />
            <Row label={`${t("UC_FROM_DATE_LABEL")}:`} text={convertEpochToDate(challanDetails?.taxPeriodFrom)} />
            <Row label={`${t("UC_TO_DATE_LABEL")}:`} text={convertEpochToDate(challanDetails?.taxPeriodTo)} />
            <Row label={`${t("UC_COMMENT_LABEL")}:`} text={`${challanDetails?.description}` || "NA"} />
            <Row label={`${t("CS_INBOX_STATUS_FILTER")}:`} text={t(`UC_${challanDetails?.applicationStatus}`)} />
          </StatusTable>
          <CardSubHeader>{t("UC_CONSUMER_DETAILS_LABEL")}</CardSubHeader>
          <StatusTable>
            <Row label={`${t("UC_CONS_NAME_LABEL")}:`} text={challanDetails?.citizen.name} />
            <Row label={`${t("UC_MOBILE_NUMBER")}:`} text={challanDetails?.citizen.mobileNumber} />
            <Row label={`${t("UC_DOOR_NO_LABEL")}:`} text={challanDetails?.address.doorNo} />
            <Row label={`${t("UC_BUILDING_NAME_LABEL")}:`} text={challanDetails?.address.buildingName} />
            <Row label={`${t("UC_STREET_NAME_LABEL")}:`} text={challanDetails?.address.street} />
            <Row
              label={`${t("UC_MOHALLA_LABEL")}:`}
              text={`${t(
                `${stringReplaceAll(challanDetails?.address?.tenantId?.toUpperCase(), ".", "_")}_REVENUE_${challanDetails?.address?.locality?.code}`
              )}`}
            />
          </StatusTable>
        </Card>
      </div>
      {showModal ? (
        <ActionModal
          t={t}
          action={selectedAction}
          // tenantId={tenantId}
          // state={state}
          // id={applicationNumber}
          applicationData={challanDetails}
          billData={challanBillDetails}
          closeModal={closeModal}
          submitAction={submitAction}
          // actionData={workflowDetails?.data?.timeline}
          // businessService={businessService}
        />
      ) : null}
      {challanDetails?.applicationStatus == "ACTIVE" && (
        <ActionBar>
          {displayMenu && workflowActions ? <Menu localeKeyPrefix="UC" options={workflowActions} t={t} onSelect={onActionSelect} /> : null}
          <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
        </ActionBar>
      )}
    </React.Fragment>
  );
};

export default EmployeeChallan;
