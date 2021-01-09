import React from "react";

export const Stats = ({ stats }) => (
  <div className="stats-container">
    <div className="counts-container">
      <div className="counts">
        <span>{stats.total.count}</span> <span>{stats.total.text}</span>
      </div>
      <div className="counts">
        <span>{stats.remaining.count}</span> <span>{stats.remaining.text}</span>
      </div>
    </div>
  </div>
);
