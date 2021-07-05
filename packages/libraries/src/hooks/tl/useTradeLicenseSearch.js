import { useQuery, useQueryClient } from "react-query";

const useTradeLicenseSearch = ({ tenantId, filters, auth }, config = {}) => {
  const client = useQueryClient();

  const args = tenantId ? { tenantId, filters, auth } : { filters, auth };
  const { isLoading, error, data } = useQuery(["tradeSearchList", tenantId, filters], () => Digit.TLService.TLsearch(args), config);
//   if (!isLoading && data && data?.Properties && Array.isArray(data.Properties) && data.Properties.length > 0) {
//     data.Properties[0].units = data.Properties[0].units || [];
//     data.Properties[0].units = data.Properties[0].units.filter((unit) => unit.active);
//     data.Properties[0].owners = data.Properties[0].owners || [];
//     data.Properties[0].owners = data.Properties[0].owners.filter((owner) => owner.status === "ACTIVE");
//   }
  return { isLoading, error, data, revalidate: () => client.invalidateQueries(["tradeSearchList", tenantId, filters]) };
};

export default useTradeLicenseSearch;