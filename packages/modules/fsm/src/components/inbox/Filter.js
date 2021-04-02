import React from "react";
import { Dropdown, RadioButtons, ActionBar, RemoveableTag, CloseSvg, Loader } from "@egovernments/digit-ui-react-components";
import { useSelector } from "react-redux";
import { ApplyFilterBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import Status from "./Status";
import AssignedTo from "./AssignedTo";
import Localities from "../../components/LocalityDropdown/Localities";

const Filter = ({ searchParams, onFilterChange, onSearch, removeParam, ...props }) => {
  const { t } = useTranslation();

  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;
  const isFstpOperator = Digit.UserService.hasAccess("FSTP") || false;

  // const hideLocalityFilter = Digit.UserService.hasAccess(["FSM_CREATOR_EMP", "FSM_VIEW_EMP"]);

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = tenantId.split(".")[0];

  const { data: roleStatuses, isFetched: isRoleStatusFetched } = Digit.Hooks.fsm.useMDMS(state, "DIGIT-UI", "RoleStatusMapping");

  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo.info.roles.map((roleData) => roleData.code);

  const userRoleDetails = roleStatuses?.filter((roleDetails) => userRoles.filter((role) => role === roleDetails.userRole)[0]);

  const mergedRoleDetails = userRoleDetails?.reduce(
    (merged, details) => ({
      fixed: details?.fixed && merged?.fixed,
      statuses: [...merged?.statuses, ...details?.statuses].filter((item, pos, self) => self.indexOf(item) == pos),
      zeroCheck: details?.zeroCheck || merged?.zeroCheck,
    }),
    { statuses: [] }
  );

  // const localities = useSelector((state) => state.common.revenue_localities[tenantId]);
  // console.log("find use query localities here", localities)
  // debugger
  const selectLocality = (d) => {
    onFilterChange({ locality: [...searchParams?.locality, d] });
  };

  const onStatusChange = (e, type) => {
    if (e.target.checked) onFilterChange({ applicationStatus: [...searchParams?.applicationStatus, type] });
    else onFilterChange({ applicationStatus: searchParams?.applicationStatus.filter((option) => type.name !== option.name) });
  };

  const clearAll = () => {
    onFilterChange({ applicationStatus: [], locality: [], uuid: { code: "ASSIGNED_TO_ME", name: "Assigned to Me" } });
    props?.onClose?.();
  };

  return (
    <React.Fragment>
      <div className="filter" style={{ marginTop: isFstpOperator ? "-0px" : "revert" }}>
        <div className="filter-card">
          <div className="heading">
            <div className="filter-label">{t("ES_COMMON_FILTER_BY")}:</div>
            <div className="clearAll" onClick={clearAll}>
              {t("ES_COMMON_CLEAR_ALL")}
            </div>
            {props.type === "desktop" && (
              <span className="clear-search" onClick={clearAll}>
                {t("ES_COMMON_CLEAR_ALL")}
              </span>
            )}
            {props.type === "mobile" && (
              <span onClick={props.onClose}>
                <CloseSvg />
              </span>
            )}
          </div>
          <div>
            {!DSO && !isFstpOperator && searchParams && (
              <AssignedTo onFilterChange={onFilterChange} searchParams={searchParams} tenantId={tenantId} t={t} />
            )}
            <div>
              {/* {GetSelectOptions(t("ES_INBOX_LOCALITY"), localities, selectedLocality, onSelectLocality, "code", onRemove, "locality", "name")} */}
            </div>
            {/* <Status applications={props.applications} onAssignmentChange={handleAssignmentChange} fsmfilters={searchParams} /> */}
          </div>

          {mergedRoleDetails?.statuses?.length > 0 ? (
            <div>
              <div className="filter-label">{t("ES_INBOX_LOCALITY")}</div>
              {/* <Dropdown option={localities} keepNull={true} selected={null} select={selectLocality} optionKey={"name"} /> */}
              <Localities selectLocality={selectLocality} tenantId={tenantId} />
              <div className="tag-container">
                {searchParams?.locality.map((locality, index) => {
                  return (
                    <RemoveableTag
                      key={index}
                      text={locality.name}
                      onClick={() => {
                        onFilterChange({ locality: searchParams?.locality.filter((loc) => loc.code !== locality.code) });
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ) : null}
          <div>
            {isRoleStatusFetched && mergedRoleDetails ? (
              <Status onAssignmentChange={onStatusChange} fsmfilters={searchParams} mergedRoleDetails={mergedRoleDetails} />
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </div>
      {props.type === "mobile" && (
        <ActionBar>
          <ApplyFilterBar
            submit={false}
            labelLink={t("ES_COMMON_CLEAR_ALL")}
            buttonLink={t("ES_COMMON_FILTER")}
            onClear={clearAll}
            onSubmit={() => {
              if (props.type === "mobile") onSearch({ delete: ["applicationNos"] });
              else onSearch();
            }}
            style={{ flex: 1 }}
          />
        </ActionBar>
      )}
    </React.Fragment>
  );
};

export default Filter;
