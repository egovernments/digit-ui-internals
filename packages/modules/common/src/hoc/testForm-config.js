import React from "react";
import { Dropdown, SearchIconSvg } from "@egovernments/digit-ui-react-components";

const middleWare_1 = async (data, _break, _next) => {
  data.a = "a";
  return await _next(data);
};

const middleWare_2 = async (data, _break, _next) => {
  data.b = "b";
  // _break();
  return await _next(data);
};

const middleWare_3 = async (data, _break, _next) => {
  data.c = "c";
  if (data.b === "b") {
    try {
      const res = await window.fetch(`https://ifsc.razorpay.com/hdfc0000090`);
      console.log(res.ok);
      if (res.ok) {
        const { BANK, BRANCH } = await res.json();
        data.BANKFROMMiddleWare = BANK;
      } else alert("Wrong IFSC Code");
    } catch (er) {
      console.log(er);
      alert("Something Went Wrong !");
    }
  }
  return await _next(data);
};

const asyncData = {
  a: ["1", "2", "3"],
  b: ["4", "5", "6"],
  c: ["7", "8", "9"],
  j: ["10", "11", "12"],
  k: ["22", "45"],
  l: ["456"],
};

export const testForm = {
  addedFields: [],
  middlewares: [{ middleWare_1 }, { middleWare_2 }, { middleWare_3 }],

  state: { firstDDoptions: ["a", "b", "c"], secondDDoptions: asyncData.a, thirdDDoptions: ["d", "e", "f"] },

  fields: [
    {
      label: "first",
      name: "pehla",
      defaultValue: "b",
      customProps: (state) => ({ isMendatory: true, option: state.firstDDoptions }),
      component: (props, customProps) => (
        <Dropdown
          select={(d) => {
            props.setState({ secondDDoptions: asyncData[d] });
            props.setValue("doosra", "");
            props.onChange(d);
          }}
          selected={props.value}
          {...customProps}
        />
      ),
      validations: {},
    },
    {
      label: "second",
      name: "doosra",
      customProps: (state) => ({ isMendatory: true, option: state.secondDDoptions }),
      defaultValue: (state) => state.secondDDoptions[1],
      component: (props, customProps) => (
        <Dropdown
          select={(d) => {
            props.onChange(d);
          }}
          selected={props.value}
          {...customProps}
        />
      ),
    },
    {
      label: "third",
      name: "teesra",
      customProps: (state) => ({ isMendatory: true, option: state.thirdDDoptions }),
      defaultValue: "d",
      component: (props, customProps) => (
        <Dropdown
          select={(d) => {
            props.onChange(d);
          }}
          selected={props.value}
          {...customProps}
        />
      ),
    },
    {
      label: "IFSC",
      name: "ifsc",
      customProps: {
        isMendatory: true,
        setBankDetailsFromIFSC: async (props) => {
          try {
            const res = await window.fetch(`https://ifsc.razorpay.com/${props.getValues("ifsc")}`);
            console.log(res.ok);
            if (res.ok) {
              const { BANK, BRANCH } = await res.json();
              props.setValue("bank", BANK);
              props.setValue("branch", BRANCH);
            } else alert("Wrong IFSC Code");
          } catch (er) {
            console.log(er);
            alert("Something Went Wrong !");
          }
        },
      },
      defaultValue: "",
      component: (props, customProps) => (
        <div style={{ border: "2px solid #0b0c0c", borderRadius: "2px", display: "flex", alignItems: "center", marginBottom: "24px" }}>
          <input
            style={{
              border: "0px",
              background: "transparent",
              outline: "none",
              width: "100%",
              textIndent: "5px",
              padding: "6px 0px",
            }}
            value={props.value}
            type="text"
            onChange={(e) => {
              props.setState({ ifsc: e.target.value });
              props.onChange(e.target.value);
            }}
          />
          <button
            type="button"
            style={{ border: "0px", background: "transparent", outline: "none", textIndent: "2px" }}
            onClick={() => {
              customProps.setBankDetailsFromIFSC(props);
            }}
          >
            <SearchIconSvg />
          </button>
        </div>
      ),
    },
    {
      label: "Bank",
      name: "bank",
      defaultValue: "d",
      component: (props, customProps) => <input readOnly value={props.value}></input>,
    },
    {
      label: "Branch",
      name: "branch",
      defaultValue: "d",
      component: (props, customProps) => <input readOnly value={props.value}></input>,
    },
  ],
};
