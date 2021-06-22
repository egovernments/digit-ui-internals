import { useQuery, useQueryClient } from "react-query";
import ReceiptsService from "../../services/elements/Receipts";

export const useReceiptsSearch = (searchparams, tenantId, filters, isupdated, config = {}) => {
  let businessService=searchparams?.businessServices;
  return useQuery(["RECEIPTS_SEARCH", searchparams, tenantId, filters, isupdated], () => ReceiptsService.search(tenantId, filters, searchparams,businessService), config);
};

export default useReceiptsSearch;
