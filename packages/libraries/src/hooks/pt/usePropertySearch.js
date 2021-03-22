import { useQuery, useQueryClient } from "react-query";

const usePropertySearch = ({ tenantId, filters }, config = {}) => {
  const client = useQueryClient();
  const args = tenantId ? { tenantId, filters } : { filters };
  const { isLoading, error, data } = useQuery(["propertySearchList", tenantId, filters], () => Digit.PTService.search(args), config);
  return { isLoading, error, data, revalidate: () => client.invalidateQueries(["propertySearchList", tenantId, filters]) };
};

export default usePropertySearch;
