import { useQuery } from "react-query";
import { MdmsService } from "../../services/elements/MDMS";

const useReceiptsMDMS = (tenantId, type, config = {}) => {
  const useReceiptsBusinessServices = () => {
    const { isLoading, error, data } = useQuery(["RECEIPTS_SERVICES", tenantId], () => MdmsService.getReceiptKey(tenantId, 'common-masters'), config);
    if (!isLoading && data && data[`common-masters`] && data[`common-masters`]?.uiCommonPay && Array.isArray(data[`common-masters`].uiCommonPay)) {
      // data[`common-masters`].uiCommonPay = data[`common-masters`].uiCommonPay.filter((unit) => unit.cancelReceipt) || [];
      data.dropdownData = [...data[`common-masters`].uiCommonPay.map(config => {
        return {
          code: config.code,
          name: `BILLINGSERVICE_BUSINESSSERVICE_${config.code}`
        }
      })] || []
    }
    return { isLoading, error, data, revalidate: () => client.invalidateQueries(["RECEIPTS_SERVICES", tenantId]) };
  };
  const useCancelReceiptStatus = () => {
    const { isLoading, error, data } = useQuery(["RECEIPTS_CANCEL_STATUS", tenantId], () => MdmsService.getCancelReceiptReason(tenantId, 'common-masters'), config);
    if (!isLoading && data && data[`common-masters`] && data[`common-masters`]?.CancelReceiptReason && Array.isArray(data[`common-masters`].CancelReceiptReason)) {
      data[`common-masters`].CancelReceiptReason = data[`common-masters`].CancelReceiptReason.filter((unit) => unit.active) || [];
      data.dropdownData =[{code:"NEW",name: `CR_REASON_${'NEW'}`},{code:"CANCELLED",name: `CR_REASON_${'CANCELLED'}`},{code:"DEPOSITED",name: `CR_REASON_${'DEPOSITED'}`}]
    }
    return  { isLoading, error, data, revalidate: () => client.invalidateQueries(["RECEIPTS_CANCEL_STATUS", tenantId]) }; 
  };
  const useCancelReceiptReason = () => {
    const { isLoading, error, data } = useQuery(["RECEIPTS_CANCEL_REASON", tenantId], () => MdmsService.getCancelReceiptReason(tenantId, 'common-masters'), config);
    if (!isLoading && data && data[`common-masters`] && data[`common-masters`]?.CancelReceiptReason && Array.isArray(data[`common-masters`].CancelReceiptReason)) {
      data[`common-masters`].CancelReceiptReason = data[`common-masters`].CancelReceiptReason.filter((unit) => unit.active) || [];
      data.dropdownData = [...data[`common-masters`].CancelReceiptReason.map(config => {
        return {
          code: config.code,
          name: `CR_REASON_${config.code}`
        }
      })] || []
    }
    return  { isLoading, error, data, revalidate: () => client.invalidateQueries(["RECEIPTS_CANCEL_REASON", tenantId]) }; 
  };


  switch (type) {
    case "ReceiptsBusinessServices":
      return useReceiptsBusinessServices();
    case "CancelReceiptReason":
      return useCancelReceiptReason();
    case "CancelReceiptStatus":
      return useCancelReceiptStatus();
  }


};
export default useReceiptsMDMS;
