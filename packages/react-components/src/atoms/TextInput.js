import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const TextInput = (props) => {
  const user_type = Digit.SessionStorage.get("userType");
  const [date, setDate] = useState();

  const handleDate = (event) => {
    const { value } = event.target;
    setDate(getDDMMYYYY(value));
  };

  return (
    <React.Fragment>
      <div style={{ position: "relative", width: "100%" }}>
        {props.isMandatory ? (
          <input
            type={props.type || "text"}
            name={props.name}
            id={props.id}
            className={`${user_type ? "employee-card-input-error" : "card-input-error"} ${props.disable && "disabled"}`}
            placeholder={props.placeholder}
            onChange={(event) => {
              if (props?.onChange) {
                props?.onChange(event);
              }
              if (props.type === "date") {
                handleDate(event);
              }
            }}
            ref={props.inputRef}
            value={props.value}
            style={{ ...props.style }}
            defaultValue={props.defaultValue}
            minLength={props.minlength}
            maxLength={props.maxlength}
            max={props.max}
            pattern={props.pattern}
            min={props.min}
            readOnly={props.disable}
          />
        ) : (
          <input
            type={props.type || "text"}
            name={props.name}
            id={props.id}
            className={`${user_type ? "employee-card-input" : "citizen-card-input"} ${props.disable && "disabled"} focus-visible`}
            placeholder={props.placeholder}
            onChange={(event) => {
              if (props?.onChange) {
                props?.onChange(event);
              }
              if (props.type === "date") {
                handleDate(event);
              }
            }}
            ref={props.inputRef}
            value={props.value}
            style={{ ...props.style }}
            defaultValue={props.defaultValue}
            minLength={props.minlength}
            maxLength={props.maxlength}
            max={props.max}
            required={props.isRequired}
            pattern={props.pattern}
            min={props.min}
            readOnly={props.disable}
          />
        )}
        {props.type === "date" && <DatePicker {...props} date={date} setDate={setDate} />}
      </div>
    </React.Fragment>
  );
};

TextInput.propTypes = {
  userType: PropTypes.string,
  isMandatory: PropTypes.bool,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  ref: PropTypes.func,
  value: PropTypes.any,
};

TextInput.defaultProps = {
  isMandatory: false,
};

function DatePicker(props) {
  const data = {
    fromDate: props?.watch("fromDate"),
    toDate: props?.watch("toDate"),
  };

  useEffect(() => {
    if (props?.shouldUpdate) {
      props?.setDate(getDDMMYYYY(data[props.name], "yyyymmdd"));
    }
  }, [data]);

  useEffect(() => {
    props.setDate(getDDMMYYYY(props?.defaultValue));
  }, []);

  return (
    <input
      type="text"
      className={`${props.disable && "disabled"} card-date-input`}
      name={props.name}
      id={props.id}
      placeholder={props.placeholder}
      defaultValue={props.date}
    />
  );
}

function getDDMMYYYY(date) {
  if (!date) return "";

  return new Date(date).toLocaleString("en-In").split(",")[0];
}

export default TextInput;
