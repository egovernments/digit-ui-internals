import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Card, DownloadIcon, TextInput, CardCaption, CardLabel, EllipsisMenu, SearchIconSvg } from "@egovernments/digit-ui-react-components";

const SearchImg = () => {
  return <SearchIconSvg className="signature-img" />;
};

const GenericChart = ({ header, subHeader, className, caption, children, showSearch = false, showDownload = false, onChange }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const chart = useRef();

  const menuItems = [
    {
      code: "pdf",
      i18nKey: t("ES_COMMON_DOWNLOAD_PDF"),
    },
    {
      code: "image",
      i18nKey: t("ES_COMMON_DOWNLOAD_IMAGE"),
    },
    {
      code: "sharePdf",
      i18nKey: t("ES_DSS_SHARE_PDF"),
      target: "mail",
    },
    {
      code: "shareImage",
      i18nKey: t("ES_DSS_SHARE_IMAGE"),
      target: "mail",
    },
  ];

  function download(data) {
    setTimeout(() => {
      switch (data.code) {
        case "pdf":
          return Digit.Download.PDF(chart, t(header));
        case "image":
          return Digit.Download.Image(chart, t(header));
        case "sharePdf":
          return Digit.ShareFiles.PDF(tenantId, chart, t(header), data.target);
        case "shareImage":
          return Digit.ShareFiles.PDF(tenantId, chart, t(header), data.target);
      }
    }, 500);
  }

  return (
    <Card className={`chart-item ${className}`} ReactRef={chart}>
      <div className={`chartHeader ${showSearch && "column-direction"}`}>
        <div>
          <CardLabel style={{ fontWeight: "bold" }}>{`${t(header)}`}</CardLabel>
          {subHeader && <p style={{ color: "#505A5F", fontWeight: 700 }}>{subHeader}</p>}
        </div>
        <div className="sideContent">
          {showSearch && <TextInput className="searchInput" placeholder="Search" signature={true} signatureImg={<SearchImg />} onChange={onChange} />}
          {showDownload && <DownloadIcon className="mrlg" onClick={() => download({ code: "pdf" })} />}
          <EllipsisMenu menuItems={menuItems} displayKey="i18nKey" onSelect={(data) => download(data)} />
        </div>
      </div>
      {caption && <CardCaption>{caption}</CardCaption>}
      {children}
    </Card>
  );
};

export default GenericChart;
