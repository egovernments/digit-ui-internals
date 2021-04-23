import React, { Fragment, useState } from "react";
import { ArrowDown, Modal } from "@egovernments/digit-ui-react-components";
import { DateRangePicker } from "react-date-range";
import { format } from "date-fns";

const DateRange = ({ values, onFilterChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const getDuration = (startDate, endDate) => {
    let noOfDays = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
    if (noOfDays > 91) {
      return "month";
    }
    if (noOfDays < 90 && noOfDays >= 14) {
      return "week";
    }
    if (noOfDays <= 14) {
      return "day";
    }
  };

  const handleSelect = ({ selection }) => {
    console.log(selection, "ranges");
    setSelectionRange(selection);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    const startDate = selectionRange?.startDate.getTime();
    const endDate = selectionRange?.endDate.getTime();
    const duration = getDuration(selectionRange?.startDate, selectionRange?.endDate);
    const title = `${format(selectionRange?.startDate, "MMM d, yy")} - ${format(selectionRange?.endDate, "MMM d, yy")}`;
    onFilterChange({ startDate, endDate, duration, title });
    setIsModalOpen(false);
  };
  return (
    <>
      <div>Date Range</div>
      <div className="employee-select-wrap">
        <div className="select">
          <input className="employee-select-wrap--elipses" type="text" value={values?.title ? `FY ${values?.title}` : ""} />
          <ArrowDown onClick={() => setIsModalOpen((prevState) => !prevState)} />
        </div>
      </div>
      {isModalOpen && (
        <Modal
          actionCancelLabel={"Cancel"}
          actionCancelOnSubmit={handleClose}
          actionSaveLabel={"Select"}
          closeModal={handleClose}
          actionSaveOnSubmit={handleSubmit}
          popupStyles={{ width: "569px" }}
        >
          <DateRangePicker ranges={[selectionRange]} onChange={handleSelect} showSelectionPreview={true} />
        </Modal>
      )}
    </>
  );
};

export default DateRange;
