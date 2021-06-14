import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const TLService = {
  create: (details, tenantId) =>
    Request({
      url: Urls.tl.create,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
      auth: true,
    }),
};