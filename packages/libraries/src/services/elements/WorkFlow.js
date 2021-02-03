import { Storage } from "../atoms/Utils/Storage";
import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const WorkflowService = {
  init: (stateCode, businessServices) => {
    console.log("***************************************>>>>>>>>>>>>>>>>>>>>", stateCode);
    return Request({
      url: Urls.WorkFlow,
      useCache: true,
      method: "POST",
      params: { tenantId: stateCode, businessServices },
      auth: true,
    });
  },

  getByBusinessId: (stateCode, businessIds, params = {}, history = true) => {
    return Request({
      url: Urls.WorkFlowProcessSearch,
      useCache: false,
      method: "POST",
      params: { tenantId: stateCode, businessIds: businessIds, ...params, history },
      auth: true,
    });
  },

  getDetailsById: async ({ tenantId, id, moduleCode, role }) => {
    // console.log("getWorkflowDetails", tenantId, id, moduleCode, role);
    // console.log(Digit);
    const workflow = await Digit.WorkflowService.getByBusinessId(tenantId, id);
    const businessServiceResponse = (await Digit.WorkflowService.init(tenantId, moduleCode)).BusinessServices[0].states;
    if (workflow && workflow.ProcessInstances) {
      const processInstances = workflow.ProcessInstances;
      const nextStates = processInstances[0]?.nextActions.map((action) => ({ action: action.action, nextState: action.nextState }));
      const nextActions = nextStates.map((id) => ({
        action: id.action,
        state: businessServiceResponse.find((state) => state.uuid === id.nextState),
      }));
      const actionRolePair = nextActions?.map((action) => ({
        action: moduleCode === "FSM" ? `FSM_${action.action}` : action.action,
        roles: action.state.actions?.map((action) => action.roles).join(","),
      }));

      if (processInstances.length > 0) {
        const details = {
          timeline: processInstances
            .filter((e) => e.action !== "COMMENT")
            .map((instance) => ({
              performedAction: instance.action,
              status: instance.state.applicationStatus,
              caption: instance.assignes ? instance.assignes.map((assignee) => ({ name: assignee.name, mobileNumber: assignee.mobileNumber })) : null,
              auditDetails: {
                created: Digit.DateUtils.ConvertTimestampToDate(instance.auditDetails.createdTime),
                lastModified: Digit.DateUtils.ConvertTimestampToDate(instance.auditDetails.lastModifiedTime),
              },
              timeLineActions: instance.nextActions
                ? instance.nextActions.filter((action) => action.roles.includes(role)).map((action) => action.action)
                : null,
            })),
          nextActions: actionRolePair,
        };
        if (role !== "CITIZEN" && moduleCode === "PGR") {
          details.timeline.push({
            status: "COMPLAINT_FILED",
          });
        }
        if (role !== "CITIZEN" && moduleCode === "FSM") {
          details.timeline.push({
            status: "APPLICATION_FILED",
          });
        }
        return details;
      }
    } else {
      console.warn("error fetching workflow services");
      throw new Error("error fetching workflow services");
    }
    return {};
  },
};
