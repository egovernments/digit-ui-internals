import React from "react";
import PropTypes from "prop-types";

const TextArea = (props) => {
  const user_type = Digit.SessionStorage.get("userType");

  return (
    <textarea
      name={props.name}
      ref={props.inputRef}
      style={props.style}
      id={props.id}
      value={props.value}
      onChange={props.onChange}
      className={`${user_type ? "employee-card-textarea" : "card-textarea"} ${props.disable && "disabled"} ${
        props?.className ? props?.className : ""
      }`}
      minLength={props.minLength}
      maxLength={props.maxLength} 
      autoComplete="off"
    ></textarea>
  );
};

TextArea.propTypes = {
  userType: PropTypes.string,
  name: PropTypes.string.isRequired,
  ref: PropTypes.func,
  value: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
};

TextArea.defaultProps = {
  ref: undefined,
  onChange: undefined,
};

export default TextArea;
