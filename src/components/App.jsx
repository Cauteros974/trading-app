import React, { useState, useEffect, useCallback } from 'react';
import TradingTable from './TradingTable';
import StockDetails from './StockDetails';
import { useTheme } from './ThemeContext';
import StockChart from './StockChart';
import SocketTest from './SocketTest';
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
