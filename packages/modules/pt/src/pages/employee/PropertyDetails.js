import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";
import OwnerHistory from "./PropertyMutation/ownerHistory";

import { useParams, useHistory, Link } from "react-router-dom";
import { Header, Loader, LinkLabel, Modal } from "@egovernments/digit-ui-react-components";
import _ from "lodash";

const Close = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick}>
      <Close />
    </div>
  );
};

const PropertyDetails = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { id: applicationNumber } = useParams();
  const [showToast, setShowToast] = useState(null);
  const [appDetailsToShow, setAppDetailsToShow] = useState({});
  const [enableAudit, setEnableAudit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  let { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.pt.useApplicationDetail(t, tenantId, applicationNumber);
  const { data: fetchBillData, isLoading: fetchBillLoading } = Digit.Hooks.useFetchBillsForBuissnessService({
    businessService: "PT",
    consumerCode: applicationNumber,
  });

  const { isLoading: auditDataLoading, isError: isAuditError, data: auditData } = Digit.Hooks.pt.usePropertySearch(
    {
      tenantId,
      filters: { propertyIds: applicationNumber, audit: true },
    },
    { enabled: enableAudit, select: (data) => data.Properties.filter((e) => e.status === "ACTIVE") }
  );

  useEffect(() => {
    if (applicationDetails) {
      setAppDetailsToShow(_.cloneDeep(applicationDetails));
      if (applicationDetails?.applicationData?.status !== "ACTIVE" && applicationDetails?.applicationData?.creationReason === "MUTATION") {
        setEnableAudit(true);
      }
    }
  }, [applicationDetails]);

  useEffect(() => {
    if (auditData && Object.keys(appDetailsToShow).length) {
      let owners = auditData[0].owners.filter((e) => e.status === "ACTIVE");
      let applicationDetails = appDetailsToShow.applicationDetails.map((obj) => {
        const { additionalDetails, title } = obj;
        if (title === "PT_OWNERSHIP_INFO_SUB_HEADER") {
          additionalDetails.owners = owners?.map((owner, index) => {
            return {
              status: owner.status,
              title: "ES_OWNER",
              values: [
                { title: "PT_OWNERSHIP_INFO_NAME", value: owner?.name },
                { title: "PT_OWNERSHIP_INFO_GENDER", value: owner?.gender },
                { title: "PT_OWNERSHIP_INFO_MOBILE_NO", value: owner?.mobileNumber },
                { title: "PT_OWNERSHIP_INFO_USER_CATEGORY", value: `COMMON_MASTERS_OWNERTYPE_${owner?.ownerType}` || "NA" },
                { title: "PT_SEARCHPROPERTY_TABEL_GUARDIANNAME", value: owner?.fatherOrHusbandName },
                { title: "PT_FORM3_OWNERSHIP_TYPE", value: auditData[0]?.ownershipCategory },
                { title: "PT_OWNERSHIP_INFO_EMAIL_ID", value: owner?.emailId },
                { title: "PT_OWNERSHIP_INFO_CORR_ADDR", value: owner?.permanentAddress },
              ],
            };
          });

          additionalDetails.documents = [
            {
              title: "PT_COMMON_DOCS",
              values: auditData[0].documents
                .filter((e) => e.status === "ACTIVE")
                .map((document) => {
                  return {
                    title: `PT_${document?.documentType.replace(".", "_")}`,
                    documentType: document?.documentType,
                    documentUid: document?.documentUid,
                    fileStoreId: document?.fileStoreId,
                    status: document.status,
                  };
                }),
            },
          ];

          return { ...obj, additionalDetails };
        }
        return obj;
      });

      setAppDetailsToShow({ ...appDetailsToShow, applicationDetails });
    }
  }, [auditData]);

  let workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: applicationDetails?.tenantId || tenantId,
    id: applicationDetails?.applicationData?.acknowldgementNumber,
    moduleCode: "PT.UPDATE",
    role: "PT_CEMP",
  });

  const closeToast = () => {
    setShowToast(null);
  };

  if (appDetailsToShow?.applicationDetails) {
    appDetailsToShow.applicationDetails = appDetailsToShow?.applicationDetails?.map((e) => {
      if (e.title === "PT_OWNERSHIP_INFO_SUB_HEADER") {
        return {
          ...e,
          Component: () => (
            <LinkLabel onClick={() => setShowModal((prev) => !prev)} style={{ display: "inline", marginLeft: "25px" }}>
              {t("PT_VIEW_HISTORY")}
            </LinkLabel>
          ),
        };
      }
      return e;
    });
  }
  if (appDetailsToShow?.applicationDetails?.[0]?.values?.[1].title !== "PT_TOTAL_DUES") {
    appDetailsToShow?.applicationDetails?.unshift({
      values: [
        {
          title: "PT_PROPERTY_PTUID",
          value: applicationNumber,
        },
        {
          title: "PT_TOTAL_DUES",
          value: fetchBillData?.Bill[0]?.totalAmount ? `₹ ${fetchBillData?.Bill[0]?.totalAmount}` : "N/A",
        },
      ],
    });
  }

  if (applicationDetails?.applicationData?.status === "ACTIVE") {
    workflowDetails = {
      ...workflowDetails,
      data: {
        ...workflowDetails?.data,
        actionState: {
          nextActions: [
            {
              action: "ASSESS_PROPERTY",
              showFinancialYearsModal: true,
              customFunctionToExecute: (data) => {
                delete data.customFunctionToExecute;
                history.push({ pathname: `/digit-ui/employee/pt/assessment-details/${applicationNumber}`, state: { ...data } });
              },
              tenantId: "pb",
            },
            {
              action: !fetchBillData?.Bill[0]?.totalAmount ? "MUTATE_PROPERTY" : "PT_TOTALDUES_PAY",
              redirectionUrl: {
                pathname: !fetchBillData?.Bill[0]?.totalAmount
                  ? `/digit-ui/employee/pt/property-mutate-docs-required/${applicationNumber}`
                  : `/digit-ui/employee/payment/collect/PT/${applicationNumber}`,
                // state: { workflow: { action: "OPEN", moduleName: "PT", businessService } },
                state: null,
              },
              tenantId: "pb",
            },
          ],
        },
      },
    };
  }

  if (fetchBillLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Header>{t("PT_PROPERTY_INFORMATION")}</Header>
      <ApplicationDetailsTemplate
        applicationDetails={appDetailsToShow}
        isLoading={isLoading}
        isDataLoading={isLoading}
        applicationData={appDetailsToShow?.applicationData}
        mutate={null}
        workflowDetails={workflowDetails}
        businessService="PT"
        showToast={showToast}
        setShowToast={setShowToast}
        closeToast={closeToast}
        timelineStatusPrefix={"ES_PT_COMMON_STATUS_"}
        forcedActionPrefix={"WF_EMPLOYEE_PT.CREATE"}
      />
      {showModal ? (
        <Modal
          headerBarEnd={<CloseBtn onClick={() => setShowModal(false)} />}
          hideSubmit={true}
          isDisabled={false}
          popupStyles={{ width: "75%", marginTop: "75px" }}
        >
          <OwnerHistory propertyId={applicationNumber} userType={"employee"} />
        </Modal>
      ) : null}
    </div>
  );
};

export default PropertyDetails;
