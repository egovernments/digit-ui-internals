import { PTService } from "../../services/elements/PT";
import { useQuery, useMutation } from "react-query";

const usePropertyAPI = (tenantId, config = {}, type = true) => {
  if(type) {
    return useMutation((data) => PTService.create(data, tenantId));
  } else {
    return useMutation((data) => PTService.update(data, tenantId));
  }
};

export default usePropertyAPI;
