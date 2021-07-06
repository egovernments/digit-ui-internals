import React, { useState, useEffect } from "react";
import { FormComposer ,Toast} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { newConfig } from "../../components/config/config";
import { convertEpochToDate } from "../../components/Utils";

const EditForm = ({tenantId, data }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [canSubmit, setSubmitValve] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [phonecheck, setPhonecheck] = useState(false);
  const [checkfield, setcheck]= useState(false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_ERROR_DATA", false);
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_HAPPENED", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_SUCCESS_DATA", false);

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);
  
  useEffect(() => {
    if (mobileNumber&&mobileNumber.length==10&&mobileNumber.match(Digit.Utils.getPattern('MobileNo'))) {
      setShowToast(null);
      if(data.user.mobileNumber==mobileNumber){
        setPhonecheck(true);
      }else {
        Digit.HRMSService.search(tenantId, null, { phone: mobileNumber }).then((result, err) => {
          if (result.Employees.length > 0) {
            setShowToast({ key: true, label: "ERR_HRMS_USER_EXIST_MOB" });
            setPhonecheck(false);
          } else {
            setPhonecheck(true);
          }
        });
      }
    } else {
      setPhonecheck(false);
    }
  }, [mobileNumber]);

  const defaultValues = {
    tenantId: tenantId,
    employeeStatus: "EMPLOYED",
    employeeType: data?.code,
    SelectEmployeePhoneNumber: { mobileNumber: data?.user?.mobileNumber },
    SelectEmployeeId: { code: data?.code },
    SelectEmployeeName: { employeeName: data?.user?.name },
    SelectEmployeeEmailId: { emailId: data?.user?.emailId },
    SelectEmployeeCorrespondenceAddress: { correspondenceAddress: data?.user?.correspondenceAddress },
    SelectDateofEmployment: { dateOfAppointment: convertEpochToDate(data?.dateOfAppointment) },
    SelectEmployeeType: { code: data?.employeeType, active: true },
    SelectEmployeeGender: {
      gender: {
        code: data?.user?.gender,
        name: `COMMON_GENDER_${data?.user?.gender}`,
      },
    },

    SelectDateofBirthEmployment: { dob: convertEpochToDate(data?.user?.dob) },
    Jurisdictions: data?.jurisdictions.map((ele, index) => {
      return Object.assign({}, ele, {
        key: index,
        hierarchy: {
          code: ele.hierarchy,
          name: ele.hierarchy,
        },
        boundaryType: { label: ele.boundaryType },
        boundary: { code: ele.boundary },
        roles: data?.user?.roles.filter((item) => item.tenantId == ele.boundary),
      });
    }),
    Assignments: data?.assignments.map((ele, index) => {
      return Object.assign({}, ele, {
        key: index,
        fromDate: convertEpochToDate(ele.fromDate),
        toDate: convertEpochToDate(ele.toDate),
        isCurrentAssignment: ele.isCurrentAssignment,
        designation: {
          code: ele.designation,
          i18key: "COMMON_MASTERS_DESIGNATION_" + ele.designation,
        },
        department: {
          code: ele.department,
          i18key: "COMMON_MASTERS_DEPARTMENT_" + ele.department,
        },
      });
    }),
  };

const checkMailNameNum=(formData)=>
{
  const email=formData?.SelectEmployeeEmailId?.emailId||'';
  const name=formData?.SelectEmployeeName?.employeeName||'';
  const validEmail=email.length==0?true:email.match(Digit.Utils.getPattern('Email'));
return validEmail&&name.match(Digit.Utils.getPattern('Name'));
}

  const onFormValueChange = (setValue = true, formData) => {
    if (formData?.SelectEmployeePhoneNumber?.mobileNumber) {
      setMobileNumber(formData?.SelectEmployeePhoneNumber?.mobileNumber);
    } else {
      setMobileNumber(formData?.SelectEmployeePhoneNumber?.mobileNumber);
    }

    for (let i = 0; i < formData?.Jurisdictions?.length; i++) {
      let key = formData?.Jurisdictions[i];
      console.log(key?.roles?.length)
      if (!(key?.boundary && key?.boundaryType && key?.hierarchy && key?.tenantId && key?.roles?.length > 0)) {
        setcheck(false);
        break;
      } else {
        setcheck(true);
      }
    }

    let setassigncheck = false;
    for (let i = 0; i < formData?.Assignments?.length; i++) {
      let key = formData?.Assignments[i];
      if (
        !(key.department && key.designation && key.fromDate && (formData?.Assignments[i].toDate || formData?.Assignments[i]?.isCurrentAssignment))
      ) {
        setassigncheck = false;
        break;
      } else if (formData?.Assignments[i].toDate == null && formData?.Assignments[i]?.isCurrentAssignment == false) {
        setassigncheck = false;
        break;
      } else {
        setassigncheck = true;
      }
    }
    if (
      formData?.SelectDateofEmployment?.dateOfAppointment &&
      formData?.SelectEmployeeCorrespondenceAddress?.correspondenceAddress &&
      formData?.SelectEmployeeGender?.gender.code &&
      formData?.SelectEmployeeName?.employeeName &&
      formData?.SelectEmployeePhoneNumber?.mobileNumber &&
      checkfield &&
      setassigncheck&&
      phonecheck&&
     checkMailNameNum(formData)
    ) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
  };

  const onSubmit = (input) => {

    if(input.Jurisdictions.filter(juris=>juris.tenantId==tenantId).length==0){
      setShowToast({ key: true, label: "ERR_BASE_TENANT_MANDATORY" });
      return;
    }
    let roles = input?.Jurisdictions?.map((ele) => {
      return ele.roles?.map((item) => {
        item["tenantId"] = ele.boundary;
        return item;
      });
    });
    let requestdata = Object.assign({}, data);
    roles = [].concat.apply([], roles);
    requestdata.assignments = input?.Assignments;
    requestdata.dateOfAppointment = Date.parse(input?.SelectDateofEmployment?.dateOfAppointment);
    requestdata.code = input?.SelectEmployeeId?.code ? input?.SelectEmployeeId?.code : undefined;
    requestdata.jurisdictions = input?.Jurisdictions;
    requestdata.user.emailId = input?.SelectEmployeeEmailId?.emailId ? input?.SelectEmployeeEmailId?.emailId : undefined;
    requestdata.user.gender = input?.SelectEmployeeGender?.gender.code;
    requestdata.user.dob = Date.parse(input?.SelectDateofBirthEmployment?.dob);
    requestdata.user.mobileNumber = input?.SelectEmployeePhoneNumber?.mobileNumber;
    requestdata["user"]["name"] = input?.SelectEmployeeName?.employeeName;
    requestdata.user.correspondenceAddress = input?.SelectEmployeeCorrespondenceAddress?.correspondenceAddress;
    requestdata.user.roles = roles;
    const Employees = [requestdata];
    history.replace("/digit-ui/employee/hrms/response", { Employees, key: "UPDATE", action: "UPDATE" });
  };
  const configs = newConfig;
  return (
    <div>
      <FormComposer
        heading={t("HR_COMMON_EDIT_EMPLOYEE_HEADER")}
        isDisabled={!canSubmit}
        label={t("HR_COMMON_BUTTON_SUBMIT")}
        config={configs.map((config) => {
          return {
            ...config,
            body: config.body.filter((a) => !a.hideInEmployee),
          };
        })}
        fieldStyle={{ marginRight: 0 }}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        onFormValueChange={onFormValueChange}
      /> {showToast && (
        <Toast
          error={showToast.key}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
    </div>
  );
};
export default EditForm;
