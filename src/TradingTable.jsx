import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FixedSizeList } from 'react-window';

const API_KEY = "d2rj7v9r01qv11les8i0d2rj7v9r01qv11les8ig";

const Row = ({ index, style, data }) => {
  const { stocks, onStockSelect } = data;
  const stock = stock[index];

  if (!stock) {
    return null;
  }

  return(
    <div style={style}>
      <tr
        onClick={() => onStockSelect(stock)}
        style={{ cursor: 'pointer', display: 'flex' }}
      >
        <td style={{ width: '33.3%', padding: '12px 15px' }}>{stock.ticker}</td>
        <td style={{ width: '33.3%', padding: '12px 15px' }}>{stock.price}</td>
        <td style={{ width: '33.3%', padding: '12px 15px', color: stock.change > 0 ? 'green' : 'red' }}>
          {stock.change.toFixed(2)}
        </td>
      </tr>
    </div>
  )
};

const TradingTable = ({ onStockSelect }) => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(`wss://ws.finnhub.io?token=${d2rj7v9r01qv11les8i0d2rj7v9r01qv11les8ig}`);
    const tickers = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "BINANCE:BTCUSDT", "BINANCE:ETHUSDT", "NVDA", "META", "BABA", "NFLX", "SBUX", "UBER", "DIS", "INTC", "CSCO", "PEP"];
    
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
          updatedStocks.sort((a, b) => a.ticker.localeCompare(b.ticker));
          return updatedStocks;
        });
      }
    });

    return () => {
      socket.close();
    };
  }, []);