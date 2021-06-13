export const newConfig = [
  {
    head:"Personal Details",
    body:[
      {
        type:"component",
        component:"SelectEmployeeName",
        key: "SelectEmployeeName",
        withoutLabel: true,
      },
      {
        type:"component",
        component:"SelectEmployeePhoneNumber",
        key: "SelectEmployeePhoneNumber",
        withoutLabel: true,
      },
      ,{
        type:"component",
        component:"Banner",
        key: "Banner0",
        withoutLabel: true,
        texts: {
          headerCaption: "Info",
          header: "HR_MOBILE_NO_CHECK",
        }
        },
      {
        type:"component",
        component:"SelectDateofBirthEmployment",
        key: "SelectDateofBirthEmployment",
        withoutLabel: true,
      },
      {
        type:"component",
        component:"SelectEmployeeGender",
        key: "SelectEmployeeGender",
        withoutLabel: true,
      },
      {
        type:"component",
        component:"SelectEmployeeEmailId",
        key: "SelectEmployeeEmailId",
        withoutLabel: true,
      },
      {
        type:"component",
        component:"SelectEmployeeCorrespondenceAddress",
        key: "SelectEmployeeCorrespondenceAddress",
        withoutLabel: true,
      }

    ]
  },
  {
    head:"HR_NEW_EMPLOYEE_FORM_HEADER",
    body:[
      {
        type:"component",
        component:"SelectEmployeeId",
        key: "SelectEmployeeId",
        withoutLabel: true,
      },

      {
        type:"component",
        component:"SelectDateofEmployment",
        key: "SelectDateofEmployment",
        withoutLabel: true,
      },
      {
        type:"component",
        component:"SelectEmployeeType",
        key: "SelectEmployeeType",
        withoutLabel: true,
      },{
      type:"component",
      component:"Banner",
      key: "Banner1",
      withoutLabel: true,
      texts: {
        headerCaption: "Info",
        header: "HR_EMP_ID_MESSAGE",
      }
      }
    ]
  },
    {
      head: "HR_JURISDICTION_DETAILS_HEADER",
      body: [
        {
            type: "component",
            isMandatory: true,
            component: "Jurisdictions",
            key: "Jurisdictions",
            withoutLabel: true,
          },

      ]
    },

    {
        head: "HR_ASSIGN_DET_HEADER",
        body: [
          {
            type:"component",
            component:"Banner",
            key: "Banner2",
            withoutLabel: true,
            texts: {
              headerCaption: "Info",
              header: "HR_ASSIGN_DET_SUB_HEADER",
            }
            },
          {
              type: "component",
              component: "Assignments",
              key: "Assignments",
              withoutLabel: true,
            }
        ]
      }
]