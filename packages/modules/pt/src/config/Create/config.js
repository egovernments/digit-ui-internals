export const newConfig = [
  {
    head: "ES_NEW_APPLICATION_LOCATION_DETAILS",
    body: [
      {
        route: "info",
        component: "PropertyTax",
        nextStep: "isResidential",
        hideInEmployee: true,
        key: "Documents",
      },
      {
        type: "component",
        route: "isResidential",
        isMandatory: true,
        component: "IsResidential",
        texts: {
          headerCaption: "",
          header: "PT_PROPERTY_DETAILS_RESIDENTIAL_PROPERTY_HEADER",
          cardText: "PT_PROPERTY_DETAILS_RESIDENTIAL_PROPERTY_TEXT",
          submitBarLabel: "PT_COMMON_NEXT",
        },
        key: "isResdential",
        withoutLabel: true,
        hideInEmployee: true,
        //nextStep: "property-usage-type",
        nextStep: {
          PT_COMMON_YES: "property-type",
          PT_COMMON_NO: "property-usage-type",
        },
      },
      {
        type: "component",
        route: "property-usage-type",
        isMandatory: true,
        component: "PropertyUsageType",
        texts: {
          headerCaption: "PT_ASSESMENT_INFO_USAGE_TYPE",
          header: "PT_PROPERTY_DETAILS_USAGE_TYPE_HEADER",
          cardText: "PT_PROPERTY_DETAILS_USAGE_TYPE_TEXT",
          submitBarLabel: "PT_COMMONS_NEXT",
        },
        nextStep: "property-type",
        key: "usageCategoryMajor",
        withoutLabel: true,
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "property-type",
        isMandatory: true,
        component: "PropertyType",
        texts: {
          headerCaption: "",
          header: "PT_ASSESMENT1_PROPERTY_TYPE",
          cardText: "",
          submitBarLabel: "PT_COMMONS_NEXT",
        },
        //nextStep: "number-of-floors",
        nextStep: {
          COMMON_PROPTYPE_BUILTUP_INDEPENDENTPROPERTY: "number-of-floors",
          COMMON_PROPTYPE_BUILTUP_SHAREDPROPERTY: "provide-floor-no",
          COMMON_PROPTYPE_VACANT: "area",
        },
        key: "PropertyType",
        withoutLabel: true,
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "provide-floor-no",
        isMandatory: true,
        component: "ProvideFloorNo",
        texts: {
          headerCaption: "",
          header: "Provide Floor Number",
          cardText: "",
          submitBarLabel: "PT_COMMONS_NEXT",
        },
        nextStep: "is-this-floor-self-occupied",
        key: "Floorno",
        withoutLabel: true,
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "number-of-floors",
        isMandatory: true,
        component: "PropertyFloorDetails",
        texts: {
          headerCaption: "",
          header: "BPA_SCRUTINY_DETAILS_NUMBER_OF_FLOORS_LABEL",
          cardText: "PT_PROPERTY_DETAILS_NO_OF_FLOORS_TEXT",
          submitBarLabel: "PT_COMMONS_NEXT",
        },
        nextStep: "number-of-basements@0",
        key: "noOfFloors",
        withoutLabel: true,
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "number-of-basements@0",
        isMandatory: true,
        component: "PropertyBasementDetails",
        texts: {
          headerCaption: "",
          header: "PT_PROPERTY_DETAILS_NO_OF_BASEMENTS_HEADER",
          cardText: "",
          submitBarLabel: "PT_COMMONS_NEXT",
        },
        nextStep: {
          "No Basement": "floordetails",
          "1 Basement": "floordetails",
          "2 Basement": "floordetails",
        },
        key: "noOofBasements",
        withoutLabel: true,
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "floordetails",
        isMandatory: true,
        component: "GroundFloorDetails",
        texts: {
          headerCaption: "",
          header: "PT_GROUND_FLOOR_DETAILS_LABEL",
          cardText: "PT_PROPERTY_DETAILS_FLOOR_DETAILS_TEXT",
          submitBarLabel: "Next",
        },
        nextStep: "is-this-floor-self-occupied",
        key: "units",
        withoutLabel: true,
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "is-this-floor-self-occupied",
        isMandatory: true,
        component: "IsThisFloorSelfOccupied",
        texts: {
          headerCaption: "",
          header: "PT_ASSESSMENT_FLOW_FLOOR_OCC_HEADER",
          cardText: "PT_ASSESSMENT_FLOW_FLOOR_OCC_TEXT",
          submitBarLabel: "PT_COMMON_NEXT",
        },
        key: "IsThisFloorSelfOccupied",
        withoutLabel: true,
        //nextStep: "provide-sub-usage-type",
        nextStep: {
          "Yes, It is fully Self Occupied": "provide-sub-usage-type",
          "Yes, It is fully Self Occupied1": "is-any-part-of-this-floor-unoccupied",
          "Partially rented out": "provide-sub-usage-type-of-rented-area",
          "Partially rented out1": "rental-details",
          "Fully rented out": "provide-sub-usage-type-of-rented-area",
          "Fully rented out1": "rental-details",
        },
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "provide-sub-usage-type",
        isMandatory: true,
        component: "ProvideSubUsageType",
        texts: {
          headerCaption: "PT_ASSESMENT_INFO_USAGE_TYPE",
          header: "PT_ASSESSMENT_FLOW_SUBUSAGE_HEADER",
          cardText: "PT_ASSESSMENT_FLOW_SUBUSAGE_TEXT",
          submitBarLabel: "PT_COMMON_NEXT",
        },
        key: "units",
        withoutLabel: true,
        nextStep: "is-any-part-of-this-floor-unoccupied",
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "rental-details",
        isMandatory: true,
        component: "RentalDetails",
        texts: {
          headerCaption: "PT_GROUND_FLOOR_DETAILS_LABEL",
          header: "PT_ASSESSMENT_FLOW_RENTAL_DETAIL_HEADER",
          cardText: "",
          submitBarLabel: "PT_COMMON_NEXT",
        },
        key: "units",
        withoutLabel: true,
        nextStep: "is-any-part-of-this-floor-unoccupied",
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "provide-sub-usage-type-of-rented-area",
        isMandatory: true,
        component: "ProvideSubUsageTypeOfRentedArea",
        texts: {
          headerCaption: "PT_ASSESMENT_INFO_USAGE_TYPE",
          header: "PT_ASSESSMENT_FLOW_RENT_SUB_USAGE_HEADER",
          cardText: "PT_ASSESSMENT_FLOW_SUBUSAGE_TEXT",
          submitBarLabel: "PT_COMMON_NEXT",
        },
        key: "units",
        withoutLabel: true,
        nextStep: "rental-details",
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "is-any-part-of-this-floor-unoccupied",
        isMandatory: true,
        component: "IsAnyPartOfThisFloorUnOccupied",
        texts: {
          headerCaption: "PT_GROUND_FLOOR_DETAILS_LABEL",
          header: "PT_ASSESSMENT_FLOW_ISUNOCCUPIED_HEADER",
          cardText: "PT_ASSESSMENT_FLOW_ISUNOCCUPIED_TEXT",
          submitBarLabel: "PT_COMMON_NEXT",
        },
        key: "IsAnyPartOfThisFloorUnOccupied",
        withoutLabel: true,
        //nextStep: "un-occupied-area",
        nextStep: {
          No: "area",
          Yes: "un-occupied-area",
        },
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "un-occupied-area",
        isMandatory: true,
        component: "UnOccupiedArea",
        texts: {
          headerCaption: "PT_GROUND_FLOOR_DETAILS_LABEL",
          header: "PT_ASSESSMENT_FLOW_UNOCCUPIED_AREA_HEADER",
          cardText: "PT_ASSESSMENT_FLOW_UNOCCUPIED_AREA_TEXT",
          submitBarLabel: "PT_COMMON_NEXT",
          skipText: "",
        },
        key: "units",
        withoutLabel: true,
        nextStep: "area",
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "area",
        isMandatory: true,
        component: "Area",
        texts: {
          headerCaption: "",
          header: "PT_ASSESSMENT_FLOW_AREA_HEADER",
          cardText: "",
          submitBarLabel: "PT_COMMON_NEXT",
        },
        key: "units",
        withoutLabel: true,
        nextStep: "map",
        hideInEmployee: true,
      },
    ],
  },
  {
    head: "ES_NEW_APPLICATION_LOCATION_DETAILS",
    body: [
      // {
      //   route: "info",
      //   component: "PropertyTax",
      //   nextStep: "map",
      //   hideInEmployee: true,
      //   key: "Documents",
      // },
      {
        route: "map",
        component: "PTSelectGeolocation",
        nextStep: "pincode",
        hideInEmployee: true,
        key: "address",
        texts: {
          header: "PT_GEOLOCATON_HEADER",
          cardText: "PT_GEOLOCATION_TEXT",
          nextText: "PT_COMMON_NEXT",
          skipAndContinueText: "CORE_COMMON_SKIP_CONTINUE",
        },
      },
      {
        route: "pincode",
        component: "PTSelectPincode",
        texts: {
          headerCaption: "PT_PROPERTY_LOCATION_CAPTION",
          header: "PT_PINCODE_LABEL",
          cardText: "PT_PINCODE_TEXT",
          submitBarLabel: "PT_COMMON_NEXT",
          skipText: "CORE_COMMON_SKIP_CONTINUE",
        },
        withoutLabel: true,
        key: "address",
        isMandatory: true,
        nextStep: "address",
        type: "component",
      },
      {
        route: "address",
        component: "PTSelectAddress",
        withoutLabel: true,
        texts: {
          headerCaption: "PT_PROPERTY_LOCATION_CAPTION",
          header: "CS_FILE_APPLICATION_PROPERTY_LOCATION_ADDRESS_TEXT",
          cardText: "CS_FILE_APPLICATION_PROPERTY_LOCATION_CITY_MOHALLA_TEXT",
          submitBarLabel: "PT_COMMON_NEXT",
        },
        key: "address",
        nextStep: "street",
        isMandatory: true,
        type: "component",
      },
      {
        type: "component",
        route: "street",
        component: "SelectStreet",
        key: "address",
        withoutLabel: true,
        texts: {
          headerCaption: "PT_PROPERTY_LOCATION_CAPTION",
          header: "CS_FILE_APPLICATION_PROPERTY_LOCATION_ADDRESS_TEXT",
          cardText: "PT_STREET_TEXT",
          submitBarLabel: "PT_COMMON_NEXT",
        },
        nextStep: "landmark",
      },
      {
        type: "component",
        route: "landmark",
        component: "SelectLandmark",
        withoutLabel: true,
        texts: {
          headerCaption: "PT_PROPERTY_LOCATION_CAPTION",
          header: "CS_FILE_APPLICATION_PROPERTY_LOCATION_PROVIDE_LANDMARK_TITLE",
          cardText: "CS_FILE_APPLICATION_PROPERTY_LOCATION_PROVIDE_LANDMARK_TEXT",
          submitBarLabel: "PT_COMMON_NEXT",
          skipText: "CORE_COMMON_SKIP_CONTINUE",
        },
        key: "address",
        nextStep: "proof",
      },
      {
        type: "component",
        route: "proof",
        component: "Proof",
        withoutLabel: true,
        texts: {
          headerCaption: "PT_PROPERTY_LOCATION_CAPTION",
          header: "Proof of Address",
          cardText: "",
          nextText: "PT_COMMONS_NEXT",
          submitBarLabel: "PT_COMMONS_NEXT",
        },
        key: "address",
        nextStep: "owner-ship-details@0",
      },
    ],
  },
  {
    head: "ES_NEW_APPLICATION_PROPERTY_DETAILS",
    body: [
      {
        type: "component",
        route: "owner-ship-details@0",
        isMandatory: true,
        component: "SelectOwnerShipDetails",
        texts: {
          headerCaption: "PT_PROPERTIES_OWNERSHIP",
          header: "PT_PROVIDE_OWNERSHIP_DETAILS",
          cardText: "PT_PROVIDE_OWNERSHI_DETAILS_SUB_TEXT",
          submitBarLabel: "PT_COMMON_NEXT",
        },
        key: "ownershipCategory",
        withoutLabel: true,
        nextStep: {
          INSTITUTIONALPRIVATE: "inistitution-details",
          INSTITUTIONALGOVERNMENT: "inistitution-details",
          "INDIVIDUAL.SINGLEOWNER": "owner-details",
          "INDIVIDUAL.MULTIPLEOWNERS": "owner-details",
        },
        hideInEmployee: true,
      },
      {
        label: "ES_NEW_APPLICATION_PROPERTY_TYPE",
        isMandatory: true,
        type: "component",
        route: "owner-details",
        key: "owners",
        component: "SelectOwnerDetails",
        texts: {
          headerCaption: "",
          header: "PT_OWNERSHIP_INFO_SUB_HEADER",
          cardText: "PT_FORM3_HEADER_MESSAGE",
          submitBarLabel: "PT_COMMON_NEXT",
        },
        nextStep: "special-owner-category",
      },
      {
        type: "component",
        route: "special-owner-category",
        isMandatory: true,
        component: "SelectSpecialOwnerCategoryType",
        texts: {
          headerCaption: "PT_OWNERS_DETAILS",
          header: "PT_SPECIAL_OWNER_CATEGORY",
          cardText: "PT_FORM3_HEADER_MESSAGE",
          submitBarLabel: "PT_COMMON_NEXT",
        },
        key: "owners",
        withoutLabel: true,
        nextStep: "owner-address",
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "owner-address",
        isMandatory: true,
        component: "SelectOwnerAddress",
        texts: {
          headerCaption: "PT_OWNERS_DETAILS",
          header: "PT_OWNERS_ADDRESS",
          cardText: "",
          submitBarLabel: "PT_COMMON_NEXT",
        },
        key: "owners",
        withoutLabel: true,
        nextStep: "special-owner-category-proof",
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "special-owner-category-proof",
        isMandatory: true,
        component: "SelectSpecialProofIdentity",
        texts: {
          headerCaption: "PT_OWNERS_DETAILS",
          header: "PT_SPECIAL_OWNER_CATEGORY_PROOF_HEADER",
          cardText: "",
          submitBarLabel: "PT_COMMON_NEXT",
        },
        key: "owners",
        withoutLabel: true,
        nextStep: "proof-of-identity",
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "proof-of-identity",
        isMandatory: true,
        component: "SelectProofIdentity",
        texts: {
          headerCaption: "PT_OWNERS_DETAILS",
          header: "PT_PROOF_IDENTITY_HEADER",
          cardText: "",
          submitBarLabel: "PT_COMMON_NEXT",
          addMultipleText: "PT_COMMON_ADD_APPLICANT_LABEL",
        },
        key: "owners",
        withoutLabel: true,
        nextStep: null,
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "inistitution-details",
        isMandatory: true,
        component: "SelectInistitutionOwnerDetails",
        texts: {
          headerCaption: "",
          header: "PT_INSTITUTION_DETAILS_HEADER",
          cardText: "PT_FORM3_HEADER_MESSAGE",
          submitBarLabel: "PT_COMMON_NEXT",
        },
        key: "owners",
        withoutLabel: true,
        nextStep: "institutional-owner-address",
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "institutional-owner-address",
        isMandatory: true,
        component: "SelectOwnerAddress",
        texts: {
          headerCaption: "PT_OWNERS_DETAILS",
          header: "PT_OWNERS_ADDRESS",
          cardText: "",
          submitBarLabel: "PT_COMMON_NEXT",
        },
        key: "owners",
        withoutLabel: true,
        nextStep: "institutional-proof-of-identity",
        hideInEmployee: true,
      },
      {
        type: "component",
        route: "institutional-proof-of-identity",
        isMandatory: true,
        component: "SelectProofIdentity",
        texts: {
          headerCaption: "PT_OWNERS_DETAILS",
          header: "PT_PROOF_IDENTITY_HEADER",
          cardText: "",
          submitBarLabel: "PT_COMMON_NEXT",
        },
        key: "owners",
        withoutLabel: true,
        //nextStep: "",
        nextStep: null,
        hideInEmployee: true,
      },
    ],
  },
];
