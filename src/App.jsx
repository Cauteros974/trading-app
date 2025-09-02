import React, { useState } from 'react';
import TradingTable from './TradingTable';
import StockDetails from './StockDetails';
import './App.css';

function App() {
  const [selectedStock, setSelectedStock] = useState(null);

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  return (
    <div className="App">
      <TradingTable onStockSelect={handleStockSelect} />
      {selectedStock && <StockDetails stock={selectedStock} />}
    </div>
  );
}

export default App;