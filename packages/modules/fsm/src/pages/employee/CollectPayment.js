import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CardHeader, CardSectionHeader, CardSubHeader, CardText, Dropdown, RadioButtons } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";

import { FormComposer } from "../../components/FormComposer";

const CollectPayment = ({ parentRoute }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [menu, setMenu] = useState([]);
  const [ownerType, setOwnerType] = useState();

  function selectedType(value) {}

  const onSubmit = () => {
    history.push(`${parentRoute}/response`);
  };

  const config = [
    {
      head: t("ES_TITLE_PAYMENT_DETAILS"),
      body: [
        {
          label: t("ES_PAYMENT_DETAILS_TOTAL_AMOUNT"),
          populators: <CardSectionHeader>₹ 500.00</CardSectionHeader>,
        },
      ],
    },
    {
      head: t("ES_TITLE_PAYMENT_DETAILS"),
      body: [
        {
          label: t("ES_PAYMENT_DETAILS_PROPERTY_TYPE"),
          isMandatory: true,
          type: "dropdown",
          populators: <Dropdown option={menu} optionKey="name" id="owner" selected={ownerType} select={selectedType} />,
        },
        {
          label: t("ES_PAYMENT_DETAILS_PAYMENT_NO_OF_TRIPS"),
          type: "text",

          populators: {
            name: "payerName",
            validation: { required: true, pattern: /[A-Za-z]/ },
          },
        },
        {
          label: t("ES_PAYMENT_DETAILS_PAYMENT_AMOUNT"),
          isMandatory: true,
          type: "text",
          populators: {
            name: "amount",
            validation: { pattern: /[0-9]+/ },
            componentInFront: "+91",
          },
        },
      ],
    },
    {
      head: t("ES_PAYMENT_DETAILS_PAYMENT_MODE"),
      body: [
        {
          populators: (
            <RadioButtons
              selectedOption={{ title: "Cash" }}
              onSelect={() => {}}
              options={[{ title: "Cash" }, { title: "Debit/Credit Card" }]}
              optionsKey="title"
            ></RadioButtons>
          ),
        },
      ],
    },
  ];

  return (
    <React.Fragment>
      <FormComposer
        heading={t("ES_PAYMENT_DETAILS_COLLECT_PAYMENT")}
        label={t("ES_COMMON_APPLICATION_SUBMITTED")}
        config={config}
        onSubmit={onSubmit}
      ></FormComposer>
    </React.Fragment>
  );
};

export default CollectPayment;
