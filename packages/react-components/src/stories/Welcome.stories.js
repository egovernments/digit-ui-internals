import { Meta, Story, Canvas } from '@storybook/addon-docs';
import LinkTo from '@storybook/addon-links/react';
import Card from "./Card";
import wireframe from "./assets/wireframe.svg";
import DIGIT from "./assets/DIGIT.svg";
import BrandLogo from "./assets/BrandLogo.svg";
import Foundations from "./assets/Foundations.svg";
import Components from "./assets/components.svg";
import Content from "./assets/content.svg";
import Resources from "./assets/Resources.svg";
import Patterns from "./assets/Patterns.svg";
import RightArrow from "./assets/RightArrow.svg";
import "./welcome.css";

const sampleText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
const cards = [
  {
    title: "Brand",
    content: sampleText,
    logo: BrandLogo
  },
  {
    title: "Foundations",
    content: sampleText,
    logo: Foundations
  },
  {
    title: "Components",
    content: sampleText,
    logo: Components
  },
  {
    title: "Content",
    content: sampleText,
    logo: Content
  },
  {
    title: "Patterns",
    content: sampleText,
    logo: Patterns
  },
  {
    title: "Resources",
    content: sampleText,
    logo: Resources
  }
]

// const cards = ['Brand', "Foundations", "Components", "Content", "Patterns", "Resources"]


export const Welcome = () => {
  return (
    <div className="intro-root">
      <div className="header">
        <img src={DIGIT} className="pointer" />
        <LinkTo story="" className="navItem pointer">Brand</LinkTo>
        <LinkTo story="" className="navItem pointer">Foundations</LinkTo>
        <LinkTo story="Components" className="navItem pointer">Components</LinkTo>
        <LinkTo story="" className="navItem pointer">Content</LinkTo>
        <LinkTo story="" className="navItem pointer">Patterns</LinkTo>
      </div>
      <div>
        <div className="banner blueBackground">
          <div className="bannerContent">
            <p className="bannerTitle">Enable Catalyse Transform.</p>
            <div className="horizontalBar"></div>
            <p className="bannerText">{sampleText}</p>
          </div>
          <img src={wireframe} />
        </div>
        <div className="section">
          {cards.map((card, index) => (
            <Card key={index} card={card} showLink={true} />
          ))}
        </div>
      </div>
      <div className="footer blueBackground">
        <p className="text-white">@Digitdesignsystem</p>
        <p className="text-white">Trademark License</p>
        <p className="text-white">Privacy</p>
      </div>
    </div>
  )
}

// export default {
//   title: "INTRODUCTIONS"
// };