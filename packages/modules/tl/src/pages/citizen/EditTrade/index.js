import React,{useEffect} from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Redirect, Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { newConfig } from "../../../config/config";
import CheckPage from "../Create/CheckPage";
import TLAcknowledgement from "../Create/TLAcknowledgement";
import {getCommencementDataFormat, gettradeunits} from "../../../utils/index";

const getTradeEditDetails = (data) => {

    const gettradeaccessories = (tradeacceserioies) => {
      let acc = [];
      tradeacceserioies && tradeacceserioies.map((ob) => {
        acc.push({
          accessory:{code:`${ob.accessoryCategory}`,i18nKey:`TRADELICENSE_ACCESSORIESCATEGORY_${ob.accessoryCategory.replaceAll("-","_")}`},
          accessorycount:ob.count,
          unit: `${ob.uom}`,
          uom: `${ob.uomValue}`,
        })
      })
      return acc;
    }

    const gettradeunits = (tradeunits) =>{
      let units = [];
      tradeunits && tradeunits.map((ob)=>{
          units.push({
              tradecategory:{i18nKey:`TRADELICENSE_TRADETYPE_${ob.tradeType.split(".")[0]}`, code:`${ob.tradeType.split(".")[0]}`},
              tradesubtype:{i18nKey:`TL_${ob.tradeType}`,code:`${ob.tradeType}`},
              tradetype:{i18nKey:`TRADELICENSE_TRADETYPE_${ob.tradeType.split(".")[1]}`,code:`${ob.tradeType.split(".")[1]}`},
              unit:ob.uom,
              uom:ob.uomValue,
          });
      })
      return units;
  };

  const gettradedocuments = (docs) => {
    let documents = [];
    docs && docs.map((ob) => {
      if(ob.documentType.includes("OWNERPHOTO"))
      {
        documents["OwnerPhotoProof"] = ob;
      }
      else if(ob.documentType.includes("OWNERIDPROOF")){
        documents["ProofOfIdentity"] = ob;
      }
      else if(ob.documentType.includes("OWNERSHIPPROOF")){
        documents["ProofOfOwnership"] = ob;
      }
    })
    return documents;
  }

  const gettradeowners = (owner) => {
    let ownerarray=[];
    owner && owner.map((ob) => {
      ownerarray.push({
        gender:{code:`${ob.gender}`,name:`${!ob?.gender.includes("FEMALE")?"Male":"Female"}`,value:`${!ob?.gender.includes("FEMALE")?"Male":"Female"}`},
        isprimaryowner: false,
        name:ob.name,
        mobilenumber:ob.mobileNumber,
        permanentAddress:ob.permanentAddress,
      })
    })
    // ownerarray["permanentAddress"]=owner.permanentAddress;
    return ownerarray;
  }


    data.TradeDetails={
        BuildingType:{code:`${data?.tradeLicenseDetail?.structureType}`,i18nKey:`COMMON_MASTERS_STRUCTURETYPE_${data.tradeLicenseDetail?.structureType.replaceAll(".","_")}`},
        CommencementDate:getCommencementDataFormat(data?.commencementDate),
        StructureType:{code:`${data.tradeLicenseDetail?.structureType.split(".")[0]}`, i18nKey:`${data.tradeLicenseDetail?.structureType.includes("IMMOVABLE")?"TL_COMMON_NO":"TL_COMMON_YES"}`},
        TradeName:data?.tradeName,
        accessories:gettradeaccessories(data?.tradeLicenseDetail?.accessories),
        isAccessories:gettradeaccessories(data?.tradeLicenseDetail?.accessories)?{code:`RESIDENTIAL`,i18nKey:"TL_COMMON_YES"}:{code:`NONRESIDENTIAL`,i18nKey:"TL_COMMON_NO"},
        units: gettradeunits(data?.tradeLicenseDetail?.tradeUnits),
    }
    data.address = {};
    if (data?.tradeLicenseDetail?.address?.geoLocation?.latitude && data?.tradeLicenseDetail?.address?.geoLocation?.longitude) {
      data.address.geoLocation = {
        latitude: data?.tradeLicenseDetail?.address?.geoLocation?.latitude,
        longitude: data?.tradeLicenseDetail?.address?.geoLocation?.longitude,
      };
    } else {
      data.address.geoLocation = {};
    }
    data.address.doorNo=data?.tradeLicenseDetail?.address?.doorNo;
    data.address.street = data?.tradeLicenseDetail?.address?.street;
    data.address.landmark = data?.tradeLicenseDetail?.address?.landmark;
    data.address.pincode = data?.tradeLicenseDetail?.address?.pincode;
    data.address.city = { code: data?.tradeLicenseDetail?.address?.tenantId };
    data.address.locality = data?.tradeLicenseDetail?.address?.locality;
    data.address.locality.i18nkey = data?.tenantId.replace(".", "_").toUpperCase() + "_" + "REVENUE" + "_" + data?.address?.locality?.code;
    data.address.locality.doorNo = data?.tradeLicenseDetail?.address?.doorNo;
    data.address.locality.landmark = data?.tradeLicenseDetail?.address?.landmark;

    data.owners ={
      documents : gettradedocuments(data?.tradeLicenseDetail?.applicationDocuments),
      owners : gettradeowners(data?.tradeLicenseDetail?.owners),
      permanentAddress : data?.tradeLicenseDetail?.owners[0].permanentAddress,
      isCorrespondenceAddress : true,
    }
    data.ownershipCategory={code:`${data?.tradeLicenseDetail?.subOwnerShipCategory}`,i18nKey:`PT_OWNERSHIP_${data?.tradeLicenseDetail?.subOwnerShipCategory.split(".")[1]}`,value:`${data?.tradeLicenseDetail?.subOwnerShipCategory}`};

    return data;

}

