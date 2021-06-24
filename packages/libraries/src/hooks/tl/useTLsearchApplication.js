import { useQuery, useQueryClient } from "react-query";

const useTLSearchApplication = (params, config = {}) => {
  const client = useQueryClient();
  const getApplications = async () => {
    let updateddata = [];
    const data = await Digit.TLService.search(params, config);
    if (data && data?.Licenses && Array.isArray(data.Licenses) && data.Licenses.length > 0) {
      return (updateddata = await Promise.all(
        data.Licenses?.map(async (service) => {
          const workflowdata = await Digit.WorkflowService.init(service.tenantId, service.workflowCode).then((workflowdata) => workflowdata);
          const res = Object.assign({}, service, {
            SLA: workflowdata?.BusinessServices[0]?.businessServiceSla,
          });
          return res;
        })
      ));
    }
  };
  const result = useQuery(["TL_Application", params], getApplications, { staleTime: Infinity });
  return { ...result, revalidate: () => client.invalidateQueries(["TL_Application", params]) };
};

export default useTLSearchApplication;
