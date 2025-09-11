import React, { useState, useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import { useStore } from '../store';

const Row = ({ index, style, data }) => {
  const { filteredStocks, onStockSelect } = data;
  const stock = filteredStocks[index];

  if (!stock) {
    return null;
  }

  return (
    <div style={style}>
      <tr onClick={() => onStockSelect(stock)} className="table-row">
        <td>{stock.ticker}</td>
        <td>{stock.price}</td>
        <td style={{ color: stock.change > 0 ? 'var(--green-positive)' : 'var(--red-negative)' }}>
          {stock.change.toFixed(2)}
        </td>
      </tr>
    </div>
  );
};

const TradingTable = ({ onStockSelect }) => {
  const stocks = useStore(state => state.stocks);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStocks = useMemo(() => {
    return stocks.filter(stock =>
      stock.ticker.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stocks, searchTerm]);

  return (
    <div className="trading-table-container">
      <input
        type="text"
        placeholder="Search by ticker..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Price</th>
            <th>Change</th>
          </tr>
        </thead>
      </table>
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
  );
};

export default TradingTable;