import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Label, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
// import _ from "lodash";

const SearchApplication = ({ onSearch, type, onClose, searchFields, searchParams, isInboxPage, defaultSearchParams }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, watch, control } = useForm({
    defaultValues: searchParams,
  });
  const mobileView = innerWidth <= 640;

  // console.log(_.isEqual(defaultSearchParams, searchParams), { defaultSearchParams, searchParams }, "params are defaulted");

  const onSubmitInput = (data) => {
    if (!data.mobileNumber) {
      delete data.mobileNumber;
    }

    data.delete = [];

    searchFields.forEach((field) => {
      if (!data[field.name]) data.delete.push(field.name);
    });

    onSearch(data);
    if (type === "mobile") {
      onClose();
    }
  };

  function clearSearch() {
    const resetValues = searchFields.reduce((acc, field) => ({ ...acc, [field?.name]: "" }), {});
    reset(resetValues);
    const _newParams = { ...searchParams };
    _newParams.delete = [];
    searchFields.forEach((e) => {
      _newParams.delete.push(e?.name);
    });

    onSearch({ ..._newParams });
  }

  const clearAll = (mobileView) => {
    const mobileViewStyles = mobileView ? { margin: 0 } : {};
    return (
      <LinkLabel style={{ display: "", ...mobileViewStyles, margin: "0px"}} onClick={clearSearch}>
        {t("HR_COMMON_CLEAR_SEARCH")}
      </LinkLabel>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmitInput)}>
      <React.Fragment>
        <div className="search-container" style={{ width: "auto", marginLeft: isInboxPage ? "24px" : "revert" }}>
          <div className="search-complaint-container">
            {(type === "mobile" || mobileView) && (
                <div className="complaint-header" style={{display: 'flex', justifyContent: "space-between"}}>
                <h2>{t("ES_COMMON_SEARCH_BY")}</h2>
                <span onClick={onClose}>
                  <CloseSvg />
                </span>
              </div>
            )}
            <div className="complaint-input-container" style={{ width: "100%" }}>
              {searchFields
                ?.filter((e) => true)
                ?.map((input, index) => (
                  <span
                    key={index}
                    style={index != 0 ? { marginLeft: "2rem" } : { marginLeft: "0rem" }}
                    className={index === 0 ? "complaint-input" : "mobile-input"}
                  >
                    <Label>{input.label}</Label>
                    {input.type !== "date" ? (
                      <div className="field-container">
                        {input?.componentInFront ? (
                          <span className="citizen-card-input citizen-card-input--front" style={{ flex: "none" }}>
                            {input?.componentInFront}
                          </span>
                        ) : null}
                        <TextInput {...input} inputRef={register} watch={watch} shouldUpdate={true} />
                      </div>
                    ) : (
                      <Controller
                        render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                        name={input.name}
                        control={control}
                        defaultValue={null}
                      />
                    )}{" "}
                  </span>
                ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center"
              }}
            >
              {type === "desktop" && !mobileView && <div style={{marginTop: "0px"}} className="clear-search">{clearAll()}</div>}
              {type === "desktop" && !mobileView && (
                <SubmitBar
                  style={{ marginTop: "0px", flex: 1, maxWidth: "310px", marginLeft: "35px" }}
                  className="submit-bar-search"
                  label={t("ES_COMMON_SEARCH")}
                  submit
                />
              )}
            </div>
          </div>
        </div>
        {(type === "mobile" || mobileView) && (
          <ActionBar className="clear-search-container">
            <button className="clear-search" style={{ flex: 1 }}>
              {clearAll(mobileView)}
            </button>
            <SubmitBar label={t("HR_COMMON_SEARCH")} style={{ flex: 1 }} submit={true} />
          </ActionBar>
        )}
      </React.Fragment>
    </form>
  );
};

export default SearchApplication;
