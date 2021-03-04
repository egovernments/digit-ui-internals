import { Request } from "../atoms/Utils/Request";
import Urls from "../atoms/urls";

const Roleaction = (tenantId, roles) =>
  Request({
    url: Urls.AccessAction,
    useCache: false,
    method: "POST",
    auth: true,
    userService: false,
    params: { tenantId, roleCodes: roles, actionMaster: "actions-test", enabled: true },
  });

export default Roleaction;
