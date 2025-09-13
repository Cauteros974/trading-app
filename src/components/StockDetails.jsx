import React, { useEffect, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { create } from 'zustand';

const StockDetails = ({ stock, buyStock, sellStock }) => {

  const[ quantity, setQuantite ] = useState(1);
  const chartContainerRef = useRef();
  const { fetchHistoricalData } = useStore();

  useEffect(() =>{
    let Chart = null;
    let candleSeries = null;
    let dataLoaded = false;

    const fetchAndRenderChart = async () => {
      const historicalData = await fetchHistoricalData(stock.ticker);
      if (historicalData.length > 0) {
        candleSeries.setData(historicalData);
        dataLoaded = true;
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

      
    }
  })

  if (!stock) {
    return null;
  }

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      marginTop: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3>Ticker information: {stock.ticker}</h3>
      <p>Price: ${stock.price}</p>
      <p>Change: <span style={{ color: stock.change > 0 ? 'green' : 'red' }}>{stock.change.toFixed(2)}</span></p>
      <button className="buy-button" onClick={() => buyStock(stock, parseInt(quantity))}>
        Buy
      </button>
      <button className="sell-button" onClick={() => sellStock(stock, parseInt(quantity))}>
        Sell
      </button>
    </div>
  );
};

export default StockDetails;