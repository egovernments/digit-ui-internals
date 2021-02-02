import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { ArrowDown } from "./svgindex";

const TextField = (props) => {
  const [value, setValue] = useState(props.selectedVal ? props.selectedVal : "");

  useEffect(() => {
    props.selectedVal ? setValue(props.selectedVal) : setValue("");
  }, [props.selectedVal, props.forceSet]);

  function inputChange(e) {
    if (props.freeze) return;

    setValue(e.target.value);
    props.setFilter(e.target.value);
  }

  function broadcastToOpen() {
    props.dropdownDisplay(true);
  }

  function broadcastToClose() {
    props.dropdownDisplay(false);
  }

  return (
    <input
      className="employee-select-wrap--elipses"
      type="text"
      value={value}
      onChange={inputChange}
      onClick={props.onClick}
      onFocus={broadcastToOpen}
      onBlur={broadcastToClose}
    />
  );
};

const Dropdown = (props) => {
  const user_type = Digit.SessionStorage.get("userType");
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const [selectedOption, setSelectedOption] = useState(props.selected ? props.selected : null);
  const [filterVal, setFilterVal] = useState("");
  const [forceSet, setforceSet] = useState(0);
  const optionRef = useRef(null);
  const hasCustomSelector = props.customSelector ? true : false;
  useEffect(() => {
    setSelectedOption(props.selected);
  }, [props.selected]);

  function dropdownSwitch() {
    var current = dropdownStatus;
    if (!current) {
      document.addEventListener("mousedown", handleClick, false);
    }
    setDropdownStatus(!current);
  }

  function handleClick(e) {
    if (!optionRef.current || !optionRef.current.contains(e.target)) {
      document.removeEventListener("mousedown", handleClick, false);
      setDropdownStatus(false);
    }
  }

  function dropdownOn(val) {
    const waitForOptions = () => setTimeout(() => setDropdownStatus(val), 500);
    const timerId = waitForOptions();

    return () => {
      clearTimeout(timerId);
    };
  }

  function onSelect(val) {
    //console.log(val, "curent", selectedOption, "old");
    if (val !== selectedOption) {
      // console.log(val,"is selected");
      props.select(val);
      setSelectedOption(val);
      setDropdownStatus(false);
    } else {
      setSelectedOption(val);
      setforceSet(forceSet + 1);
    }
  }

  function setFilter(val) {
    setFilterVal(val);
  }

  return (
    <div className={user_type === "employee" ? "employee-select-wrap" : "select-wrap"} style={{ ...props.style }}>
      {/* <div className={userType === "employee" ? "select-wrap-emp" : "select-wrap"} style={{ ...props.style }}> */}
      {hasCustomSelector && (
        <div className={props.showArrow ? "cp margin-top-6 flex-right column-gap-5" : "cp margin-top-6"} onClick={dropdownSwitch}>
          {props.customSelector}
          {props.showArrow && <ArrowDown onClick={dropdownSwitch} />}
        </div>
      )}
      {!hasCustomSelector && (
        <div className={dropdownStatus ? "select-active" : "select"}>
          <TextField
            setFilter={setFilter}
            forceSet={forceSet}
            selectedVal={
              selectedOption
                ? props.t
                  ? props.t(props.optionKey ? selectedOption[props.optionKey] : selectedOption)
                  : props.optionKey
                  ? selectedOption[props.optionKey]
                  : selectedOption
                : null
            }
            filterVal={filterVal}
            // onClick={dropdownOn}
            dropdownDisplay={dropdownOn}
            freeze={props.freeze ? true : false}
          />
          <ArrowDown onClick={dropdownSwitch} className="cp" />
        </div>
      )}
      {/* {console.log("dropdownStatus::::::::::::::>", dropdownStatus)} */}
      {dropdownStatus ? (
        props.optionKey ? (
          <div className={`${hasCustomSelector ? "margin-top-10" : ""} options-card`} ref={optionRef}>
            {props.option &&
              props.option
                .filter((option) => option[props.optionKey].toUpperCase().includes(filterVal.toUpperCase()))
                .map((option, index) => {
                  if (props.t) {
                    // console.log(props.t(option[props.optionKey]));
                  }
                  return (
                    <div className="cp profile-dropdown--item" key={index} onClick={() => onSelect(option)}>
                      {option.icon && <span className="icon"> {option.icon} </span>}
                      {<span> {props.t ? props.t(option[props.optionKey]) : option[props.optionKey]}</span>}
                    </div>
                  );
                })}
          </div>
        ) : (
          <div className="options-card">
            {props.option
              .filter((option) => option.toUpperCase().includes(filterVal.toUpperCase()))
              .map((option, index) => {
                return (
                  <p key={index} onClick={() => onSelect(option)}>
                    {option}
                  </p>
                );
              })}
          </div>
        )
      ) : null}
    </div>
  );
};

Dropdown.propTypes = {
  customSelector: PropTypes.any,
  showArrow: PropTypes.bool,
  selected: PropTypes.any,
  style: PropTypes.object,
  option: PropTypes.array,
  optionKey: PropTypes.any,
  select: PropTypes.func,
  t: PropTypes.func,
};

Dropdown.defaultProps = {
  customSelector: null,
  showArrow: true,
};

export default Dropdown;
