import React from "react";
import LinkTo from '@storybook/addon-links/react';
import DIGIT from "./assets/DIGIT.svg";

const Navbar = () => {
  return (
    <div className="header">
      <img src={DIGIT} className="pointer" />
      <LinkTo story="" className="navItem pointer">Brand</LinkTo>
      <LinkTo story="" className="navItem pointer">Foundations</LinkTo>
      <LinkTo story="INTRODUCTIONS" kind="Components" target="_blank" title="Components" className="navItem pointer">Components</LinkTo>
      <LinkTo story="" className="navItem pointer">Content</LinkTo>
      <LinkTo story="" className="navItem pointer">Patterns</LinkTo>
    </div>
  )
}

export default Navbar;