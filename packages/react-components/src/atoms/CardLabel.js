import React from "react";

const CardLabel = (props) => {
  return (
    <h2 className="card-label" style={props.style}>
      {props.children}
    </h2>
  );
};

export default CardLabel;
