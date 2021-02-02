import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TextInput, Label, SubmitBar, LinkLabel, ActionBar } from "@egovernments/digit-ui-react-components";

const SearchComplaint = ({ onSearch, type, onClose, searchParams }) => {
  const [complaintNo, setComplaintNo] = useState(searchParams?.search?.serviceRequestId || "");
  const [mobileNo, setMobileNo] = useState(searchParams?.search?.mobileNumber || "");
  const { register, errors, handleSubmit, reset } = useForm();
  const { t } = useTranslation();

  const onSubmitInput = (data) => {
    if (!Object.keys(errors).filter((i) => errors[i]).length) {
      if (data.serviceRequestId !== "") {
        onSearch({ serviceRequestId: data.serviceRequestId });
      } else if (data.mobileNumber !== "") {
        onSearch({ mobileNumber: data.mobileNumber });
      } else {
        onSearch({});
      }

      if (type === "mobile") {
        onClose();
      }
    }
  };

  function clearSearch() {
    reset();
    onSearch({});
    setComplaintNo("");
    setMobileNo("");
  }

  const clearAll = () => {
    return <LinkLabel onClick={clearSearch}>{t("CS_COMMON_CLEAR_SEARCH")}</LinkLabel>;
  };

  function setComplaint(e) {
    setComplaintNo(e.target.value);
  }

  function setMobile(e) {
    setMobileNo(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit(onSubmitInput)}>
      <React.Fragment>
        <div className="search-container" style={{ width: "auto" }}>
          <div className="search-complaint-container" style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
            {type === "mobile" && (
              <div
                className="complaint-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: "20px",
                }}
              >
                <h2> {t("CS_COMMON_SEARCH_BY")}:</h2>
                <span onClick={onClose}>x</span>
              </div>
            )}
            <div className="complaint-input-container" style={{ width: "100%" }}>
              <span className="complaint-input">
                <Label>{t("CS_COMMON_COMPLAINT_NO")}.</Label>
                <TextInput
                  name="serviceRequestId"
                  value={complaintNo}
                  onChange={setComplaint}
                  inputRef={register({
                    pattern: /(?!^$)([^\s])/,
                  })}
                  style={{ width: "280px", marginBottom: "8px" }}
                ></TextInput>
              </span>
              <span className="mobile-input">
                <Label>{t("CS_COMMON_MOBILE_NO")}.</Label>
                <TextInput
                  name="mobileNumber"
                  value={mobileNo}
                  onChange={setMobile}
                  inputRef={register({
                    pattern: /^[6-9]\d{9}$/,
                  })}
                  style={{ width: "280px" }}
                ></TextInput>
              </span>
              {type === "desktop" && (
                <SubmitBar
                  style={{ marginTop: 32, marginLeft: "auto" }}
                  label={t("ES_COMMON_SEARCH")}
                  submit={true}
                  disabled={Object.keys(errors).filter((i) => errors[i]).length}
                />
              )}
            </div>
            {type === "desktop" && <span className="clear-search">{clearAll()}</span>}
          </div>
        </div>
        {type === "mobile" && (
          <ActionBar>
            <SubmitBar label="Search" submit={true} />
          </ActionBar>
        )}
      </React.Fragment>
    </form>
  );
};

export default SearchComplaint;
