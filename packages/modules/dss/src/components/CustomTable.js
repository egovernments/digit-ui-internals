import React, { Fragment } from "react";
import { UpwardArrow, TextInput } from "@egovernments/digit-ui-react-components";

const CustomTable = () => {
  return (
    <>
      <table className="customTable">
        <tr>
          <th>#</th>
          <th>DDRs</th>
          <th>Closed Complaints</th>
          <th>Reopened Complaints</th>
          <th>Open Complaints</th>
          <th>Total Complaints</th>
          <th>Completion Rate</th>
          <th>SLA Achieved</th>
        </tr>
        <tr>
          <td>1</td>
          <td>DDR A</td>
          <td>
            2 <UpwardArrow /> 2%
          </td>
          <td>
            3 <UpwardArrow /> 3%
          </td>
          <td>
            62 <UpwardArrow /> 62%
          </td>
          <td>
            64 <UpwardArrow /> 64%
          </td>
          <td>
            3.13 <UpwardArrow /> 3%
          </td>
          <td>
            100 <UpwardArrow /> 100%
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>DDR B</td>
          <td>
            0 <UpwardArrow /> 0%
          </td>
          <td>
            0 <UpwardArrow /> 0%
          </td>
          <td>
            226 <UpwardArrow /> 100%
          </td>
          <td>
            226 <UpwardArrow /> 100%
          </td>
          <td>
            0 <UpwardArrow /> 0%
          </td>
          <td>
            100 <UpwardArrow /> 100%
          </td>
        </tr>
      </table>
    </>
  );
};

export default CustomTable;
