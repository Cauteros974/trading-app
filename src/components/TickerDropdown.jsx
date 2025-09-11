import React, { useState, useMemo } from 'react';

const TickerDropdown = ({ stocks, selectedStock, onStockSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredStocks = useMemo(() => {
    return stocks.filter(stock =>
      stock.ticker.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stocks, searchTerm]);

  const handleSelect = (stock) => {
    onStockSelect(stock);
    setSearchTerm(stock.ticker);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
      <input
        type="text"
        placeholder="Select ticker..."
        value={selectedStock ? selectedStock.ticker : searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="search-input"
      />
      {isOpen && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'var(--card-background)',
          border: '1px solid var(--border-color)',
          borderTop: 'none',
          maxHeight: '200px',
          overflowY: 'auto',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          zIndex: 100,
          boxShadow: 'var(--box-shadow)'
        }}>
          {filteredStocks.length > 0 ? (
            filteredStocks.map(stock => (
              <li
                key={stock.ticker}
                onClick={() => handleSelect(stock)}
                style={{
                  padding: '10px 15px',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border-color)'
                }}
              >
                {stock.ticker}
              </li>
            ))
          ) : (
            <li style={{ padding: '10px 15px' }}>No matches</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default TickerDropdown;