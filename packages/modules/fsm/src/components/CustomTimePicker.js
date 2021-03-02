import React, { Fragment } from 'react';
import TimePicker from "react-time-picker";
import { TextInput } from "@egovernments/digit-ui-react-components";

const CustomTimePicker = ({ name, value, onChange }) => {
  const timeFormat = (new Date()).toLocaleTimeString();
  if (timeFormat.includes('AM') || timeFormat.includes('PM')) {
    return (
      <TextInput name={name} type="time" value={value} onChange={onChange} style={{ width: "25%" }} />
    )
  }

  return (
    <TimePicker name={name} onChange={onChange} value={value} locale="en-US" disableClock={false} clearIcon={null} />
  )
}

export default CustomTimePicker;