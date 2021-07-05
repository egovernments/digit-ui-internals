import React, { useState, useEffect, useLayoutEffect } from "react";
import { FormComposer, CardLabelDesc, Loader, Dropdown, Localities } from "@egovernments/digit-ui-react-components";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SearchTrade = ({ config: propsConfig, onSelect }) => {
  const { t } = useTranslation();

  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [canSubmit, setCanSubmit] = useState(false);

//   const allCities = Digit.Hooks.pt.useTenants()?.sort((a, b) => a?.i18nKey?.localeCompare?.(b?.i18nKey));

//   const [cityCode, setCityCode] = useState();
  const [formValue, setFormValue] = useState();

  useLayoutEffect(() => {
    const getActionBar = () => {
      let el = document.querySelector("div.action-bar-wrap");
      if (el) {
        el.style.position = "static";
        el.style.padding = "8px 0";
        el.style.boxShadow = "none";
        el.style.marginBottom = "16px";
      } else {
        setTimeout(() => {
          getActionBar();
        }, 100);
      }
    };
    getActionBar();
  }, []);

  // moduleCode, type, config = {}, payload = []

  const onTradeSearch = async (data) => {
    if (!data.mobileNumber && !data.LicenseNum) {
      alert(t("TL_ERROR_NEED_ONE_PARAM"));
    }
     else {
      history.push(
        `/digit-ui/citizen/tl/tradelicence/renewal-list?mobileNumber=${data?.mobileNumber ? data?.mobileNumber : ``}&LicenseNumber=${data?.LicenseNum ? data?.LicenseNum : ``}`
      );
    }
  };

  const [mobileNumber, tradelicense] = propsConfig.inputs;

  const config = [
    {
      body: [
        {
          label: mobileNumber.label,
          type: mobileNumber.type,
          populators: {
            name: mobileNumber.name,
            validation: { pattern: /^[6-9]{1}[0-9]{9}$ / },
          },
          isMandatory: false,
        },
        {
          label: tradelicense.label,
          type: tradelicense.type,
          populators: {
            name: tradelicense.name,
          },
          isMandatory: false,
        },
      ],
    },
  ];

  const onFormValueChange = (setValue, data, formState) => {
    const mobileNumberLength = data?.[mobileNumber.name]?.length;
    const Licenseno = data?.[tradelicense.name];
    // const propId = data?.[property.name];
    // const city = data?.city;
    // const locality = data?.locality;

    // if (city?.code !== cityCode) {
    //   setCityCode(city?.code);
    // }

    // let { errors } = formState;

    // if (!_.isEqual(data, formValue)) {
    //   // if (data?.city.code !== formValue?.city?.code) setValue("locality", null);
    //   setFormValue(data);
    // }

    // if (!locality || !city) {
    //   setCanSubmit(false);
    //   return;
    // }

    if (mobileNumberLength > 0 && mobileNumberLength < 10) setCanSubmit(false);
    else if (!Licenseno && !mobileNumberLength) setCanSubmit(false);
    else setCanSubmit(true);
  };

//   if (isLoading) {
//     return <Loader />;
//   }

  return (
    <div style={{ marginTop: "16px" }}>
      <FormComposer
        onSubmit={onTradeSearch}
        noBoxShadow
        inline
        config={config}
        label={propsConfig.texts.submitButtonLabel}
        heading={propsConfig.texts.header}
        text={propsConfig.texts.text}
        cardStyle={{ margin: "auto" }}
        headingStyle={{ fontSize: "32px", marginBottom: "16px", fontFamily: "Roboto Condensed,sans-serif" }}
        isDisabled={!canSubmit}
        onFormValueChange={onFormValueChange}
      ></FormComposer>
    </div>
  );
};

SearchTrade.propTypes = {
  loginParams: PropTypes.any,
};

SearchTrade.defaultProps = {
  loginParams: null,
};

export default SearchTrade;
