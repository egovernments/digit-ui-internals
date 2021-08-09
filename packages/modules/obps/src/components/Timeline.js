import React from "react";
import { useTranslation } from "react-i18next";

const actions = [
  'BPA_STEPPER_SCRUTINY_DETAILS_HEADER',
  'BPA_STEPPER_OWNER_DOCUMENT_HEADER',
  'BPA_STEPPER_NOC_HEADER',
  'BPA_STEPPER_SUMMARY_HEADER',
]

const Timeline = () => {
  const { t } = useTranslation();
  return (
    <div className="timeline-container">
      {actions.map((action, index, arr) => (
        <div className="timeline-checkpoint" key={index}>
          <div className="timeline-content">
            <span className="circle">{index + 1}</span>
            <span className="secondary-color">{t(action)}</span>
          </div>
          {index < arr.length - 1 && <span className="line"></span>}
        </div>
      ))}
    </div>
  )
}

export default Timeline;