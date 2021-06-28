import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, Modal, ButtonSelector, Calender } from "@egovernments/digit-ui-react-components";
import { DateRangePicker, defaultStaticRanges, createStaticRanges } from "react-date-range";
import { format, addMonths, addHours, startOfToday, endOfToday, endOfYesterday, addMinutes, addSeconds, isEqual, subYears, startOfYesterday, startOfWeek, endOfWeek, startOfYear, endOfYear, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from "date-fns";

function isEndDateFocused(focusNumber) {
  return focusNumber === 1;
}

const DateRange = ({ values, onFilterChange, t }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [focusedRange, setFocusedRange] = useState([0, 0]);
  const [selectionRange, setSelectionRange] = useState(values);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    if (!isModalOpen) {
      const startDate = selectionRange?.startDate;
      const endDate =  isEqual(selectionRange?.startDate, selectionRange?.endDate) ? addSeconds(addMinutes(addHours(selectionRange?.endDate, 23), 59), 59) : selectionRange?.endDate;
      const duration = getDuration(selectionRange?.startDate, selectionRange?.endDate);
      const title = `${format(selectionRange?.startDate, "MMM d, yyyy")} - ${format(selectionRange?.endDate, "MMM d, yyyy")}`;
      onFilterChange({ range: { startDate, endDate, duration, title }, requestDate: { startDate, endDate, duration, title } });
    }
  }, [selectionRange, isModalOpen]);

  const staticRanges = useMemo(() => {
    return createStaticRanges([
      {
        label: t("DSS_TODAY"),
        range: () => ({
          startDate: startOfToday(new Date()),
          endDate: endOfToday(new Date()),
        })
      },
      {
        label: t("DSS_YESTERDAY"),
        range: () => ({
          startDate: startOfYesterday(new Date()),
          endDate: endOfYesterday(new Date()),
        })
      },
      {
        label: t("DSS_THIS_WEEK"),
        range: () => ({
          startDate: startOfWeek(new Date()),
          endDate: endOfWeek(new Date()),
        })
      },
      {
        label: t('DSS_THIS_MONTH'),
        range: () => ({
          startDate: startOfMonth(new Date()),
          endDate: endOfMonth(new Date()),
        })
      },
      {
        label: t('DSS_THIS_QUARTER'),
        range: () => ({
          startDate: startOfQuarter(new Date()),
          endDate: endOfQuarter(new Date()),
        })
      },
      {
        label: t('DSS_PREVIOUS_YEAR'),
        range: () => ({
          startDate: subYears(addMonths(startOfYear(new Date()), 3), 1),
          endDate: subYears(addMonths(endOfYear(new Date()), 3), 1)
        })
      },
      {
        label: t('DSS_THIS_YEAR'),
        range: () => ({
          startDate: addMonths(startOfYear(new Date()), 3),
          endDate: addMonths(endOfYear(new Date()), 3)
        })
      }
    ])
  }, [])

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

  const handleSelect = (ranges) => {
    const { range1: selection } = ranges;
    setSelectionRange(selection);
    if (isEndDateFocused(focusedRange[1])) {
      setIsModalOpen(false);
    }
  };

  const handleFocusChange = (focusedRange) => {
    const [rangeIndex, rangeStep] = focusedRange;
    setFocusedRange(focusedRange);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div>{t(`ES_DSS_DATE_RANGE`)}</div>
      <div className="employee-select-wrap" ref={wrapperRef}>
        <div className="select">
          <input className="employee-select-wrap--elipses" type="text" value={values?.title ? `${values?.title}` : ""} readOnly />
          <Calender onClick={() => setIsModalOpen((prevState) => !prevState)} />
        </div>
        {isModalOpen && (
          <div className="options-card" style={{ overflow: "visible", width: "unset", maxWidth: "unset" }}>
            <DateRangePicker
              className="pickerShadow"
              focusedRange={focusedRange}
              ranges={[selectionRange]}
              rangeColors={["#9E9E9E"]}
              onChange={handleSelect}
              onRangeFocusChange={handleFocusChange}
              showSelectionPreview={true}
              staticRanges={staticRanges}
              inputRanges={[]}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DateRange;
