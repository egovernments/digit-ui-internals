import React from "react";
import { Row, StatusTable } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const returnTransferData = (value, rowContainerStyles) => {
  const { t } = useTranslation();
  return Object.keys(value).map((key) => {
    return (
      <div>
        <Row rowContainerStyle={rowContainerStyles} label={t(key)} text={`${value[key] || "NA"}`} />
      </div>
    );
  });
};

const TransferDetails = ({ data, showHorizontalBar, wrapperStyles, tableStyles, containerStyles, rowContainerStyles }) => {
  return (
    <div style={wrapperStyles}>
      {data.map((value, index) => {
        return (
          <div style={containerStyles}>
            {(index !== 0 && showHorizontalBar) && <div style={{ backgroundColor: "rgba(0, 0, 0, 0.12)", width: "auto", height: "2px", marginLeft: "16px" }}></div>}
            <StatusTable style={tableStyles}>{returnTransferData(value, rowContainerStyles)}</StatusTable>
          </div>
        );
      })}
    </div>
  );
};

export default TransferDetails;
