import { LocationService } from "../elements/Location";
import { StoreService } from "./Store/service";

export const getLocalities = {
  admin: async (tenant) => {
    await StoreService.defaultData(tenant, tenant, Digit.SessionStorage.get("locale") || "en_IN");
    return (await LocationService.getLocalities(tenant)).TenantBoundary[0];
  },
  revenue: async (tenant) => {
    // console.log("find me here", tenant)
    await StoreService.defaultData(tenant, tenant, Digit.SessionStorage.get("locale") || "en_IN");
    return (await LocationService.getRevenueLocalities(tenant)).TenantBoundary[0];
  },
};
