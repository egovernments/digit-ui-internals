import React, { useEffect, useState } from "react";
import { Card, KeyNote, Header, RadioButtons, CardSubHeader, TextInput, SubmitBar, Loader, ArrowLeft } from "@egovernments/digit-ui-react-components";
import BillSumary from "./bill-summary";
import { useHistory, useLocation, useParams, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BillDetails = ({ paymentRules, businessService }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { state, ...location } = useLocation();
  const { consumerCode } = useParams();
  const [bill, setBill] = useState(state?.bill);
  const tenantId = state?.tenantId || Digit.UserService.getUser().info.tenantId;
  const { data, isLoading } = state?.bill ? { isLoading: false } : Digit.Hooks.useFetchPayment({ tenantId, businessService: "PT", consumerCode });

  const billDetails = (bill?.billDetails.length && bill?.billDetails[0]) || [];

  const { key, label } = Digit.Hooks.useApplicationsForBusinessServiceSearch({ businessService }, { enabled: false });

  const getBillingPeriod = () => {
    let from = new Date(billDetails.fromPeriod).getFullYear().toString();
    let to = new Date(billDetails.toPeriod).getFullYear().toString();
    return "FY " + from + "~" + to;
  };

  const getBillBreakDown = () => billDetails?.billAccountDetails || [];

  const getTotal = () => Math.round(getBillBreakDown()?.reduce((total, tax) => total + tax.amount, 0) || 0);

  const [paymentType, setPaymentType] = useState(t("CS_PAYMENT_FULL_AMOUNT"));
  const [amount, setAmount] = useState(getTotal());
  const [paymentAllowed, setPaymentAllowed] = useState(true);
  const [formError, setError] = useState("");

  useEffect(() => {
    window.scroll({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (paymentType == t("CS_PAYMENT_FULL_AMOUNT")) setAmount(getTotal());
  }, [paymentType, bill]);

  useEffect(() => {
    const { minAmountPayable, isAdvanceAllowed } = paymentRules;
    const allowPayment = minAmountPayable && amount >= minAmountPayable && !isAdvanceAllowed && amount <= getTotal() && !formError;
    if (paymentType != t("CS_PAYMENT_FULL_AMOUNT")) setPaymentAllowed(allowPayment);
    else setPaymentAllowed(true);
  }, [paymentType, amount]);

  useEffect(() => {
    if (!bill && data) {
      let requiredBill = data.Bill.filter((e) => e.consumerCode == consumerCode)[0];
      setBill(requiredBill);
    }
  }, [isLoading]);

  const onSubmit = () => {
    let paymentAmount = paymentType === t("CS_PAYMENT_FULL_AMOUNT") ? getTotal() : amount;
    history.push(`/digit-ui/citizen/payment/collect/${businessService}/${consumerCode}`, { paymentAmount, tenantId: billDetails.tenantId });
  };

  const onChangeAmount = (value) => {
    setError("");
    if (value.includes(".")) {
      setError("CS_PAYMENT_NO_FRACTIONAL_PAYMENT_ALLOWED");
    }
    setAmount(value);
  };

  if (isLoading) return <Loader />;

  return (
    <React.Fragment>
      <Header>{t("CS_PAYMENT_BILL_DETAILS")}</Header>
      <Card className="bill-details">
        <div className="bill-details-summary">
          <KeyNote keyValue={t(label)} note={consumerCode} />
          <KeyNote keyValue={t("CS_PAYMENT_BILLING_PERIOD")} note={getBillingPeriod()} />
          <BillSumary billAccountDetails={getBillBreakDown()} />
        </div>
        <div className="bill-payment-amount">
          <hr className="underline" />
          <CardSubHeader>{t("CS_COMMON_PAYMENT_AMOUNT")}</CardSubHeader>
          <RadioButtons
            selectedOption={paymentType}
            onSelect={setPaymentType}
            options={paymentRules.partPaymentAllowed ? [t("CS_PAYMENT_FULL_AMOUNT"), t("CS_PAYMENT_CUSTOM_AMOUNT")] : [t("CS_PAYMENT_FULL_AMOUNT")]}
          />
          <div style={{ position: "relative" }}>
            <span
              className="payment-amount-front"
              style={{ border: `1px solid ${paymentType === t("CS_PAYMENT_FULL_AMOUNT") ? "#9a9a9a" : "black"}` }}
            >
              ₹
            </span>
            {paymentType !== t("CS_PAYMENT_FULL_AMOUNT") ? (
              <TextInput className="text-indent-xl" onChange={(e) => onChangeAmount(e.target.value)} value={amount} />
            ) : (
              <TextInput className="text-indent-xl" value={getTotal()} onChange={() => {}} disable={true} />
            )}
            {<span className="card-label-error">{t(formError)}</span>}
          </div>
          <SubmitBar disabled={!paymentAllowed} onSubmit={onSubmit} label={t("CS_COMMON_PAY")} />
        </div>
      </Card>
    </React.Fragment>
  );
};

export default BillDetails;
