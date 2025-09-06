import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_KEY = "d2tendpr01qr5a72a7b0d2tendpr01qr5a72a7bg";

const StockChart = ({ stocks }) => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!stocks?.length) return;

    setLoading(true);
    setChartData({});

    const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

    const subscribe = () => {
      stocks.forEach((stock) => {
        socket.send(JSON.stringify({ type: "subscribe", symbol: stock.ticker }));
      });
    };

    const unsubscribe = () => {
      if (socket.readyState === WebSocket.OPEN) {
        stocks.forEach((stock) => {
          socket.send(
            JSON.stringify({ type: "unsubscribe", symbol: stock.ticker })
          );
        });
      }
    };

    socket.addEventListener("open", subscribe);

    socket.addEventListener("message", (e) => {
      const message = JSON.parse(e.data);
      if (message.type === "trade" && message.data?.length) {
        const trade = message.data[message.data.length - 1];
        const time = new Date().toLocaleTimeString("en-GB", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        setChartData((prev) => {
          const prevStockData = prev[trade.s] || [];
          const newStockData = [
            ...prevStockData,
            { time, price: trade.p },
          ].slice(-50);

          return {
            ...prev,
            [trade.s]: newStockData,
          };
        });

        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      socket.close();
    };
  }, [stocks]);

  if (loading) {
    return (
      <div
        style={{
          height: "300px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
          color: "#666",
        }}
      >
        ⏳ Loading chart...
      </div>
    );
  }
  
  const labels =
    Object.values(chartData)[0]?.map((item) => item.time) || [];

  const datasets = stocks.map((stock, idx) => ({
    label: stock.ticker,
    data: chartData[stock.ticker]?.map((item) => item.price) || [],
    borderColor: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
    tension: 0.2,
    pointRadius: 0,
  }));

  const data = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      x: { display: false },
      y: { beginAtZero: false },
    },
  };

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default StockChart;