import React, { useState, useEffect, useMemo } from 'react';
import { FixedSizeList } from 'react-window';

const API_KEY = "d2tendpr01qr5a72a7b0d2tendpr01qr5a72a7bg";

const Row = ({ index, style, data }) => {
  const { filteredStocks, onStockSelect } = data;
  const stock = filteredStocks[index];

  if (!stock) {
    return null;
  }

  return (
    <div
      style={{ ...style, display: 'flex', cursor: 'pointer', borderBottom: '1px solid #ddd' }}
      onClick={() => onStockSelect(stock)}
    >
      <div style={{ width: '33.3%', padding: '12px 15px' }}>{stock.ticker}</div>
      <div style={{ width: '33.3%', padding: '12px 15px' }}>{stock.price}</div>
      <div style={{ width: '33.3%', padding: '12px 15px', color: stock.change > 0 ? 'green' : 'red' }}>
        {stock.change.toFixed(2)}
      </div>
    </div>
  );
};

const TradingTable = ({ onStockSelect }) => {
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);
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

  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => 
      stock.ticker.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stocks, searchTerm]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Биржевой стакан</h2>
      <p>Обновляется в реальном времени (Finnhub.io)</p>
      <input
        type="text"
        placeholder="Поиск по тикеру..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', maxWidth: '800px', padding: '10px', fontSize: '16px', marginBottom: '20px', border: '1px solid #ddd' }}
      />
      <div style={{ width: '100%', maxWidth: '800px', border: '1px solid #ddd', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        {/* Заголовки таблицы, стилизованные как div */}
        <div style={{ display: 'flex', backgroundColor: '#007bff', color: '#fff', fontWeight: 'bold' }}>
          <div style={{ width: '33.3%', padding: '12px 15px', textAlign: 'left' }}>Тикер</div>
          <div style={{ width: '33.3%', padding: '12px 15px', textAlign: 'left' }}>Цена</div>
          <div style={{ width: '33.3%', padding: '12px 15px', textAlign: 'left' }}>Изменение</div>
        </div>

        {/* Используем FixedSizeList для виртуализации списка */}
        <FixedSizeList
          height={600}
          itemCount={filteredStocks.length}
          itemSize={40}
          itemData={{ filteredStocks, onStockSelect }}
          width={'100%'}
        >
          {Row}
        </FixedSizeList>
      </div>
    </div>
  );
};

export default TradingTable;