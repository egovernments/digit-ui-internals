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
  return ret;
};

const useInboxGeneral = ({
  tenantId,
  businessService,
  filters,
  rawWfHandler = (d) => d,
  rawSearchHandler = ({ totalCount, ...data }, searchKey, businessIdAlias) => ({ [searchKey]: data[searchKey].map((e) => ({ totalCount, ...e })) }),
  combineResponse = ({ totalCount, ...d }, wf) => ({ totalCount, searchData: { ...d }, workflowData: { ...wf } }),
  isInbox = true,
  wfConfig = {},
  searchConfig = {},
  middlewaresWf = [],
  middlewareSearch = [],
}) => {
  const client = useQueryClient();
  const { t } = useTranslation();

  const { services, fetchFilters, searchResponseKey, businessIdAliasForSearch, businessIdsParamForSearch } = inboxConfig()[businessService];

  let { workflowFilters, searchFilters } = fetchFilters(filters);

  const { data: processInstances, isFetching: wfFetching, isSuccess: wfSuccess } = useQuery(
    ["WORKFLOW_INBOX", businessService, workflowFilters],
    () =>
      Digit.WorkflowService.getAllApplication(tenantId, { businessService: services.join(), ...workflowFilters })
        .then(rawWfHandler)
        .then((data) => callMiddlewares(data.ProcessInstances, middlewaresWf)),
    { enabled: isInbox, ...wfConfig }
  );

  const applicationNoFromWF = processInstances?.map((e) => e.businessId).join() || "";

  if (isInbox && applicationNoFromWF && !searchFilters[businessIdAliasForSearch])
    searchFilters = { ...searchFilters, [businessIdsParamForSearch]: applicationNoFromWF };

  const { _searchFn } = inboxConfig(tenantId, searchFilters)[businessService];

  /**
   * Convert Wf Array to Object
   */

  const processInstanceBuisnessIdMap = processInstances?.reduce((object, item) => {
    return { ...object, [item["businessId"]]: item };
  }, {});

  const searchResult = useQuery(
    ["SEARCH_INBOX", businessService, searchFilters],
    () =>
      _searchFn()
        .then((d) => rawSearchHandler(d, searchResponseKey, businessIdAliasForSearch))
        .then((data) => callMiddlewares(data[searchResponseKey], middlewareSearch))
        .catch((Err) => {
          if (
            Err?.response?.data?.Errors?.some(
              (e) =>
                e.code === "EG_PT_INVALID_SEARCH" &&
                e.message === " Search is not allowed on empty Criteria, Atleast one criteria should be provided with tenantId for EMPLOYEE"
            )
          )
            return [];
          throw Err;
        }),
    {
      enabled: !isInbox || (!wfFetching && wfSuccess),
      select: (d) => {
        return d.map((searchResult) => ({
          totalCount: d.totalCount,
          ...combineResponse(searchResult, processInstanceBuisnessIdMap[searchResult[businessIdAliasForSearch]]),
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
  };
};

export default useInboxGeneral;
