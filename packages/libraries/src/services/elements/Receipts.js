import { roundToNearestMinutes } from "date-fns/esm";
import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

const ReceiptsService = {
    search: (tenantId, filters, searchParams,businessService) =>
        Request({
            url: Digit.SessionStorage.get("userType") == "citizen"?`${Urls.receipts.payments}/_search`:`${Urls.receipts.payments}/${businessService}/_search`,
            useCache: false,
            method: "POST",
            auth: true,
            userService: true,
            params: { tenantId, ...filters, ...searchParams },
        }),
   
    update: (data, tenantId,businessService) =>
        Request({
            data: data,
            url: `${Urls.receipts.payments}/${businessService}/_workflow`,
            useCache: false,
            method: "POST",
            auth: true,
            userService: true,
            params: { tenantId },
        }),
    // count: ( tenantId ) =>
    //     Request({
    //         url: Urls.hrms.count,
    //         useCache: false,
    //         method: "POST",
    //         auth: true,
    //         userService: true,
    //         params: { tenantId },
    //     })
}

export default ReceiptsService;
