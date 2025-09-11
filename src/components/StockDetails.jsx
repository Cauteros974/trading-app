import React, { useState } from 'react';
import StockChart from './StockChart';
import { motion } from 'framer-motion';

const StockDetails = ({ stock, buyStock, sellStock }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <motion.div
      className="stock-details-card"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
    >
      <h2>Ticker details</h2>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stock.ticker}</p>
      <p>Price: {stock.price}</p>
      <p>Change per session: 
        <span style={{ color: stock.change > 0 ? 'var(--green-positive)' : 'var(--red-negative)' }}>
          {stock.change.toFixed(2)}
        </span>
      </p>

      <div style={{ marginTop: '20px' }}>
        <StockChart stock={stock} />
      </div>

      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
          className="quantity-input"
          style={{ maxWidth: '80px', textAlign: 'center', marginBottom: '10px' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="buy-button" onClick={() => buyStock(stock, parseInt(quantity))}>
            Buy
          </button>
          <button className="sell-button" onClick={() => sellStock(stock, parseInt(quantity))}>
            Sell
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default StockDetails;