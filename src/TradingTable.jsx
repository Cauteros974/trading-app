import React, {useState, useEffect} from "react";

const generateRandomData = (count) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const price = (Math.random() * 100 + 100).toFixed(2);
      data.push({
        id: i,
        ticker: `STOCK-${i}`,
        price: parseFloat(price),
        change: 0,
      });
    }
    return data;
  };

  
export default TradingTable;