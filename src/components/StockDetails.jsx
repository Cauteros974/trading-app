import React, { useState, useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { motion } from 'framer-motion';
import { useStore } from '../store';

const StockDetails = ({ stock, buyStock, sellStock }) => {
  const [quantity, setQuantity] = useState(1);
  const chartContainerRef = useRef();
  const { fetchHistoricalData } = useStore();

  useEffect(() => {
    if (!stock || !stock.ticker) {
      return;
    }

    let chart = null;
    let candleSeries = null;

    const fetchAndRenderChart = async () => {
      const historicalData = await fetchHistoricalData(stock.ticker);
      if (historicalData && historicalData.length > 0) {
        candleSeries.setData(historicalData);
      } else {
        candleSeries.setData([]);
      }
    };

    if (chartContainerRef.current) {
      chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 300,
        layout: {
          backgroundColor: '#000000',
          textColor: '#d1d4dc',
        },
        grid: {
          vertLines: { color: '#334158' },
          horzLines: { color: '#334158' },
        },
        rightPriceScale: {
          borderColor: '#48587b',
        },
        timeScale: {
          borderColor: '#48587b',
        },
      });

      candleSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderDownColor: '#ef5350',
        borderUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        wickUpColor: '#26a69a',
      });

      fetchAndRenderChart();

      const handleResize = () => {
        if (chart) {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chart) {
          chart.remove();
        }
      };
    }
  }, [stock, fetchHistoricalData]);

  if (!stock) {
    return null;
  }

  return (
    <motion.div
      className="stock-details-card"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
    >
      <h2>Ticket Information</h2>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stock.ticker}</p>
      <p>Price: {stock.price}</p>
      <p>Change per session: 
        <span style={{ color: stock.change > 0 ? 'var(--green-positive)' : 'var(--red-negative)' }}>
          {stock.change.toFixed(2)}
        </span>
      </p>

      <div ref={chartContainerRef} className="chart-container"></div>

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