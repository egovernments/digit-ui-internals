import { RoundedLabel } from "@egovernments/digit-ui-react-components";
import { Forward } from "@egovernments/digit-ui-react-components";

import React from "react";
import { Link } from "react-router-dom";

const ActionLinks = ({ type, links }) => (
  <div className="body">
    <div className="inboxAction">
      {type === "dashboard" && (
        <React.Fragment>
          <span className="link">
            <Link to="/digit-ui/employee/pgr/inbox">Inbox</Link>
          </span>
          <RoundedLabel count="1" />
          <Forward />
        </React.Fragment>
      )}
    </div>
    <span className="link">
      {links.map((link) => {
        return <Link to={link.link}>{link.text}</Link>;
      })}
      {/* <Link to="/digit-ui/employee/pgr/complaint/create">New Complaint</Link> */}
      {/* {type === "inbox" && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link to="/digit-ui/employee/pgr/complaint/create">Reports</Link>
          <Link to="/digit-ui/employee/pgr/complaint/create">Dashboard</Link>
        </div>
      )} */}
    </span>
  </div>
);

export default ActionLinks;
