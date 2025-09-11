import React, { useState, useEffect } from 'react';
import TradingTable from './components/TradingTable';
import StockDetails from './components/StockDetails';
import TickerDropdown from './components/TickerDropdown';
import Portfolio from './components/Portfolio';
import ThemeProvider from './components/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store';
import './App.css';

function App() {
  const { stocks, setStocks, portfolio, buyStock, sellStock } = useStore();
  const [selectedStock, setSelectedStock] = useState(null);

  // Логика WebSocket остается в App.jsx и обновляет состояние через Zustand
  useEffect(() => {
    const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY; 
    const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);
    const tickers = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "BINANCE:BTCUSDT", "BINANCE:ETHUSDT", "NVDA", "META", "BABA", "NFLX", "SBUX", "UBER", "DIS", "INTC", "CSCO", "PEP"];
    
    socket.addEventListener('open', () => {
      tickers.forEach(ticker => {
        socket.send(JSON.stringify({'type': 'subscribe', 'symbol': ticker}));
      });
    });

    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'trade') {
        const tradeData = message.data[0];
        const { s: symbol, p: price } = tradeData;

        useStore.setState(prev => {
          const newStocks = [...prev.stocks];
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
          
          return {
            stocks: updatedStocks,
            portfolio: prev.portfolio.map(item =>
              item.ticker === symbol ? { ...item, currentPrice: parseFloat(price.toFixed(2)) } : item
            )
          };
        });
      }
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="App">
        <div className="main-content">
          <h2>Биржевой стакан</h2>
          <TickerDropdown
            stocks={stocks}
            selectedStock={selectedStock}
            onStockSelect={setSelectedStock}
          />
          <div className="trading-layout">
            <TradingTable onStockSelect={setSelectedStock} />
            <AnimatePresence>
              {selectedStock && (
                <StockDetails
                  stock={selectedStock}
                  buyStock={buyStock}
                  sellStock={sellStock}
                />
              )}
            </AnimatePresence>
          </div>
          <Portfolio portfolio={portfolio} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;