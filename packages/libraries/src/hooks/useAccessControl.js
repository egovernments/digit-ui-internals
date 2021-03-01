import { useQuery } from "react-query";
import { UserService } from "../services/elements/User/index";
import { MdmsService } from "../services/elements/MDMS";

const useAccessControl = () => {
  const info = Digit.UserService.getUser()?.info;
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateCode = tenantId.split(".")[0];
  const roleCodes = info.roles.filter((e) => e.tenantId === tenantId).map((e) => e.code);

  return useQuery("ACCESS_CONTROL", async () => {
    const { actions: roleAccess } = await UserService.accessControl(stateCode, roleCodes);

    const {
      "DIGIT-UI": { RoleActionMetadata: metadata },
    } = await MdmsService.getRoleActionMetadata(stateCode, "DIGIT-UI");

    console.log("find data here", roleAccess, metadata);

    return metadata.filter((meta) => roleAccess.filter((role) => meta.actionId === role.id)[0]);
  });
};

export default useAccessControl;
