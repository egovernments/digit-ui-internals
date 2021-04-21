import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CardSubHeader } from "@egovernments/digit-ui-react-components";

const PDFSvg = ({ width = 24, height = 24, style }) => (
  <svg style={style} xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="gray">
    <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z" />
  </svg>
);

function PropertyDocuments({ documents }) {
  const { t } = useTranslation();
  const filesArray = documents[0]?.values?.map((value) => value?.fileStoreId);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [pdfFiles, setPdfFiles] = useState({});

  useEffect(() => {
    Digit.UploadServices.Filefetch(filesArray, tenantId.split(".")[0]).then((res) => {
      setPdfFiles(res?.data);
    });
  }, []);

  return (
    <div style={{ marginTop: "19px" }}>
      {documents?.map((document, index) => (
        <React.Fragment key={index}>
          <CardSubHeader style={{ marginBottom: "8px", color: "#505A5F", fontSize: "24px" }}>{t(document?.title)}</CardSubHeader>
          <div style={{ display: "flex" }}>
            {document?.values?.map((value, index) => (
              <a target="_" href={pdfFiles[value.fileStoreId]?.split(",")[0]} style={{ minWidth: "160px" }} key={index}>
                <PDFSvg width={140} height={140} style={{ background: "#f6f6f6", padding: "8px" }} />
                <p style={{ marginTop: "8px" }}>{value?.title}</p>
              </a>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default PropertyDocuments;
