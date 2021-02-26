import { Card } from "@egovernments/digit-ui-react-components";
import { forEach } from "lodash";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FSMLink = ({ isMobile, data }) => {
  const { t } = useTranslation();
  const user = Digit.UserService.getUser();
  const roleCodes = user?.info?.roles?.map((role) => role?.code);

  const allLinks = [
    {
      text: t("ES_TITLE_NEW_DESULDGING_APPLICATION"),
      link: "/digit-ui/employee/fsm/new-application",
      accessTo: ["FSM_CREATOR_EMP"],
    },
    // { text: t("ES_TITLE_REPORTS"), link: "/employee" },
    { text: t("ES_TITLE_DASHBOARD"), link: DSO ? "/digit-ui/citizen/fsm/dso-dashboard" : "/employee", hyperlink: !DSO },
    { text: t("ES_TITILE_SEARCH_APPLICATION"), link: "/digit-ui/employee/fsm/search" }
  ];

  const [links, setLinks] = useState([]);

  // const { roles } = Digit.UserService.getUser().info;

  const hasAccess = (accessTo) => {
    // return roles.filter((role) => accessTo.includes(role.code)).length;
  };

  useEffect(() => {
    let linksToShow = [];
    allLinks.forEach((link) => {
      // if (link.accessTo) {
      //   if (hasAccess(link.accessTo)) {
      //     linksToShow.push(link);
      //   }
      // } else {
      linksToShow.push(link);
      // }
    });
    setLinks(linksToShow);
  }, []);

  // useEffect(() => {
  //   if (isMobile) {
  //     const mobileLinks = links.filter((link) => {
  //       return link.text !== t("ES_DASHBOARD");
  //     });
  //     setLinks(mobileLinks);
  //   }
  // }, []);

  const GetLogo = () => (
    <div className="header">
      <span className="logo">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" fill="white" />
        </svg>
      </span>{" "}
      <span className="text">{t("ES_TITLE_FAECAL_SLUDGE_MGMT")}</span>
    </div>
  );

  return (
    <Card style={{ paddingRight: 0, marginTop: 0 }} className="employeeCard filter">
      <div className="complaint-links-container">
        {GetLogo()}
        <div className="body">
          {links.map(({ link, text, hyperlink = false, accessTo = [] }, index) => {
            let access = false;
            accessTo.forEach((role) => {
              if (roleCodes?.includes(role)) access = true;
            });
            if (access) {
              return (
                <span className="link" key={index}>
                  {hyperlink ? <a href={link}>{text}</a> : <Link to={link}>{text}</Link>}
                </span>
              );
            }
          })}
        </div>
      </div>
    </Card>
  );
};

export default FSMLink;
