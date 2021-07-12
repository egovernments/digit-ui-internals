import { useQuery, useQueryClient } from "react-query";

const useTLSearchApplication = (params, config = {}) => {
  const client = useQueryClient();
  const getApplications = async () => {
    const data = await Digit.TLService.search(params, config);
    let tenantId = "";
    let BusinessServices = [];
    if (data && data?.Licenses && Array.isArray(data.Licenses) && data.Licenses.length > 0) {
      data.Licenses?.map(async (service) => {
        tenantId = service?.tenantId;
        BusinessServices.push(service.workflowCode);
      });
      let workflow = {};
      const workflowdata = await Digit.WorkflowService.init(tenantId, [...new Set(BusinessServices)]?.join(',')).then((workflowdata) => workflowdata);
      workflowdata.BusinessServices.map(businessService => {
        workflow[businessService.businessService] = businessService;
        return businessService;
      })
      const myPromise = new Promise((resolve, reject) => {
        resolve(data.Licenses?.map((service) => {
          const res = Object.assign({}, service, {
            SLA: workflow ? workflow[service.workflowCode]?.businessServiceSla : 0,
          });
          return res;
        }));
      });
      return myPromise;
    }
  };
  const result = useQuery(["TL_Application", params], getApplications, { staleTime: Infinity });
  return { ...result, revalidate: () => client.invalidateQueries(["TL_Application", params]) };
};

export default useTLSearchApplication;
