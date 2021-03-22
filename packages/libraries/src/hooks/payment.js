import { useQuery, useQueryClient } from "react-query";

export const useFetchCitizenBillsForBuissnessService = ({ businessService, ...filters }) => {
  const queryClient = useQueryClient();
  const { mobileNumber, tenantId } = Digit.UserService.getUser()?.info || {};
  const { isLoading, error, isError, data } = useQuery(["citizenBillsForBuisnessService", businessService], () =>
    // Digit.PaymentService.fetchBill(tenantId, { mobileNumber, businessService, ...filters })
    Digit.PaymentService.fetchBill(tenantId, { mobileNumber, businessService, ...filters })
  );
  return { isLoading, error, isError, data, revalidate: () => queryClient.invalidateQueries(["citizenBillsForBuisnessService", businessService]) };
};

export const useFetchPayment = ({ tenantId, consumerCode, businessService }, config) => {
  const queryClient = useQueryClient();

  const fetchBill = async () => {
    try {
      return Digit.PaymentService.fetchBill(tenantId, { consumerCode, businessService });
    } catch (er) {
      if (er?.res?.data?.code === "EG_BS_BILL_NO_DEMANDS_FOUND") {
        console.log("in error", er);
        return new Promise((res) => res("EG_BS_BILL_NO_DEMANDS_FOUND"));
      } else throw er;
    }
  };

  const { isLoading, error, isError, data } = useQuery(["paymentFetchDetails", tenantId, consumerCode, businessService], () => fetchBill(), config);

  return {
    isLoading,
    error,
    isError,
    data,
    revalidate: () => queryClient.invalidateQueries(["paymentFetchDetails", tenantId, consumerCode, businessService]),
  };
};

export const usePaymentUpdate = ({ egId }, businessService) => {
  const getPaymentData = async (egId) => {
    const transaction = await Digit.PaymentService.updateCitizenReciept(egId);
    const payments = await Digit.PaymentService.getReciept(transaction.Transaction[0].tenantId, businessService, {
      consumerCodes: transaction.Transaction[0].consumerCode,
    });
    return { payments, applicationNo: transaction.Transaction[0].consumerCode, txnStatus: transaction.Transaction[0].txnStatus };
  };

  return useQuery(["paymentUpdate", egId], () => getPaymentData(egId));
};

export const useGetPaymentRulesForBusinessServices = (tenantId) => {
  return useQuery(["getPaymentRules", tenantId], () => Digit.MDMSService.getPaymentRules(tenantId));
};
