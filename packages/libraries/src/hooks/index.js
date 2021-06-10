import { useInitStore } from "./store";
import useWorkflowDetails from "./workflow";
import useSessionStorage from "./useSessionStorage";
import useQueryParams from "./useQueryParams";
import useClickOutside from "./useClickOutside";
import useCoreData from "./useCoreData";
import {
  useFetchPayment,
  usePaymentUpdate,
  useFetchCitizenBillsForBuissnessService,
  useFetchBillsForBuissnessService,
  useGetPaymentRulesForBusinessServices,
  useDemandSearch,
} from "./payment";
import { useUserSearch } from "./userSearch";
import { useApplicationsForBusinessServiceSearch } from "./useApplicationForBillSearch";
import useBoundaryLocalities from "./useLocalities";
import useCommonMDMS from "./useMDMS";
import useInboxGeneral from "./useInboxGeneral/useInboxGeneral";
import useApplicationStatusGeneral from "./useStatusGeneral";
import useModuleTenants from "./useModuleTenants";

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
import useComplaintStatusCount from "./pgr/useComplaintStatusWithCount";

import useTenantsFSM from "./fsm/useTenants";
import useDesludging from "./fsm/useDesludging";
import useApplicationStatus from "./fsm/useApplicationStatus";
import useMDMS from "./fsm/useMDMS";
import useSearch from "./fsm/useSearch";
import useSearchAll from "./fsm/useSearchAll";
import useVehicleSearch from "./fsm/useVehicleSearch";
import useVehicleUpdate from "./fsm/useVehicleUpdate";
import useInbox from "./fsm/useInbox";
import useApplicationUpdate from "./fsm/useApplicationUpdate";
import useWorkflowData from "./fsm/useWorkflowData";
import useRouteSubscription from "./fsm/useRouteSubscription";
import useDsoSearch from "./fsm/useDsoSearch";
import usePropertySearch from "./pt/usePropertySearch";
import usePropertyPayment from "./pt/usePropertyPayment";
import useApplicationDetail from "./fsm/useApplicationDetail";
import useApplicationActions from "./fsm/useApplicationActions";
import useApplicationAudit from "./fsm/useApplicationAudit";
import useSearchForAuditData from "./fsm/useSearchForAudit";
import useVehiclesSearch from "./fsm/useVehiclesSearch";
import useConfig from "./fsm/useConfig";
import useVendorDetail from "./fsm/useVendorDetail";
import useSlum from "./fsm/useSlum";
import usePaymentHistory from "./fsm/usePaymentHistory";

import useEmployeeSearch from "./useEmployeeSearch";

import usePropertyMDMS from "./pt/usePropertyMDMS";
import usePropertyAPI from "./pt/usePropertyAPI";
import usePropertyDocumentSearch from "./pt/usePropertyDocumentSearch";
import useTenantsPT from "./pt/useTenants";
import usePtApplicationDetail from "./pt/useApplicationDetail";
import usePtApplicationActions from "./pt/useApplicationActions";
import usePtMDMS from "./pt/useMDMS";
import usePropertyAssessment from "./pt/usePropertyAssessment";
import usePtCalculationEstimate from "./pt/usePtCalculationEstimate";

import useDssMdms from "./dss/useMDMS";
import useDashboardConfig from "./dss/useDashboardConfig";
import useDSSDashboard from "./dss/useDSSDashboard";
import useGetChart from "./dss/useGetChart";

import useMCollectMDMS from "./mcollect/useMCollectMDMS";
import useMCollectSearch from "./mcollect/useMCollectSearch";
import useMcollectSearchBill from "./mcollect/useMcollectSearchBill";
import usemcollectTenants from "./mcollect/useTenants";

import useTenantsTL from "./tl/useTenants";
import useTradeLicenseMDMS from "./tl/useTradeLicenseMDMS";

import useHRMSSearch from "./hrms/useHRMSsearch";
import useHrmsMDMS from "./hrms/useHRMSMDMS";
import useHRMSCreate from "./hrms/useHRMScreate";
import useHRMSUpdate from "./hrms/useHRMSUpdate";
import useHRMSCount from "./hrms/useHRMSCount";

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
  usePropertyMDMS,
  useComplaintStatusCount,
};

const fsm = {
  useTenants: useTenantsFSM,
  useDesludging: useDesludging,
  useMDMS: useMDMS,
  useSearch,
  useRouteSubscription,
  useSearchAll,
  useInbox,
  useApplicationUpdate,
  useApplicationStatus,
  useWorkflowData,
  useDsoSearch,
  useApplicationDetail,
  useApplicationActions,
  useApplicationAudit,
  useSearchForAuditData,
  useVehicleSearch,
  useVehicleUpdate,
  useVendorDetail,
  useVehiclesSearch,
  useConfig,
  useSlum,
  usePaymentHistory,
};

const pt = {
  usePropertySearch,
  usePropertyPayment,
  usePropertyMDMS,
  usePropertyAPI,
  usePropertyDocumentSearch,
  useTenants: useTenantsPT,
  useApplicationDetail: usePtApplicationDetail,
  useApplicationActions: usePtApplicationActions,
  useMDMS: usePtMDMS,
  usePropertyAssessment,
  usePtCalculationEstimate,
};

const dss = {
  useMDMS: useDssMdms,
  useDashboardConfig,
  useDSSDashboard,
  useGetChart,
};

const mcollect = {
  useMCollectMDMS,
  useMCollectSearch,
  useMcollectSearchBill,
  usemcollectTenants,
};

const hrms = {
  useHRMSSearch,
  useHrmsMDMS,
  useHRMSCreate,
  useHRMSUpdate,
  useHRMSCount
}
const tl = {
  useTenants: useTenantsTL,
  useTradeLicenseMDMS,
};

const Hooks = {
  useSessionStorage,
  useQueryParams,
  useFetchPayment,
  usePaymentUpdate,
  useFetchCitizenBillsForBuissnessService,
  useFetchBillsForBuissnessService,
  useGetPaymentRulesForBusinessServices,
  useWorkflowDetails,
  useInitStore,
  useClickOutside,
  useCoreData,
  useUserSearch,
  useApplicationsForBusinessServiceSearch,
  useDemandSearch,
  useInboxGeneral,
  useEmployeeSearch,
  useBoundaryLocalities,
  useCommonMDMS,
  useApplicationStatusGeneral,
  useModuleTenants,
  pgr,
  fsm,
  pt,
  dss,
  mcollect,
  hrms,
  tl,
};

export default Hooks;
