import { useQuery, useQueryClient } from "react-query";

const useTLSearchApplication = (params, config = {}) => {
  const client = useQueryClient();
  const getApplications = async () => {
    const data = await Digit.TLService.search(params, config);
    let tenantId = "";
    let BusinessServices = {};
    if (data && data?.Licenses && Array.isArray(data.Licenses) && data.Licenses.length > 0) {
      data.Licenses?.map(async (service) => {
        tenantId = service?.tenantId;
        BusinessServices[service.workflowCode]=service.workflowCode;
      });
      let workflow = {};
      const workflowdata = await Digit.WorkflowService.init(tenantId, Object.keys(BusinessServices)?.join(',')).then((workflowdata) => workflowdata);
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
  const result = useQuery(["TL_Application", params], getApplications, { staleTime: Infinity, 
    select: (data) => {
      return data.map(i => ({
        TL_COMMON_TABLE_COL_APP_NO: i.applicationNumber,
        TL_APPLICATION_CATEGORY: "ACTION_TEST_TRADE_LICENSE",
        TL_COMMON_TABLE_COL_OWN_NAME: i?.tradeLicenseDetail?.owners?.map((ele) => ele?.name),
        TL_COMMON_TABLE_COL_STATUS: `WF_NEWTL_${i?.status}`,
        TL_COMMON_TABLE_COL_SLA_NAME: `${i?.SLA / (1000 * 60 * 60 * 24)} Days`,
        TL_COMMON_TABLE_COL_TRD_NAME: i?.tradeName,
        TL_COMMON_CITY_NAME: i.tenantId,
        raw: i
      }))
    }
  });
  return { ...result, revalidate: () => client.invalidateQueries(["TL_Application", params]) };
};

export default useTLSearchApplication;
