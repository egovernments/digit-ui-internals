import React, { useEffect, useState } from "react";
import ActionLinks from "./ActionLinks";
import { Stats } from "./Stats";

let ActionCard = ({ type, header, links, stats }) => {
  const { roles } = Digit.UserService.getUser().info;

  //ToDo: Move to hook
  const hasAccess = (accessTo) => {
    return roles.filter((role) => role.code === accessTo).length;
  };

  const [filteredLinks, setFilteredLinks] = useState([]);

  useEffect(() => {
    let linksToShow = [];
    links.forEach((link) => {
      if (link.accessTo) {
        if (hasAccess(link.accessTo)) {
          linksToShow.push(link);
        }
      } else {
        linksToShow.push(link);
      }
    });
    setFilteredLinks(linksToShow);
  }, [links]);

  return (
    <div className="employee-app-container">
      <div className={type === "dashboard" ? "ground-container" : ""}>
        <div className="employeeCard">
          <div className="complaint-links-container">
            <div className="header">
              <span className="logo">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                  <path d="M0 0h24v24H0z" fill="none"></path>
                  <path
                    d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"
                    fill="white"
                  ></path>
                </svg>
              </span>
              <span className="text">{header}</span>
            </div>
            {type === "dashboard" && <Stats stats={stats} />}

            <ActionLinks type={type} links={filteredLinks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;
