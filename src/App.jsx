import React, { useState, useEffect } from 'react';
import TradingTable from './TradingTable';
import StockDetails from './StockDetails';
import { useTheme } from './ThemeContext';
import './App.css';

function App() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [theme, toggleTheme] = useTheme;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  return (
    <div className="App">
      <button onClick={toggleTheme} style={{ position: 'fixed', top: '20px', right: '20px', padding: '10px 15px', cursor: 'pointer', zIndex: 100 }}>
        Change Theme ({theme === 'light' ? 'Светлая' : 'Тёмная'})
      </button>
      <TradingTable onStockSelect={handleStockSelect} />
      {selectedStock && <StockDetails stock={selectedStock} />}
    </div>
  );
}

export default App;