const EditTrade = ({ parentRoute }) => {
  const queryClient = useQueryClient();
  const match = useRouteMatch();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const history = useHistory();
  let config = [];
  let application ={};
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("PT_CREATE_TRADE", {});
  const editProperty = window.location.href.includes("edit");
//   const typeOfProperty = window.location.href.includes("UPDATE") ? true : false;
  const tlTrade = JSON.parse(sessionStorage.getItem("tl-trade")) || {};
  const data = { licenses: [tlTrade] };

  useEffect(() => {
    application = data?.licenses && data.licenses[0] && data.licenses[0];
    if (data && application) {
      application = data?.licenses[0];
      if (editProperty) {
        // application.isUpdateProperty = true;
        application.isEditProperty = true;
      }
      sessionStorage.setItem("tradeInitialObject", JSON.stringify({ ...application }));
      let tradeEditDetails = getTradeEditDetails(application);
      setParams({ ...params, ...tradeEditDetails });
    }
  }, []);

  const goNext = (skipStep, index, isAddMultiple, key) => {
    let currentPath = pathname.split("/").pop(),
      lastchar = currentPath.charAt(currentPath.length - 1),
      isMultiple = false,
      nextPage;
    let { nextStep = {} } = config.find((routeObj) => routeObj.route === currentPath);
    if (typeof nextStep == "object" && nextStep != null) {
      if (nextStep[sessionStorage.getItem("isAccessories")]) {
        nextStep = `${nextStep[sessionStorage.getItem("isAccessories")]}`;
      } else if (nextStep[sessionStorage.getItem("StructureType")]) {
        nextStep = `${nextStep[sessionStorage.getItem("StructureType")]}`;
      }
    }
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

    nextPage = `${match.path}/${nextStep}`;

    redirectWithHistory(nextPage);
  };

  const createProperty = async () => {
    history.push(`${match.path}/acknowledgement`);
  };

  function handleSelect(key, data, skipStep, index, isAddMultiple = false) {
    /* if (key === "owners") {
      let owners = params.owners || [];
      owners[index] = data;
      setParams({ ...params, ...{ [key]: [...owners] } });
    } else {
      setParams({ ...params, ...{ [key]: { ...params[key], ...data } } });
    } */
    setParams({ ...params, ...{ [key]: { ...params[key], ...data } } });
    goNext(skipStep, index, isAddMultiple, key);
  }

  const handleSkip = () => {};
  const handleMultiple = () => {};

  const onSuccess = () => {
    //clearParams();
    //sessionStorage.removeItem("isDirectRenewal");
    queryClient.invalidateQueries("TL_CREATE_TRADE");
  };
  newConfig.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });
  config.indexRoute = "check";

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
        <TLAcknowledgement data={params} onSuccess={onSuccess} />
      </Route>
      <Route>
        <Redirect to={`${match.path}/${config.indexRoute}`} />
      </Route>
    </Switch>
  );
};

export default EditTrade;