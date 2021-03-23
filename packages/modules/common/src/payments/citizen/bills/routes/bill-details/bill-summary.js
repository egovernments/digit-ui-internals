import React from "react";
import { useTranslation } from "react-i18next";

const BillSumary = ({ billAccountDetails }) => {
  const total = billAccountDetails.reduce((total, tax) => total + tax.amount, 0);
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <div className="bill-summary">
        {billAccountDetails.map((amountDetails, index) => {
          return (
            <div key={index} className="bill-account-details">
              <div className="label">{t(amountDetails.taxHeadCode)}</div>
              <div className="value">₹ {amountDetails.amount?.toFixed(2)}</div>
            </div>
          );
        })}

        <hr className="underline" />
        <div className="amount-details">
          <div className="label">Total Amount</div>
          <div className="value">₹ {total.toFixed(2)}</div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BillSumary;
