import React, { useState, useEffect } from "react";
import { TextInput, SearchIconSvg } from "@egovernments/digit-ui-react-components";

export const useChequeDetails = (props) => {
  const config = [
    {
      head: "Cheque Details",
      headId: "paymentInfo",
      body: [
        {
          withoutLabel: true,
          type: "custom",
          populators: {
            name: "chequeDetails",
            customProps: {},
            defaultValue: { instrumentNumber: "", instrumentDate: "", ifscCode: "", bankName: "", bankBranch: "" },
            component: (props, customProps) => <ChequeDetailsComponent onChange={props.onChange} chequeDetails={props.value} {...customProps} />,
          },
        },
      ],
    },
  ];

  return { chequeConfig: config };
};

// to be used in config

export const ChequeDetailsComponent = (props) => {
  const [instrumentDate, setChequeDate] = useState(props.chequeDetails.instrumentDate);
  const [instrumentNumber, setChequeNo] = useState(props.chequeDetails.instrumentNumber);
  const [ifscCode, setIfsc] = useState(props.chequeDetails.ifscCode);
  const [bankName, setBankName] = useState(props.chequeDetails.bankName);
  const [bankBranch, setBankBranch] = useState(props.chequeDetails.bankBranch);

  useEffect(() => {
    if (props.onChange) props.onChange({ instrumentDate, instrumentNumber, ifscCode, bankName, bankBranch });
  }, [bankName, bankBranch, instrumentDate, instrumentNumber]);

  const setBankDetailsFromIFSC = async () => {
    try {
      const res = await window.fetch(`https://ifsc.razorpay.com/${ifscCode}`);
      console.log(res.ok);
      if (res.ok) {
        const { BANK, BRANCH } = await res.json();
        setBankName(BANK);
        setBankBranch(BRANCH);
      } else alert("Please enter correct IFSC Code!");
    } catch (er) {
      console.log(er);
      alert("Please enter correct IFSC Code!");
    }
  };

  return (
    <React.Fragment>
      <div className="label-field-pair">
        <h2 className="card-label">Cheque Number</h2>
        <div className="field">
          <div className="field-container">
            <input
              className="employee-card-input"
              value={instrumentNumber}
              type="text"
              name="instrumentNumber"
              onChange={(e) => setChequeNo(e.target.value)}
              minlength="6"
              maxLength="6"
            />
          </div>
        </div>
      </div>
      <div className="label-field-pair">
        <h2 className="card-label">Cheque Date</h2>
        <div className="field">
          <div className="field-container">
            <input
              className="employee-card-input"
              value={instrumentDate}
              type="date"
              name="instrumentDate"
              onChange={(e) => setChequeDate(e.target.value)}
            />
          </div>
        </div>
      </div>
      {
        // chequeDate && chequeNo &&
        <React.Fragment>
          <div className="label-field-pair">
            <h2 className="card-label">IFSC Code</h2>
            <div className="field">
              <div className="field-container">
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
                    value={ifscCode}
                    type="text"
                    onChange={(e) => setIfsc(e.target.value)}
                    minlength="11"
                    maxlength="11"
                  />
                  <button
                    type="button"
                    style={{ border: "0px", background: "transparent", outline: "none", textIndent: "2px" }}
                    onClick={setBankDetailsFromIFSC}
                  >
                    <SearchIconSvg />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="label-field-pair">
            <h2 className="card-label">Bank Name</h2>
            <div className="field">
              <div className="field-container">
                <input
                  // style={{ border: "2px solid #0b0c0c", borderRadius: "2px" }}
                  className="employee-card-input"
                  value={bankName}
                  type="text"
                  className="employee-card-input"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="label-field-pair">
            <h2 className="card-label">Bank Branch</h2>
            <div className="field">
              <div className="field-container">
                <input className="employee-card-input" value={bankBranch} type="text" className="employee-card-input" readOnly />
              </div>
            </div>
          </div>
        </React.Fragment>
      }
    </React.Fragment>
  );
};
