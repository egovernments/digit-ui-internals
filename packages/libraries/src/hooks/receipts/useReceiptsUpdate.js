import { useQuery, useMutation } from "react-query";
import ReceiptsService from "../../services/elements/Receipts";

export const useReceiptsUpdate = (tenantId, config = {},businessService) => {
  return useMutation((data) => ReceiptsService.update(data, tenantId,businessService));
};

export default useReceiptsUpdate;

