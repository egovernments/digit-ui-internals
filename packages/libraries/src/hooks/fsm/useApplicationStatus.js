import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

const useApplicationStatus = (select) => {
  const { t } = useTranslation();

  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo.info.roles.map((roleData) => roleData.code);

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const fetch = async () => {
    let WorkflowService = await Digit.WorkflowService.init(tenantId, "FSM");
    return WorkflowService;
  };

  const roleWiseSelect = (WorkflowService) => {
    const response = WorkflowService.BusinessServices[0].states
      .filter((state) => state.applicationStatus)
      .filter((status) => {
        if (status.actions === null) return 1;
        const ref = status.actions.reduce((prev, curr) => [...prev, ...curr.roles], []);
        const res = [userRoles, ref].reduce((a, c) => a.filter((i) => c.includes(i)));
        return res.length;
      })
      .map((state) => {
        const roles = state.actions?.map((e) => e.roles)?.flat();
        return {
          name: t(`CS_COMMON_FSM_${state.applicationStatus}`),
          code: state.applicationStatus,
          roles,
        };
      });
    return response;
  };

  const defaultSelect = (WorkflowService) => {
    let applicationStatus = WorkflowService.BusinessServices[0].states
      .filter((state) => state.applicationStatus)
      .map((state) => {
        const roles = state.actions?.map((e) => e.roles)?.flat();
        return {
          name: t(`CS_COMMON_FSM_${state.applicationStatus}`),
          code: state.applicationStatus,
          roles,
        };
      });

    console.log(applicationStatus);
    return applicationStatus;
  };
  return useQuery("APPLICATION_STATUS", () => fetch(), select ? { select: roleWiseSelect } : { select: defaultSelect });
};

export default useApplicationStatus;
