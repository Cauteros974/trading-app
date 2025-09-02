import React, { useState, useEffect } from 'react';

const API_KEY = "d2rj7v9r01qv11les8i0d2rj7v9r01qv11les8ig";

const TradingTable = ({ onStockSelect }) => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {

    const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);
    
    const tickers = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"];
    socket.addEventListener('open', (event) => {
      tickers.forEach(ticker => {
        socket.send(JSON.stringify({'type': 'subscribe', 'symbol': ticker}));
      });
    });
    
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'trade') {
        const tradeData = message.data[0];
        const { s: symbol, p: price } = tradeData;

        setStocks(prevStocks => {
          const newStocks = [...prevStocks];
          let updated = false;

          const updatedStocks = newStocks.map(stock => {
            if (stock.ticker === symbol) {
              const change = price - stock.price;
              updated = true;
              return {
                ...stock,
                price: parseFloat(price.toFixed(2)),
                change: parseFloat(change.toFixed(2)),
              };
            }
            return stock;
          });
          
          if (!updated) {
            updatedStocks.push({
              id: symbol,
              ticker: symbol,
              price: parseFloat(price.toFixed(2)),
              change: 0
            });
          }
          return updatedStocks;
        });
      }
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Exchange glass</h2>
      <p>Updated in real time </p>
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Price</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr
              key={stock.id}
              onClick={() => onStockSelect(stock)}
              style={{ cursor: 'pointer' }}
            >
              <td>{stock.ticker}</td>
              <td>{stock.price}</td>
              <td style={{ color: stock.change > 0 ? 'green' : 'red' }}>
                {stock.change.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradingTable;