import React from "react";
import { ArrowLeft } from "./svgindex";
import { withRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BackButton = ({ history, style, isSuccessScreen }) => {
  const { t } = useTranslation();

  return (
    <div className="back-btn2" style={style ? style : {}} onClick={() => !isSuccessScreen ? history.goBack() : null}>
      <ArrowLeft />
      <p>{t("CS_COMMON_BACK")}</p>
    </div>
  );
};
export default withRouter(BackButton);
