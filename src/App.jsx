import React, { useState, useEffect, useCallback } from 'react';
import TradingTable from './components/TradingTable';
import StockDetails from './components/StockDetails';
import { useTheme } from './components/ThemeContext';
import StockChart from './components/StockChart';
import SocketTest from './components/SocketTest';
import './App.css';

function App() {
  const [selectedStock, setSelectedStock] = useState(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleStockSelect = useCallback((stock) => {
    setSelectedStock(stock);
  }, []);

  return (
    <div className="App">
      <button onClick={toggleTheme} className="theme-switcher">
      <img src='/src/assets/moon-svgrepo-com.svg'></img>
      </button>

      <TradingTable onStockSelect={handleStockSelect} />

      {selectedStock && (
        <>
          <StockDetails stock={selectedStock} />
          <StockChart stock={selectedStock} />
        </>
      )}

      <SocketTest />
    </div>

    
  );
}

export default App;
