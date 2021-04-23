import React, { Fragment } from "react";

const denominations = ["Cr", "Lac", "Unit"];

const Switch = () => {
  return (
    <div style={{ marginBottom: "24px" }}>
      <div>Denomination</div>
      <div className="switch-wrapper">
        {denominations.map((label, idx) => (
          <div>
            <input type="radio" id={label} className="radio-switch" name="unit" />
            <label for={label}>{label}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Switch;
