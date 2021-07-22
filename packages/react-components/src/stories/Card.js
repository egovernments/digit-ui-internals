import React from "react";

const Card = ({ card = {}, showLink }) => {
  return (
    <div className="s-card">
      {card.logo && <div className="s-card-logo">
        <img src={card.logo} />
      </div>
      }
      <div>
        {card.component}
        <p className="s-card-title">{card.title}</p>
        <p className="s-card-text">{card.content}</p>
        {showLink && <p className="s-card-link">{`Explore our ${card.title}`}</p>}
      </div>
    </div>
  )
}

export default Card;