import React, { useEffect, useRef, memo } from 'react';
import { createChart } from 'lightweight-charts';
import { useStore } from '../store';

const StockChart = memo(({ stock }) => {
  const chartContainerRef = useRef(null);
  const { fetchHistoricalData } = useStore();

  useEffect(() => {
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

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: 'var(--green-positive)',
      downColor: 'var(--red-negative)',
      borderVisible: false,
      wickUpColor: 'var(--green-positive)',
      wickDownColor: 'var(--red-negative)',
    });

    fetchHistoricalData(stock.ticker).then(data => {
      candlestickSeries.setData(data);
    });

    const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY; 
    const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({'type': 'subscribe', 'symbol': stock.ticker}));
    });

    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'trade') {
        const tradeData = message.data[0];
        const newPrice = {
          time: tradeData.t,
          value: tradeData.p,
        };
        candlestickSeries.update({
          time: newPrice.time,
          open: tradeData.p,
          high: tradeData.p,
          low: tradeData.p,
          close: tradeData.p,
        });
      }
    });

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({'type': 'unsubscribe', 'symbol': stock.ticker}));
        socket.close();
      }
      chart.remove();
    };

  }, [stock, fetchHistoricalData]);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current);
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '300px' }} />;
});

export default StockChart;