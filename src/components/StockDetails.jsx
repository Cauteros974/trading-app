import React from "react";
import './App.css';

const StockDetails = ({ stock }) => {
  if (!stock) return null;

  return (
    <div className="stock-details-card">
      <h2>Ticker details</h2>
      <p className="stock-price">{stock.ticker}</p>
      <p>Price: {Number(stock.price).toFixed(2)}</p>
      <p>
        Change per session:{" "}
        <span style={{ color: stock.change > 0 ? "green" : "red" }}>
          {stock.change.toFixed(2)}
        </span>
      </p>
    </div>
  );
};

export default StockDetails;