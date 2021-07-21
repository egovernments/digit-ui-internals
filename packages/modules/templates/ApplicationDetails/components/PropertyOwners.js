import React from "react";
import { useTranslation } from "react-i18next";
import { CardSubHeader, StatusTable, Row, CardSectionHeader } from "@egovernments/digit-ui-react-components";

function PropertyOwners({ owners }) {
  const { t } = useTranslation();

  //   console.log(owners, "inside property Owner");
  const checkLocation = window.location.href.includes("employee/tl");
  return (
    <React.Fragment>
      {owners.map((owner, index) => (
        <div key={t(owner?.title)} style={checkLocation ? { marginTop: "19px", background: "#FAFAFA", border: "1px solid #D6D5D4", borderRadius: "4px", padding: "8px", lineHeight: "19px", width: "40%" } : { marginTop: "19px" }}>
          <CardSubHeader style={{ marginBottom: "8px", color: "#505A5F", fontSize: "24px" }}>{checkLocation ? `${t(owner?.title)} ${index+1}` : t(owner?.title)}</CardSubHeader>
          <React.Fragment key={index}>
            {/* <CardSectionHeader style={{ marginBottom: "16px", color: "#505A5F", fontSize: "16px", marginTop: index !== 0 ? "16px" : "revert" }}>
              {t(value.title)}
            </CardSectionHeader> */}
            <StatusTable style={{ position: "relative", padding: "8px" }}>
              <div
                style={{
                  position: "absolute",
                  maxWidth: "640px",
                  //   border: "1px solid #D6D5D4",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  width: "auto",
                }}
              ></div>
              {owner?.values?.map((value, index) => {
                if (value.map === true && value.value !== "N/A") {
                  return <Row key={t(value.title)} label={t(value.title)} text={<img src={t(value.value)} alt="" />} />;
                }
                return (
                  <Row
                    key={t(value.title)}
                    label={!checkLocation ? t(value.title) : `${t(value.title)}:`}
                    text={t(value.value) || "N/A"}
                    last={index === value?.values?.length - 1}
                    caption={value.caption}
                    className="border-none"
                    rowContainerStyle={checkLocation ? {justifyContent: "space-between"}: {}}
                  />
                );
              })}
            </StatusTable>
          </React.Fragment>
        </div>
      ))}
    </React.Fragment>
  );
}

export default PropertyOwners;
