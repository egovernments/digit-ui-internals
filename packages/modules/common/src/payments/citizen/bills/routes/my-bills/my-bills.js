import React, { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Header, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";

import MyBill from "./my-bill";

export const BillList = ({ billsList, currentPath, businessService }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const consumerCodes = billsList.map((bill) => bill.consumerCode);
  // const { mobileNumber } = Digit.UserService.getUser()?.info;

  const searchResult = Digit.Hooks.useApplicationsForBusinessServiceSearch({ filters: { consumerCodes: consumerCodes.join() }, businessService });

  /*
  call the relevant business search and find what key is being used as consumerCode in bills it is as follows :-

  FSM -> applicationNo
  PT -> propertyId

  */

  const keyForConsumerCode = searchResult.key;

  const [applicationList, setApplicationList] = useState([]);
  const [getKeyNotesConfig, setConfig] = useState(() => Digit.ComponentRegistryService?.getComponent("getBillDetailsConfigWithBusinessService"));
  const billableApplicationsObj = useMemo(() => ({}), []);
  const billsListObj = useMemo(() => ({}), []);

  useEffect(() => {
    if (searchResult.data) searchResult.refetch();
  }, []);

  useEffect(() => {
    if (searchResult.data) {
      const billableApps = searchResult.data.filter((property) => consumerCodes.includes(property[keyForConsumerCode]));
      const billableIDs = billableApps.map((e) => e[keyForConsumerCode]);

      billableApps.forEach((app) => {
        billableApplicationsObj[app[keyForConsumerCode]] = app;
      });

      //console.log("from PT", billableProps);

      billsList.forEach((bill) => {
        billsListObj[bill.consumerCode] = bill;
      });
      //console.log("from PT", billsListObj);

      const newBillsList = billableIDs.map((e) => ({ ...billsListObj[e], ...billableApplicationsObj[e] }));
      //console.log(newBillsList);
      setApplicationList(newBillsList);
    }
  }, [searchResult.data, getKeyNotesConfig]);

  if (searchResult.isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <div className="static">
        <div className="static-wrapper">
          <Header>{t("CS_TITLE_MY_BILLS") + ` (${applicationList.length})`}</Header>
          {applicationList?.length > 0 &&
            getKeyNotesConfig &&
            applicationList.map((bill, index) => (
              <div key={index}>
                <MyBill {...{ bill, currentPath, businessService, getKeyNotesConfig }} />
              </div>
            ))}
          {!applicationList?.length > 0 && <p style={{ paddingLeft: "16px" }}>{t("CS_BILLS_TEXT_NO_BILLS_FOUND")}</p>}
        </div>
        {/* {businessService === "PT" && (
          <p style={{ marginLeft: "16px", marginTop: "16px" , position:"fixed" , }}>
            {t("PT_TEXT_NOT_ABLE_TO_FIND_THE_PROPERTY")}
            <span className="link">
              <Link to="/digit-ui/citizen/pt/property/search">{t("PT_COMMON_CLICK_HERE")}</Link>
            </span>
          </p>
        )} */}
      </div>
    </React.Fragment>
  );
};
