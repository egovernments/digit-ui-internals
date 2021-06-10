import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "react-query";
import { FSMService } from "../../services/elements/FSM";
import { PTService } from "../../services/elements/PT";
import { TableConfig } from "./tableConfig";
import { filterFunctions } from "./filterFn";
import { getSearchFields } from "./searchFields";

const inboxConfig = (tenantId, filters) => ({
  PT: {
    services: ["PT.CREATE"],
    searchResponseKey: "Properties",
    businessIdsParamForSearch: "acknowledgementIds",
    businessIdAliasForSearch: "acknowldgementNumber",
    fetchFilters: filterFunctions.PT,
    _searchFn: () => PTService.search({ tenantId, filters }),
  },
  FSM: {
    services: ["FSM"],
    searchResponseKey: "fsm",
    businessIdsParamForSearch: "applicationNos",
    businessIdAliasForSearch: "applicationNo",
    fetchFilters: filterFunctions.FSM,
    _searchFn: () => FSMService.search(tenantId, filters),
  },
});

const defaultCombineResponse = ({ totalCount, ...d }, wf) => {
  return { totalCount, searchData: { ...d }, workflowData: { ...wf } };
};

const defaultRawSearchHandler = ({ totalCount, ...data }, searchKey, businessIdAlias) => {
  return { [searchKey]: data[searchKey].map((e) => ({ totalCount, ...e })) };
};

const defaultCatchSearch = (Err) => {
  if (
    Err?.response?.data?.Errors?.some(
      (e) =>
        e.code === "EG_PT_INVALID_SEARCH" &&
        e.message === " Search is not allowed on empty Criteria, Atleast one criteria should be provided with tenantId for EMPLOYEE"
    )
  )
    return [];
  console.log(Err?.response?.data, " this is error");
  throw Err;
};

/**
 *
 * @param {*} data
 * @param {Array of Objects containing async or pure functions} middlewares
 * @returns {object}
 */

const callMiddlewares = async (data, middlewares) => {
  let applyBreak = false;
  let itr = -1;
  let _break = () => (applyBreak = true);
  let _next = async (data) => {
    if (!applyBreak && ++itr < middlewares.length) {
      let key = Object.keys(middlewares[itr])[0];
      let nextMiddleware = middlewares[itr][key];
      let isAsync = nextMiddleware.constructor.name === "AsyncFunction";
      if (isAsync) return await nextMiddleware(data, _break, _next);
      else return nextMiddleware(data, _break, _next);
    } else return data;
  };
  let ret = await _next(data);
  return ret || [];
};

const useInboxGeneral = ({
  tenantId,
  businessService,
  filters,
  rawWfHandler = (d) => d,
  rawSearchHandler = defaultRawSearchHandler,
  combineResponse = defaultCombineResponse,
  isInbox = true,
  wfConfig = {},
  searchConfig = {},
  middlewaresWf = [],
  middlewareSearch = [],
  catchSearch = defaultCatchSearch,
}) => {
  const client = useQueryClient();
  const { t } = useTranslation();

  const { services, fetchFilters, searchResponseKey, businessIdAliasForSearch, businessIdsParamForSearch } = inboxConfig()[businessService];

  let { workflowFilters, searchFilters } = fetchFilters(filters);

  const { data: processInstances, isLoading: wfFetching, isSuccess: wfSuccess } = useQuery(
    ["WORKFLOW_INBOX", businessService, workflowFilters],
    () =>
      Digit.WorkflowService.getAllApplication(tenantId, { businessServices: services.join(), ...workflowFilters })
        .then(rawWfHandler)
        .then((data) => callMiddlewares(data.ProcessInstances, middlewaresWf)),
    {
      enabled: isInbox,
      select: (d) => {
        return d;
      },
      ...wfConfig,
    }
  );

  const applicationNoFromWF = processInstances?.map((e) => e.businessId).join() || "";

  if (isInbox && applicationNoFromWF && !searchFilters[businessIdAliasForSearch])
    searchFilters = { [businessIdsParamForSearch]: applicationNoFromWF, ...searchFilters };

  const { _searchFn } = inboxConfig(tenantId, { ...searchFilters })[businessService];

  /**
   * Convert Wf Array to Object
   */

  const processInstanceBuisnessIdMap = processInstances?.reduce((object, item) => {
    return { ...object, [item?.["businessId"]]: item };
  }, {});

  const searchResult = useQuery(
    ["SEARCH_INBOX", businessService, searchFilters, workflowFilters, isInbox],
    () =>
      _searchFn()
        .then((d) => rawSearchHandler(d, searchResponseKey, businessIdAliasForSearch))
        .then((data) => callMiddlewares(data[searchResponseKey], middlewareSearch))
        .catch(catchSearch),
    {
      enabled: !isInbox || (!wfFetching && wfSuccess),
      select: (d) => {
        console.log(d.length + " records fetched", "inside select");
        return d.map((searchResult) => ({
          totalCount: d.totalCount,
          ...combineResponse(searchResult, processInstanceBuisnessIdMap?.[searchResult?.[businessIdAliasForSearch]]),
        }));
      },
      ...searchConfig,
    }
  );

  const revalidate = () => {
    client.refetchQueries(["WORKFLOW_INBOX"]);
    client.refetchQueries(["SEARCH_INBOX"]);
  };

  client.setQueryData(`FUNCTION_RESET_INBOX_${businessService}`, { revalidate });

  return {
    ...searchResult,
    revalidate,
    searchResponseKey,
    businessIdsParamForSearch,
    businessIdAliasForSearch,
    tableConfig: TableConfig(t)[businessService],
    searchFields: getSearchFields(isInbox)[businessService],
    wfFetching,
  };
};

export default useInboxGeneral;
