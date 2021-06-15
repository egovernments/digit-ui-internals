import React, { useEffect, useState } from "react";
import { CardLabel, LabelFieldPair, Dropdown, MultiSelectDropdown, Loader, LinkButton } from "@egovernments/digit-ui-react-components";
import cleanup from "../Utils/cleanup";

const Jurisdictions = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: data = {}, isLoading } = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation") || {};
  const [jurisdictions, setjurisdictions] = useState(
    formData?.Jurisdictions || [
      {
        id: undefined,
        key: 1,
        hierarchy: null,
        boundaryType: null,
        boundary: null,
        roles: [],
      },
    ]
  );

  useEffect(() => {
    const jurisdictionsData = jurisdictions?.map((jurisdiction) => {
      let res = {
        id: jurisdiction?.id,
        hierarchy: jurisdiction?.hierarchy?.code,
        boundaryType: jurisdiction?.boundaryType?.label,
        boundary: jurisdiction?.boundary?.code,
        tenantId: jurisdiction?.boundary?.code,
      };
      res = cleanup(res);
      if (jurisdiction?.roles) {
        res["roles"] = jurisdiction?.roles;
      }
      return res;
    });

    onSelect(
      config.key,
      jurisdictionsData.filter((value) => Object.keys(value).length !== 0)
    );
  }, [jurisdictions]);

  const handleAddUnit = () => {
    setjurisdictions((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        hierarchy: null,
        boundaryType: null,
        boundary: null,
        roles: [],
      },
    ]);
  };
  let hierarchylist = [];
  let boundaryTypeoption = [];
  const [focusIndex, setFocusIndex] = useState(-1);

  function gethierarchylistdata() {
    return data?.MdmsRes?.["egov-location"]["TenantBoundary"].map((ele) => ele.hierarchyType);
  }

  function getboundarydata() {
    return [];
  }

  function getroledata() {
    return data?.MdmsRes?.["ACCESSCONTROL-ROLES"].roles;
  }

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      {jurisdictions?.map((jurisdiction, index) => (
        <Jurisdiction
          t={t}
          formData={formData}
          key={index}
          keys={jurisdiction.key}
          data={data}
          jurisdiction={jurisdiction}
          setjurisdictions={setjurisdictions}
          index={index}
          focusIndex={focusIndex}
          setFocusIndex={setFocusIndex}
          gethierarchylistdata={gethierarchylistdata}
          hierarchylist={hierarchylist}
          boundaryTypeoption={boundaryTypeoption}
          getboundarydata={getboundarydata}
          getroledata={getroledata}
        />
      ))}
      <LinkButton label={t("HR_ADD_JURISDICTION")} onClick={handleAddUnit} style={{ color: "orange" }}></LinkButton>
    </div>
  );
};
function Jurisdiction({ t, data, jurisdiction, setjurisdictions, gethierarchylistdata, hierarchylist, getroledata, roleoption, index }) {
  const [BoundaryType, selectBoundaryType] = useState([]);
  const [Boundary, selectboundary] = useState([]);
  useEffect(() => {
    selectBoundaryType(
      data?.MdmsRes?.["egov-location"]["TenantBoundary"]
        .filter((ele) => {
          return ele?.hierarchyType?.code == jurisdiction?.hierarchy?.code;
        })
        .map((item) => item.boundary)
    );
  }, [jurisdiction?.hierarchy, data?.MdmsRes]);

  useEffect(() => {
    selectboundary(data?.MdmsRes?.tenant?.tenants);
  }, [jurisdiction?.boundaryType, data?.MdmsRes]);

  useEffect(() => {
    if (Boundary?.length > 0) {
      selectedboundary(Boundary?.filter((ele) => ele.code == jurisdiction?.boundary?.code)[0]);
    }
  }, [Boundary]);

  const selectHierarchy = (value) => {
    setjurisdictions((pre) => pre.map((item) => (item.key === jurisdiction.key ? { ...item, hierarchy: value } : item)));
  };

  const selectboundaryType = (value) => {
    setjurisdictions((pre) => pre.map((item) => (item.key === jurisdiction.key ? { ...item, boundaryType: value } : item)));
  };

  const selectedboundary = (value) => {
    setjurisdictions((pre) => pre.map((item) => (item.key === jurisdiction.key ? { ...item, boundary: value } : item)));
  };

  const selectrole = (e, data) => {
    const index = jurisdiction?.roles.filter((ele=> ele.code==data.code));
    let res = null;
    if (index.length) {
      jurisdiction?.roles.splice(jurisdiction?.roles.indexOf(index[0]), 1);
      res = jurisdiction.roles;
    } else {
      res = [...data, ...jurisdiction?.roles];
    }

    // if (checked) selectULB(data.code);
    setjurisdictions((pre) => pre.map((item) => (item.key === jurisdiction.key ? { ...item, roles: res } : item)));
  };

  return (
    <div key={jurisdiction?.keys} style={{ marginBottom: "16px" }}>
      <div className="label-field-pair">
        <h2 className="card-label card-label-smaller" style={{ color: "#505A5F" }}>
        {t("HR_JURISDICTION")} {index + 1}
        </h2>
      </div>
      <div style={{ border: "1px solid #E3E3E3", padding: "16px", marginTop: "8px" }}>
        <LabelFieldPair>
          <CardLabel isMandatory={true} className="card-label-smaller">{`${t("HR_HIERARCHY_LABEL")} * `}</CardLabel>
          <Dropdown
            className="form-field"
            selected={jurisdiction?.hierarchy}
            disable={false}
            isMandatory={true}
            option={gethierarchylistdata(hierarchylist) || []}
            select={selectHierarchy}
            optionKey="code"
            t={t}
          />
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">{`${t("HR_BOUNDARY_TYPE_LABEL")} * `}</CardLabel>
          <Dropdown
            className="form-field"
            isMandatory={true}
            selected={jurisdiction?.boundaryType}
            disable={BoundaryType?.length === 0}
            option={BoundaryType}
            select={selectboundaryType}
            optionKey="label"
            t={t}
          />
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">{`${t("HR_BOUNDARY_LABEL")} * `}</CardLabel>
          <Dropdown
            className="form-field"
            isMandatory={true}
            selected={jurisdiction?.boundary}
            disable={Boundary?.length === 0}
            option={Boundary}
            select={selectedboundary}
            optionKey="name"
            t={t}
          />
        </LabelFieldPair>

        <LabelFieldPair>
          <CardLabel className="card-label-smaller">Roles *</CardLabel>
          <div className="form-field">
            <MultiSelectDropdown
              className="form-field"
              isMandatory={true}
              selected={jurisdiction?.roles}
              options={getroledata(roleoption)}
              onSelect={selectrole}
              optionsKey="name"
              t={t}
            />
          </div>
        </LabelFieldPair>
      </div>
    </div>
  );
}

export default Jurisdictions;
