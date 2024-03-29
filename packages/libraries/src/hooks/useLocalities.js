import { useQuery } from "react-query";
import { getLocalities } from "../services/molecules/getLocalities";
import { LocalityService } from "../services/elements/Localities";

const useLocalities = (tenant, boundaryType = "admin", config, t) => {
  // console.log("find boundary type here",boundaryType)
  return useQuery(["BOUNDARY_DATA", tenant, boundaryType], () => getLocalities[boundaryType](tenant), {
    select: (data) => {
      return LocalityService.get(data).map((key) => {
        return { ...key, i18nkey: t(key.i18nkey) };
      });
    },
    staleTime: Infinity,
    ...config,
  });
};

export default useLocalities;
