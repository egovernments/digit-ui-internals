import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRightInbox, PropertyHouse } from "@egovernments/digit-ui-react-components";
import { checkForEmployee } from "../utils";

const ArrowRight = ({ to }) => (
    <Link to={to}>
        <ArrowRightInbox />
    </Link>
);

const TLCard = () => {
    const { t } = useTranslation();
    // TODO: should be fetch
    const total = 1;
    const tenantId = Digit.ULBService.getCurrentTenantId();
    //const { isLoading: hookLoading, isError, error, data: count, ...rest } = Digit.Hooks.tl.useTradeLicenseWorkFlowCount(tenantId);
    let count =10;

    const isCounterEmployee = checkForEmployee("TL_CEMP");

    return (
        <div className="employeeCard card-home" style={{ display: "inline-block" }}>
            <div className="complaint-links-container">
                <div className="header">
                    <span className="logo">
                        <svg width="24" height="24" viewBox="0 0 34 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30.3333 6.99967H23.6667V3.66634C23.6667 1.81634 22.1833 0.333008 20.3333 0.333008H13.6667C11.8167 0.333008 10.3333 1.81634 10.3333 3.66634V6.99967H3.66667C1.81667 6.99967 0.350001 8.48301 0.350001 10.333L0.333334 28.6663C0.333334 30.5163 1.81667 31.9997 3.66667 31.9997H30.3333C32.1833 31.9997 33.6667 30.5163 33.6667 28.6663V10.333C33.6667 8.48301 32.1833 6.99967 30.3333 6.99967ZM20.3333 6.99967H13.6667V3.66634H20.3333V6.99967Z" fill="white" />
                        </svg>

                    </span>
                    <span className="text">{t("TL")}</span>
                </div>
                <div className="body" style={{ margin: "0px", padding: "0px" }}>
                    <div
                        className="flex-fit"
                        style={{
                            borderBottom: "1px solid #d6d5d4",
                            padding: "15px 10px 10px",
                            width: "100%",
                            paddingLeft: "3rem",
                            paddingBottom: "1rem",
                        }}
                    >
                        <div className="card-count">
                            <div>
                                <span style={{ fontWeight: "800" }}>{" " + 0 || "-"}</span>
                            </div>
                            <div>
                                <Link to={`/digit-ui/employee/tl/inbox`}>{t("TOTAL_TL")}</Link>
                            </div>
                        </div>
                        <div>
                            <div>
                                <span style={{ fontWeight: "800" }}>{" " + 0 || "-"}</span>
                            </div>
                            <div>
                                <Link to={`/digit-ui/employee/tl/inbox`}>{t("TOTAL_NEARING_SLA")}</Link>
                            </div>
                        </div>
                    </div>
                    <div style={{ paddingLeft: "3rem", paddingBottom: "1rem" }}>
                        <span className="link">
                            <Link to={`/digit-ui/employee/tl/inbox`}>{t("ES_TITLE_INBOX")}</Link>
                            <span className="inbox-total">{" " + count || "-"}</span>
                            {<ArrowRight to={`/digit-ui/employee/tl/inbox`} />}
                        </span>
                        {
                            isCounterEmployee ? <span className="link">
                                <Link to={`/digit-ui/employee/tl/new-application`}>{t("TL_NEW_TRADE_LICENSE_HEADER")}</Link>
                            </span> : ""
                        }
                        <span className="link">
                            <Link to={`/digit-ui/employee/tl/renewal`}>{t("TL_COMMON_RENEW_LIC")}</Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TLCard;

