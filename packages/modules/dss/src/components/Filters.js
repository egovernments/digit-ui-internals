import React, { useState } from "react";
import { CardSectionHeader, Dropdown, SubmitBar, FilterIcon, RefreshIcon } from "@egovernments/digit-ui-react-components";
import Switch from "./Switch";
import DateRange from "./DateRange";

const ULBS = [
  {
    name: "All",
  },
  {
    name: "ULB A",
  },
  {
    name: "ULB B",
  },
  {
    name: "ULB C",
  },
];

const Filters = () => {
  const [filters, setFilters] = useState({});
  const selectULB = () => {};
  const handleFilterChange = (data) => {
    setFilters({ ...filters, ...{ range: data } });
  };
  return (
    <div className="filters-wrapper">
      <CardSectionHeader style={{ display: "flex" }}>
        <FilterIcon />
        <span style={{ marginLeft: "8px", marginRight: "70px", fontWeight: 400, fontSize: "24px" }}>Filters</span>
        <RefreshIcon />
      </CardSectionHeader>
      <DateRange onFilterChange={handleFilterChange} values={filters?.range} />
      <div>ULBs</div>
      <Dropdown option={ULBS} optionKey="name" select={selectULB} />
      <Switch />
      <SubmitBar label={"Apply"} style={{ width: "100%" }} />
    </div>
  );
};

export default Filters;
