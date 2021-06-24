import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormComposer, Toast } from "@egovernments/digit-ui-react-components";
import { newConfig } from "../components/config/config";
import { useHistory } from "react-router-dom";

const CreateEmployee = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [canSubmit, setSubmitValve] = useState(false);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [phonecheck, setPhonecheck] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});
  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    if (/^[6-9]\d{9}$/.test(mobileNumber)) {
      Digit.HRMSService.search(tenantId, null, { phone: mobileNumber }).then((result, err) => {
        if (result.Employees.length > 0) {
          setShowToast({ key: true, label: "ERR_HRMS_USER_EXIST_MOB" });
          setPhonecheck(false);
        } else {
          setPhonecheck(true);
        }
      });
    } else {
      setPhonecheck(false);
    }
  }, [mobileNumber]);

  const onFormValueChange = (setValue = true, formData) => {
    if (/^[6-9]\d{9}$/.test(formData?.SelectEmployeePhoneNumber?.mobileNumber)) {
      setMobileNumber(formData?.SelectEmployeePhoneNumber?.mobileNumber);
    } else {
      setPhonecheck(false);
    }
    let setcheck = false;
    for (let i = 0; i < formData?.Jurisdictions?.length; i++) {
      let key = formData?.Jurisdictions[i];
      if (!(key?.boundary && key?.boundaryType && key?.hierarchy && key?.tenantId && key?.roles?.length > 0)) {
        setcheck = false;
        break;
      } else {
        setcheck = true;
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
      formData?.SelectEmployeeType?.code &&
      formData?.SelectEmployeePhoneNumber?.mobileNumber &&
      setcheck &&
      setassigncheck &&
      phonecheck
    ) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
  };

  const onSubmit = (data) => {
    let roles = data.Jurisdictions.map((ele) => {
      ele.roles["tenantId"] = ele.boundary;
      return ele.roles;
    });

    roles = [].concat.apply([], roles);
    let Employees = [
      {
        tenantId: tenantId,
        employeeStatus: "EMPLOYED",
        assignments: data?.Assignments,
        code: data?.SelectEmployeeId?.code ? data?.SelectEmployeeId?.code : undefined,
        dateOfAppointment: new Date(data?.SelectDateofEmployment?.dateOfAppointment).getTime(),
        employeeType: data?.SelectEmployeeType?.code,
        jurisdictions: data?.Jurisdictions,
        user: {
          mobileNumber: data?.SelectEmployeePhoneNumber?.mobileNumber,
          name: data?.SelectEmployeeName?.employeeName,
          correspondenceAddress: data?.SelectEmployeeCorrespondenceAddress?.correspondenceAddress,
          emailId: data?.SelectEmployeeEmailId?.emailId ? data?.SelectEmployeeEmailId?.emailId : undefined,
          gender: data?.SelectEmployeeGender?.gender.code,
          dob: new Date(data?.SelectDateofBirthEmployment?.dob).getTime(),
          roles: roles,
          tenantId: tenantId,
        },
        serviceHistory: [],
        education: [],
        tests: [],
      },
    ];
    history.push("/digit-ui/employee/hrms/response", { Employees, key: "CREATE", action: "CREATE" });
  };

  const config = newConfig;
  return (
    <div>
      <FormComposer
        defaultValues={defaultValues}
        heading={t("HR_COMMON_CREATE_EMPLOYEE_HEADER")}
        config={config}
        onSubmit={onSubmit}
        onFormValueChange={onFormValueChange}
        isDisabled={!canSubmit}
        label={t("HR_COMMON_BUTTON_SUBMIT")}
      />
      {showToast && (
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
export default CreateEmployee;
