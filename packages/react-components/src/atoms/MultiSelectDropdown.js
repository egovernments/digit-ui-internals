import React, { useRef, useState } from "react";
import { ArrowDown, CheckSvg } from "./svgindex";

const MultiSelectDropdown = ({ options, optionsKey, selected = [], onSelect, defaultLabel = "", defaultUnit = "" }) => {
  const [active, setActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const dropdownRef = useRef();
  Digit.Hooks.useClickOutside(dropdownRef, () => setActive(false));

  function onSearch(e) {
    setSearchQuery(e.target.value);
  }

  const MenuItem = ({ option, index }) => (
    <div key={index}>
      <input
        type="checkbox"
        value={option[optionsKey]}
        checked={selected.find((selectedOption) => selectedOption[optionsKey] === option[optionsKey]) ? true : false}
        onChange={(e) => onSelect(e, option)}
      />
      <div className="custom-checkbox">
        <CheckSvg />
      </div>
      <p className="label">{option[optionsKey]}</p>
    </div>
  );

  const Menu = () => {
    const filteredOptions =
      searchQuery?.length > 0 ? options.filter((option) => option[optionsKey].toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0) : options;
    return filteredOptions.map((option, index) => <MenuItem option={option} key={index} index={index} />);
  };

  return (
    <div className="multi-select-dropdown-wrap" ref={dropdownRef}>
      <div className={`master${active ? `-active` : ``}`}>
        <input type="text" onFocus={() => setActive(true)} value={searchQuery} onChange={onSearch} />
        <div className="label">
          <p>{selected.length > 0 ? `${selected.length} ${defaultUnit}` : defaultLabel}</p>
          <ArrowDown />
        </div>
      </div>
      {active ? (
        <div className="server">
          <Menu />
        </div>
      ) : null}
    </div>
  );
};

export default MultiSelectDropdown;