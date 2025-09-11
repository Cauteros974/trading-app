import React from 'react';
import { motion } from 'framer-motion';

const Portfolio = ({ portfolio }) => {
    return(
        <motion.div 
            className="porfolio-container"
            initial= {{ opacity: 0, y: 50}}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2>Virtual portfolio</h2>
            {portfolio.length === 0 ? (
        <p>Ваш портфель пуст.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Quantity</th>
              <th>Purchase price</th>
              <th>Current price</th>
              <th>Profit/Loss ($)</th>
              <th>Profit/Loss (%)</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map(item => {
              const profitLoss = (item.currentPrice - item.purchase_price) * item.quantity;
              const profitLossPercentage = ((item.currentPrice - item.purchase_price) / item.purchase_price) * 100;
              return (
                <tr key={item.ticker}>
                  <td>{item.ticker}</td>
                  <td>{item.quantity}</td>
                  <td>${item.purchase_price.toFixed(2)}</td>
                  <td>${item.currentPrice.toFixed(2)}</td>
                  <td style={{ color: profitLoss >= 0 ? 'var(--green-positive)' : 'var(--red-negative)' }}>
                    ${profitLoss.toFixed(2)}
                  </td>
                  <td style={{ color: profitLossPercentage >= 0 ? 'var(--green-positive)' : 'var(--red-negative)' }}>
                    {profitLossPercentage.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
            </tbody>
            </table>
      )}
        </motion.div>
    )
};

export default Portfolio;