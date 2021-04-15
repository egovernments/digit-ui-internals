// import React from "react";
import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { newConfig } from "../../../config/Create/config";
import CheckPage from "../Create/CheckPage";
import PTAcknowledgement from "../Create/PTAcknowledgement";

const getPropertyEditDetails = (data = {}) => {
  // converting owners details
  if (data?.ownershipCategory === "INSTITUTIONALPRIVATE" || data?.ownershipCategory === "INSTITUTIONALGOVERNMENT") {
    let document = [];
    if (data?.owners[0]?.documents?.documentType == "IDENTITYPROOF") {
      document["proofIdentity"] = data?.owners[0]?.documents[0];
    }
    data.owners[0].designation = data?.institution?.designation,
      data.owners[0].inistitutionName = data?.institution?.name,
      data.owners[0].name = data?.institution?.nameOfAuthorizedPerson,
      data.owners[0].inistitutetype = { value: data?.institution.type, code: data?.institution.type },
      data.owners[0].documents = document
  } else {
    data.owners.map((owner) => {
      let document = [];
      owner.documents && owner.documents.map(doc => {
        if (doc.documentType == "SPECIAL_CATEGORY_PROOF") {
          document["specialProofIdentity"] = doc;
        }
        if (doc.documentType == "IDENTITYPROOF") {
          document["proofIdentity"] = doc;
        }
      });
      owner.emailId = owner?.emailId;
      owner.fatherOrHusbandName = owner?.fatherOrHusbandName;
      owner.isCorrespondenceAddress = owner?.isCorrespondenceAddress;
      owner.mobileNumber = owner?.mobileNumber;
      owner.name = owner?.name;
      owner.permanentAddress = owner?.permanentAddress;
      owner.gender = { code: owner?.gender };
      owner.ownerType = { code: owner?.ownerType };
      owner.relationship = { code: owner?.relationship };
      owner.documents = document;
    });
  }
  //converting ownershipCategory
  data.ownershipCategory = { code: data?.ownershipCategory, value: data?.ownershipCategory }

  //converting address details
  if ((data?.address?.geoLocation?.latitude && data?.address?.geoLocation?.longitude)) {
    data.address.geoLocation = {
      latitude: data?.address?.geoLocation?.latitude,
      longitude: data?.address?.geoLocation?.longitude
    }
  } else {
    data.address.geoLocation = {}
  }
  data.address.pincode = data?.address?.pincode;
  let addressDocs = data.documents.filter(doc => doc.documentType == "ADDRESSPROOF");
  data.documents["ProofOfAddress"] = addressDocs[0];

  // asessment details
  data.PropertyType = data?.additionalDetails?.propertyType;
  data.isResdential = data?.additionalDetails?.isResdential;
  data.landarea = { floorarea: data?.landArea };

  return data;
}
const EditProperty = ({ parentRoute }) => {
  debugger;
  const queryClient = useQueryClient();
  const match = useRouteMatch();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const history = useHistory();
  let config = [];
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("PT_CREATE_PROPERTY", {});
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const acknowledgementIds = window.location.href.split('/').pop();
  let application = {};
  const { isLoading, isError, error, data } = Digit.Hooks.pt.usePropertySearch({
    tenantId,
    filters: { acknowledgementIds },
  });
  sessionStorage.setItem("isEditApplication", false);

  useEffect(() => {
    application = data?.Properties[0];
    if (data && application) {
      application = data?.Properties[0];
      let propertyEditDetails = getPropertyEditDetails(application);
      setParams({ ...params, ...propertyEditDetails });
    }
  }, [data]);

  // const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("PT_CREATE_PROPERTY", application);


  const goNext = (skipStep, index, isAddMultiple, key) => {
    let currentPath = pathname.split("/").pop(),
      lastchar = currentPath.charAt(currentPath.length - 1),
      isMultiple = false,
      nextPage;
    if (Number(parseInt(currentPath)) || currentPath == "0" || currentPath == "-1") {
      if (currentPath == "-1" || currentPath == "-2") {
        currentPath = pathname.slice(0, -3);
        currentPath = currentPath.split("/").pop();
        isMultiple = true;
      } else {
        currentPath = pathname.slice(0, -2);
        currentPath = currentPath.split("/").pop();
        isMultiple = true;
      }
    } else {
      isMultiple = false;
    }
    if (!isNaN(lastchar)) {
      isMultiple = true;
    }
    let { nextStep = {} } = config.find((routeObj) => routeObj.route === currentPath);
    if (typeof nextStep == "object" && nextStep != null && isMultiple != false) {
      if (nextStep[sessionStorage.getItem("ownershipCategory")]) {
        nextStep = `${nextStep[sessionStorage.getItem("ownershipCategory")]}/${index}`;
      } else if (nextStep[sessionStorage.getItem("IsAnyPartOfThisFloorUnOccupied")]) {
        if (`${nextStep[sessionStorage.getItem("IsAnyPartOfThisFloorUnOccupied")]}` === "un-occupied-area") {
          nextStep = `${nextStep[sessionStorage.getItem("IsAnyPartOfThisFloorUnOccupied")]}/${index}`;
        } else {
          nextStep = `${nextStep[sessionStorage.getItem("IsAnyPartOfThisFloorUnOccupied")]}`;
        }
      } else if (nextStep[sessionStorage.getItem("area")]) {
        // nextStep = `${nextStep[sessionStorage.getItem("area")]}/${index}`;

        if (`${nextStep[sessionStorage.getItem("area")]}` !== "map") {
          nextStep = `${nextStep[sessionStorage.getItem("area")]}/${index}`;
        } else {
          nextStep = `${nextStep[sessionStorage.getItem("area")]}`;
        }
      } else if (nextStep[sessionStorage.getItem("IsThisFloorSelfOccupied")]) {
        nextStep = `${nextStep[sessionStorage.getItem("IsThisFloorSelfOccupied")]}/${index}`;
      } else {
        nextStep = `${nextStep[sessionStorage.getItem("noOofBasements")]}/${index}`;
        //nextStep = `${"floordetails"}/${index}`;
      }
    }
    if (typeof nextStep == "object" && nextStep != null && isMultiple == false) {
      if (nextStep[sessionStorage.getItem("IsAnyPartOfThisFloorUnOccupied")]) {
        nextStep = `${nextStep[sessionStorage.getItem("IsAnyPartOfThisFloorUnOccupied")]}`;
      } else if (nextStep[sessionStorage.getItem("area")]) {
        nextStep = `${nextStep[sessionStorage.getItem("area")]}`;
      } else if (nextStep[sessionStorage.getItem("IsThisFloorSelfOccupied")]) {
        nextStep = `${nextStep[sessionStorage.getItem("IsThisFloorSelfOccupied")]}`;
      } else if (nextStep[sessionStorage.getItem("PropertyType")]) {
        nextStep = `${nextStep[sessionStorage.getItem("PropertyType")]}`;
      } else if (nextStep[sessionStorage.getItem("isResdential")]) {
        nextStep = `${nextStep[sessionStorage.getItem("isResdential")]}`;
      }
    }
    /* if (nextStep === "is-this-floor-self-occupied") {
      isMultiple = false;
    } */
    let redirectWithHistory = history.push;
    if (skipStep) {
      redirectWithHistory = history.replace;
    }
    if (isAddMultiple) {
      nextStep = key;
    }
    if (nextStep === null) {
      return redirectWithHistory(`${match.path}/check`);
    }
    if (!isNaN(nextStep.split("/").pop())) {
      nextPage = `${match.path}/${nextStep}`;
    } else {
      nextPage = isMultiple && nextStep !== "map" ? `${match.path}/${nextStep}/${index}` : `${match.path}/${nextStep}`;
    }

    redirectWithHistory(nextPage);
  };

  const createProperty = async () => {
    history.push(`${match.path}/acknowledgement`);
  };

  function handleSelect(key, data, skipStep, index, isAddMultiple = false) {
    debugger;
    if (key === "owners") {
      let owners = params.owners || [];
      owners[index] = data;
      setParams({ ...params, ...{ [key]: [...owners] } });
    } else if (key === "units") {
      let units = params.units || [];
      units[index] = data;
      setParams({ ...params, units });
    } else {
      setParams({ ...params, ...{ [key]: { ...params[key], ...data } } });
    }
    goNext(skipStep, index, isAddMultiple, key);
  }

  const handleSkip = () => { };
  const handleMultiple = () => { };

  const onSuccess = () => {
    clearParams();
    queryClient.invalidateQueries("PT_CREATE_PROPERTY");
  };
  newConfig.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });
  config.indexRoute = `isResidential`;

  return (
    <Switch>
      {config.map((routeObj, index) => {
        const { component, texts, inputs, key } = routeObj;
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return (
          <Route path={`${match.path}/${routeObj.route}`} key={index}>
            <Component config={{ texts, inputs, key }} onSelect={handleSelect} onSkip={handleSkip} t={t} formData={params} onAdd={handleMultiple} />
          </Route>
        );
      })}
      <Route path={`${match.path}/check`}>
        <CheckPage onSubmit={createProperty} value={params} />
      </Route>
      <Route path={`${match.path}/acknowledgement`}>
        <PTAcknowledgement data={params} onSuccess={onSuccess} />
      </Route>
      <Route>
        <Redirect to={`${match.path}/${config.indexRoute}`} />
      </Route>
    </Switch>
  );
};

export default EditProperty;
