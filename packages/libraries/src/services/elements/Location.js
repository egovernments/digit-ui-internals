import Urls from "../atoms/urls";
import { ServiceRequest } from "../atoms/Utils/Request";

export const LocationService = {
  getLocalities: ({ tenantId }) => {
    return ServiceRequest({
      serviceName: "getLocalities",
      url: Urls.location.localities,
      params: { tenantId: tenantId.toLowerCase() },
      useCache: true,
    });
  },
  getRevenueLocalities: ({ tenantId }) => {
    return ServiceRequest({
      serviceName: "getRevenueLocalities",
      url: Urls.location.revenue_localities,
      params: { tenantId: tenantId.toLowerCase() },
      useCache: true,
    });
  },
};
