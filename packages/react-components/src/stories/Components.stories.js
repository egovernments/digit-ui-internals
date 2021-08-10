import React from "react";
import ButtonSelector from "../atoms/ButtonSelector";
import CheckBox from "../atoms/CheckBox";
import TextInput from "../atoms/TextInput";
import Rating from "../atoms/Rating";
import ComponentsLogo from "./assets/components.svg";
import Card from "./Card";
import Navbar from "./Navbar";
import "./welcome.css";

const sampleText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."

const components = [
  {
    title: "TextInput",
    content: sampleText,
    component: <TextInput />
  },
  {
    title: "ButtonSelector",
    content: sampleText,
    component: <ButtonSelector label="SUBMIT" />
  },
  {
    title: "Checkbox",
    content: sampleText,
    component: <CheckBox />
  },
  {
    title: "Rating",
    content: sampleText,
    component: <Rating />
  },
]

export const Components = () => {
  return (
    <div className="greyBackground">
      <Navbar />
      <div className="pageContainer">
        <header className="s-heading">
          <div className="logo"><img src={ComponentsLogo} /></div>
          Components
        </header>
        <p>{sampleText}</p>
        <div className="component-showcase">
          {components.map((comp) => (
            <Card card={comp} />
          ))}
        </div>
      </div>
    </div>
  )
}

// export default {
//   title: 'INTRODUCTIONS'
// }