import React, { useEffect, useRef, memo } from 'react';
import { createChart } from 'lightweight-charts';
import { useStore } from '../store';

const StockChart = memo(({ stock }) => {
  const chartContainerRef = useRef(null);
  const { fetchHistoricalData } = useStore();

  useEffect(() =>{
    if (!stock || !chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        backgroundColor: 'transparent',
        textColor: 'var(--text-color)',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      rightPriceScale: {
        borderColor: 'var(--text-color)',
      },
      timeScale: {
        borderColor: 'var(--text-color)',
        timeVisible: true,
        secondsVisible: false,
      },
  });
});

export default StockChart;