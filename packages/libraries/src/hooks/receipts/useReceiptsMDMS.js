import { MdmsService } from "../../services/elements/MDMS";
import { useQuery } from "react-query";

const useReceiptsMDMS = (tenantId, type, config = {}) => {
  const useReceiptsBusinessServices = () => {


    const { isLoading, error, data } = useQuery(["RECEIPTS_SERVICES", tenantId], () => MdmsService.getReceiptKey(tenantId, 'common-masters'), config);

    if (!isLoading && data && data[`common-masters`] && data[`common-masters`]?.uiCommonPay && Array.isArray(data[`common-masters`].uiCommonPay)) {
      debugger;
      console.warn(data[`common-masters`].uiCommonPay);
      data[`common-masters`].uiCommonPay = data[`common-masters`].uiCommonPay.filter((unit) => unit.cancelReceipt) || [];
      data.dropdownData = [...data[`common-masters`].uiCommonPay.map(config => {
        return {
          code: config.code,
          name: `BILLINGSERVICE_BUSINESSSERVICE_${config.code}`
        }
      })] || []
    }
    console.warn(data && data[`common-masters`] && data[`common-masters`]?.uiCommonPay);
    return { isLoading, error, data, revalidate: () => client.invalidateQueries(["RECEIPTS_SERVICES", tenantId]) };
  };
  const useCancelReceiptReason = () => {
    return useQuery(["RECEIPTS_CANCEL_REASON", tenantId], () => MdmsService.getCancelReceiptReason(tenantId, 'common-masters'), config);
  };

  switch (type) {
    case "ReceiptsBusinessServices":
      return useReceiptsBusinessServices();
    case "CancelReceiptReason":
      return useCancelReceiptReason();
  }


};
export default useReceiptsMDMS;
