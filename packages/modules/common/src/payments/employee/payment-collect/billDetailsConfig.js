export const BillDetailsKeyNoteConfig = () => ({
  PT: {
    heading: "ES_BILL_DETAILS_PT_DETAILS_HEADING",
    details: [
      {
        keyValue: "PT_PROPERTY_ID",
        keyPath: ["consumerCode"],
        fallback: "",
      },
      {
        keyValue: "CS_PAYMENT_BILLING_PERIOD",
        keyPath: [
          "billDetails",
          (d) => {
            const { fromPeriod, toPeriod } = d[0];
            if (fromPeriod && toPeriod) {
              let from = new Date(fromPeriod).getFullYear().toString();
              let to = new Date(toPeriod).getFullYear().toString();
              return "FY " + from + "-" + to;
            } else return "N/A";
          },
        ],
        fallback: "N/A",
      },
    ],
  },
});
