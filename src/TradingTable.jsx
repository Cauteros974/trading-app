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

  const TraidingTable = () => {
    const [stocks, setStocks] = useState(() => generateRandomData(50));

    useEffect(() => {
        const interval = setInterval(() => {
            setStocks((prevStocks) => {
                return prevStocks.map((stock) => {
                    const change = (Math.random() - 0.5) * 0.5;
                    const newPrice = Math.max(0, stock.price + change);
                    const newChange = newPrice - stock.price;

                    return {
                        ...stock,
                        price: parseFloat(newPrice.toFixed(2)),
                        change: newChange,
                    };
                });
            });
        });
    }, 500);
  }
export default TradingTable;