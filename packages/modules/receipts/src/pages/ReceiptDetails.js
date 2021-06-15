import { Card, CardSubHeader, Header, Loader, Row, SubmitBar, ActionBar, Menu, StatusTable } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router-dom";
import ActionModal from "../components/Modal";
import { convertEpochFormateToDate, pdfDownloadLink, pdfDocumentName } from "../components/Utils";

const Details = () => {
  const PDFSvg = ({ width = 20, height = 20, style }) => (
    <svg style={style} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 20" fill="gray">
      <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
    </svg>
  );

  const activeworkflowActions = ["DEACTIVATE_EMPLOYEE_HEAD", "COMMON_EDIT_EMPLOYEE_HEADER"];
  const deactiveworkflowActions = ["ACTIVATE_EMPLOYEE_HEAD", "COMMON_EDIT_EMPLOYEE_HEADER"];
  const [selectedAction, setSelectedAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const { id: employeeId } = useParams();
  const history = useHistory();
  const [displayMenu, setDisplayMenu] = useState(false);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { isLoading, isError, error, data, ...rest } = Digit.Hooks.hrms.useHRMSSearch({ codes: employeeId }, tenantId);

  function onActionSelect(action) {
    setSelectedAction(action);
    setDisplayMenu(false);
  }

  const closeModal = () => {
    setSelectedAction(null);
    setShowModal(false);
  };

  const submitAction = (data) => {};

  useEffect(() => {
    switch (selectedAction) {
      case "DEACTIVATE_EMPLOYEE_HEAD":
        return setShowModal(true);
      case "ACTIVATE_EMPLOYEE_HEAD":
        return setShowModal(true);
      case "COMMON_EDIT_EMPLOYEE_HEADER":
        return history.push(`/digit-ui/employee/hrms/edit/${employeeId}`);
      default:
        break;
    }
  }, [selectedAction]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <div style={{ width: "30%", fontFamily: "calibri", color: "#FF0000" }}>
        <Header>{t("HR_NEW_EMPLOYEE_FORM_HEADER")}</Header>
      </div>
      {!isLoading && data?.Employees.length > 0 ? (
        <div style={{ maxHeight: "calc(100vh - 12em)", margin: "30px" }}>
          <Card>
            <StatusTable>
              <Row
                label={<CardSubHeader>{t("HR_EMP_STATUS_LABEL")} </CardSubHeader>}
                text={
                  data?.Employees?.[0]?.isActive ? <div className="sla-cell-success"> Active </div> : <div className="sla-cell-error">Inactive</div>
                }
                textStyle={{ fontWeight: "bold", maxWidth: "6.5rem" }}
              />
            </StatusTable>
            <CardSubHeader>{t("HR_PERSONAL_DETAILS_FORM_HEADER")} </CardSubHeader>
            <StatusTable>
              <Row label={t("HR_NAME_LABEL")} text={data?.Employees?.[0]?.user?.userName} textStyle={{ whiteSpace: "pre" }} />
              <Row label={t("HR_MOB_NO_LABEL")} text={data?.Employees?.[0]?.user?.mobileNumber} textStyle={{ whiteSpace: "pre" }} />
              <Row label={t("HR_GENDER_LABEL")} text={data?.Employees?.[0]?.user?.gender} />
              <Row label={t("HR_EMAIL_LABEL")} text={data?.Employees?.[0]?.user?.emailId} />
              <Row label={t("HR_CORRESPONDENCE_ADDRESS_LABEL")} text={data?.Employees?.[0]?.user?.correspondenceAddress} />
            </StatusTable>
            <CardSubHeader>{t("Employee Details")}</CardSubHeader>
            <StatusTable>
              <Row label={t("HR_EMPLOYMENT_TYPE_LABEL")} text={data?.Employees?.[0]?.employeeType} textStyle={{ whiteSpace: "pre" }} />
              <Row
                label={t("HR_APPOINTMENT_DATE_LABEL")}
                text={convertEpochFormateToDate(data?.Employees?.[0]?.dateOfAppointment)}
                textStyle={{ whiteSpace: "pre" }}
              />
              <Row label={t("HR_EMPLOYEE_ID_LABEL")} text={data?.Employees?.[0]?.id} />
            </StatusTable>
            <StatusTable>
              <Row label={t("HR_EMPLOYMENT_TYPE_LABEL")} text={data?.Employees?.[0]?.employeeType} textStyle={{ whiteSpace: "pre" }} />
               </StatusTable>
             {(data?.Employees?.[0]?.isActive) == false  ? <StatusTable>
              <Row label={t("HR_EFFECTIVE_DATE")} text={convertEpochFormateToDate(data?.Employees?.[0]?.deactivationDetails?.sort((a, b) => new Date(a.effectiveFrom) - new Date(b.effectiveFrom))[0]?.effectiveFrom)} />
                 <Row label={t("HR_DEACTIVATION_REASON")} text={(data?.Employees?.[0]?.deactivationDetails?.sort((a, b) => new Date(a.effectiveFrom) - new Date(b.effectiveFrom))[0].reasonForDeactivation)} />
             <Row label={t("HR_ORDER_NO")} text={(data?.Employees?.[0]?.deactivationDetails?.sort((a, b) => new Date(a.effectiveFrom) - new Date(b.effectiveFrom))[0]?.orderNo)} />
             </StatusTable>: null }


            <StatusTable>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {data?.Employees?.[0]?.documents?.map((document, index) => {
                  // let documentLink = pdfDownloadLink(data.pdfFiles, document?.fileStoreId);
                  // console.log(documentLink)
                  return (
                    <a target="_" href={""} style={{ minWidth: "160px" }} key={index}>
                      <PDFSvg width={85} height={100} style={{ background: "#f6f6f6", padding: "8px" }} />
                      <p style={{ marginTop: "8px" }}>{document.documentName}</p>
                    </a>
                  );
                })}
              </div>
            </StatusTable>

            {data?.Employees?.[0]?.jurisdictions.length > 0 ? <CardSubHeader>{t("HR_JURIS_DET_HEADER")}</CardSubHeader> : null}

            {data?.Employees?.[0]?.jurisdictions?.length > 0
              ? data?.Employees?.[0]?.jurisdictions.map((element, index) => {
                  return (
                    <StatusTable key={index} style={{maxWidth: "640px", border: "1px solid rgb(214, 213, 212)", inset: "0px", width: "auto", padding:'.2rem', marginBottom: "2rem"}}>
                      <div style={{ paddingBottom: "2rem" }}> {t("HR_JURISDICTION")} {index + 1}</div>
                      <Row label={t("HR_HIERARCHY_LABEL")} text={element?.hierarchy} textStyle={{ whiteSpace: "pre" }} />
                      <Row label={t("HR_BOUNDARY_TYPE_LABEL")} text={element?.boundaryType} textStyle={{ whiteSpace: "pre" }} />
                      <Row label={t("HR_BOUNDARY_LABEL")} text={element?.boundary} />
                      <Row
                        label={t("HR_ROLE_LABEL")}
                        text={data?.Employees?.[0]?.user.roles.filter((ele) => ele.tenantId == element?.boundary).map((ele) => ele.name)}
                      />
                    </StatusTable>
                  );
                })
              : null}
            {data?.Employees?.[0]?.assignments.length > 0 ? <CardSubHeader>{t("HR_ASSIGN_DET_HEADER")}</CardSubHeader> : null}
            {data?.Employees?.[0]?.assignments.map((element, index) => (
              <StatusTable key={index} style={{maxWidth: "640px", border: "1px solid rgb(214, 213, 212)", inset: "0px", width: "auto", padding:'.2rem', marginBottom: "2rem"}}>
                <div style={{ paddingBottom: "2rem" }}>{t("HR_ASSIGNMENT")} {index + 1}</div>
                <Row label={t("HR_ASMT_FROM_DATE_LABEL")} text={convertEpochFormateToDate(element?.fromDate)} textStyle={{ whiteSpace: "pre" }} />
                <Row
                  label={t("HR_ASMT_TO_DATE_LABEL")}
                  text={element?.isCurrentAssignment ? "Currently Working Here" : convertEpochFormateToDate(element?.toDate)}
                  textStyle={{ whiteSpace: "pre" }}
                />
                <Row label={t("HR_DEPT_LABEL")} text={t("COMMON_MASTERS_DEPARTMENT_" + element?.department)} />
                <Row label={t("HR_HOD_SWITCH_LABEL")} text={element?.isHOD ? element?.isHOD : "NA"} />
              </StatusTable>
            ))}
          </Card>
        </div>
      ) : null}
      {showModal ? (
        <ActionModal t={t} action={selectedAction} tenantId={tenantId} applicationData={data} closeModal={closeModal} submitAction={submitAction} />
      ) : null}
      <ActionBar>
        {displayMenu && data ? (
          <Menu
            localeKeyPrefix="HR"
            options={data?.Employees?.[0]?.isActive ? activeworkflowActions : deactiveworkflowActions}
            t={t}
            onSelect={onActionSelect}
          />
        ) : null}
        <SubmitBar label={t("HR_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
      </ActionBar>
    </React.Fragment>
  );
};

export default Details;
