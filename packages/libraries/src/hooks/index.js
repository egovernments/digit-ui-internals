import { useInitStore } from "./store";
import useWorkflowDetails from "./workflow";
import useSessionStorage from "./useSessionStorage";

import useComplaintDetails from "./pgr/useComplaintDetails";
import { useComplaintsList, useComplaintsListByMobile } from "./pgr/useComplaintList";
import useComplaintStatus from "./pgr/useComplaintStatus";
import useComplaintTable from "./pgr/useComplaintTable";
import useComplaintTypes from "./pgr/useComplaintTypes";
import useEmployeeFilter from "./pgr/useEmployeeFilter";
import useInboxData from "./pgr/useInboxData";
import useLocalities from "./pgr/useLocalities";
import useServiceDefs from "./pgr/useServiceDefs";
import useTenants from "./pgr/useTenants";
import useComplaintSubType from "./pgr/useComplaintSubType";

import useTenantsFSM from "./fsm/useTenants";
// import search from "./tl/search"

const pgr = {
  useComplaintDetails,
  useComplaintsList,
  useComplaintsListByMobile,
  useComplaintStatus,
  useComplaintTable,
  useComplaintTypes,
  useEmployeeFilter,
  useInboxData,
  useLocalities,
  useServiceDefs,
  useTenants,
  useComplaintSubType,
};

// const fsm = {
//   useTenantsFSM,
// };

const tl = {
  search,
};
const Hooks = { useSessionStorage, useWorkflowDetails, useInitStore, pgr, fsm, tl };

export default Hooks;
