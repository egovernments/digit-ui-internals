import { Card, CardSubHeader, Header, LinkButton, Loader, Row, StatusTable } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { getFixedFilename } from "../../../utils";
import { propertyCardBodyStyle } from "../../../utils";

const propertyOwnerHistory = () => {
    const { t } = useTranslation();
    const { propertyIds } = useParams();
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const audit = true;
    const { isLoading, isError, error, data } = Digit.Hooks.pt.usePropertySearch({ tenantId, filters: { propertyIds, audit } });

    let properties = data?.Properties || " ";
    let ownershipInfo = [];

    const getUniqueList = (list = []) => {
        let newList = [];
        list.map(element => {
            if (!JSON.stringify(newList).includes(JSON.stringify(element.acknowldgementNumber))) {
                newList.push(element);
            }
        })
        return newList && Array.isArray(newList) && newList.filter(element => element.creationReason != 'UPDATE');
    }

    if (properties && Array.isArray(properties) && properties.length > 0) {
        properties = getUniqueList(properties);
        properties && properties.length > 0 && properties.map((indProperty) => {
            let lastModifiedDate = indProperty.auditDetails.lastModifiedTime;
            indProperty.owners = indProperty.owners.filter(owner => owner.status == "ACTIVE")
            const { owners, institution, ownershipCategory } = indProperty;
            ownershipInfo = [];
            owners.map(item => {
                if (institution) {
                    ownershipInfo.push({
                        name: institution.name || "NA",
                        designation: institution.designation || "NA",
                        type: institution.type || "NA",
                        ownershipCategory: `PROPERTYTAX_BILLING_SLAB_${ownershipCategory.split(".")[0]}` || "NA",
                        nameOfAuthorizedPerson: institution.nameOfAuthorizedPerson || "NA",
                        altContactNumber: item.altContactNumber || "NA",
                        emailId: item.emailId || "NA",
                        mobileNumber: item.mobileNumber || "NA",
                        correspondenceAddress: item.correspondenceAddress || "NA",
                        institution: true,
                        lastModifiedDate: lastModifiedDate
                    });
                } else {
                    ownershipInfo.push({
                        name: item.name || "NA",
                        fatherOrHusbandName: item.fatherOrHusbandName || "NA",
                        gender: item.gender || "NA",
                        mobileNumber: item.mobileNumber || "NA",
                        emailId: item.emailId || "NA",
                        ownerType: item.ownerType || "NA",
                        permanentAddress: item.permanentAddress || "NA",
                        lastModifiedDate: lastModifiedDate,
                        ownershipCategory: `PROPERTYTAX_BILLING_SLAB_${ownershipCategory.split(".")[1]}` || "NA",
                    })
                }
            });

        });
    }

    if (isLoading) {
        return <Loader />;
    }
    return (
        <React.Fragment>
            <Header>{t("PT_PROPERTY_INFORMATION")}</Header>
            <div style={{ ...propertyCardBodyStyle, maxHeight: "calc(100vh - 10em)" }}>
                <Card>
                    <CardSubHeader>{t("PT_COMMON_PROPERTY_OWNERSHIP_DETAILS_HEADER")}</CardSubHeader>
                    <div>
                        {Array.isArray(ownershipInfo) && ownershipInfo.length > 0 &&
                            ownershipInfo.map((owner, index) => (
                                <div>
                                    {!owner.institution ? <div>
                                        <CardSubHeader>
                                            {t("PT_OWNER_SUB_HEADER")} - {index + 1}
                                        </CardSubHeader>
                                        <StatusTable>
                                            <Row label={t("PT_OWNER_NAME")} text={`${owner?.name || "NA"}`} />
                                            <Row label={t("PT_FORM3_GENDER")} text={`${owner?.gender ? owner?.gender.toLowerCase() : "NA"}`} />
                                            <Row label={t("PT_FORM3_MOBILE_NUMBER")} text={`${t(owner?.mobileNumber)}` || "NA"} />
                                            <Row label={t("PT_FORM3_GUARDIAN_NAME")} text={`${owner?.fatherOrHusbandName || "NA"}`} />
                                            <Row label={t("PT_FORM3_RELATIONSHIP")} text={`${owner?.relationship || "NA"}`} />
                                            <Row label={t("PT_SPECIAL_OWNER_CATEGORY")} text={`${t(owner?.ownerType).toLowerCase()}` || "NA"} />
                                            <Row label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={`${t(owner?.correspondenceAddress)}` || "NA"} />
                                            <Row label={t("PT_FORM3_OWNERSHIP_TYPE")} text={`${t(owner?.ownershipCategory) || "NA"}`} />
                                        </StatusTable>
                                    </div> : <div>
                                        <StatusTable>
                                            <Row label={t("PT_COMMON_INSTITUTION_NAME")} text={`${owner?.name || "NA"}`} />
                                            <Row label={t("PT_TYPE_OF_INSTITUTION")} text={`${owner?.type ? owner?.type.toLowerCase() : "NA"}`} />
                                            <Row label={t("PT_OWNER_NAME")} text={`${t(owner?.nameOfAuthorizedPerson)}` || "NA"} />
                                            <Row label={t("PT_COMMON_AUTHORISED_PERSON_DESIGNATION")} text={`${owner?.designation || "NA"}`} />
                                            <Row label={t("PT_FORM3_MOBILE_NUMBER")} text={`${t(owner?.mobileNumber)}` || "NA"} />
                                            <Row label={t("PT_OWNERSHIP_INFO_TEL_PHONE_NO")} text={`${t(owner?.altContactNumber)}`} />
                                            <Row label={t("PT_FORM3_EMAIL_ID")} text={`${t(owner?.emailId).toLowerCase()}` || "NA"} />
                                            <Row label={t("PT_OWNERSHIP_INFO_CORR_ADDR")} text={`${t(owner?.correspondenceAddress)}` || "NA"} />
                                            <Row label={t("PT_FORM3_OWNERSHIP_TYPE")} text={`${t(owner?.ownershipCategory) || "NA"}`} />
                                        </StatusTable>
                                    </div>}
                                </div>
                            ))}
                    </div>
                </Card>
            </div>
        </React.Fragment>
    );
};

export default propertyOwnerHistory;
