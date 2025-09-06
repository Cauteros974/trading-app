import React, { useState, useEffect, useCallback } from 'react';
import TradingTable from './TradingTable';
import StockDetails from './StockDetails';
import { useTheme } from './ThemeContext';
import StockChart from './StockChart';
import './App.css';

function App() {
  const [selectedStock, setSelectedStock,] = useState(null);
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
        Switch theme ({theme === 'light' ? 'Light' : 'Dark'})
      </button>

      <TradingTable onStockSelect={handleStockSelect} />
      {selectedStock && <StockDetails stock={selectedStock} />}
    </div>
  );
}

export default App;