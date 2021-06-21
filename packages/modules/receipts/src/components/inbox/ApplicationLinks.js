import { Card } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const InboxLinks = ({ parentRoute, businessService, allLinks, headerText }) => {
  const { t } = useTranslation();

  const [links, setLinks] = useState([]);

  const { roles: userRoles } = Digit.UserService.getUser().info;

  useEffect(() => {
    let linksToShow = allLinks
      .filter((e) => e.businessService === businessService)
      .filter(({ roles }) => roles.some((e) => userRoles.map(({ code }) => code).includes(e)) || !roles.length);
    setLinks(linksToShow);
  }, []);

  const GetLogo = () => (
    <div className="header">
      <span >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24.6665 0.666016H3.33317C1.8665 0.666016 0.679837 1.86602 0.679837 3.33268L0.666504 27.3327L5.99984 21.9993H24.6665C26.1332 21.9993 27.3332 20.7993 27.3332 19.3327V3.33268C27.3332 1.86602 26.1332 0.666016 24.6665 0.666016ZM15.3332 12.666H12.6665V4.66602H15.3332V12.666ZM15.3332 17.9993H12.6665V15.3327H15.3332V17.9993Z" fill="#F47738" />
        </svg>

      </span>{" "}
      <span className="text">{t(headerText)}</span>
    </div>
  );

  return (
    <Card style={{ paddingRight: 0, marginTop: 0 }} className="employeeCard filter">
      <div className="complaint-links-container">
        {GetLogo()}
        <div className="body" style={{ margin: "0px" }}>
          {links.map(({ link, text, hyperlink = false, accessTo = [] }, index) => {
            return (
              <span className="link" key={index}>
                {hyperlink ? <a href={link}>{t(text)}</a> : <Link to={link}>{t(text)}</Link>}
              </span>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default InboxLinks;
