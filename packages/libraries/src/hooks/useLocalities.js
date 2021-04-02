import { useQuery } from "react-query";
import { getLocalities } from "../services/molecules/getLocalities";
import { LocalityService } from "../services/elements/Localities";

const useLocalities = (tenant, boundaryType = "admin", config) => {
  // console.log("find boundary type here",boundaryType)
  return useQuery(["BOUNDARY_DATA", tenant, boundaryType], () => getLocalities[boundaryType](tenant), {
    select: (data) => {
      return LocalityService.get(data);
    },
    staleTime: Infinity,
    ...config,
  });
};

export default useLocalities;
