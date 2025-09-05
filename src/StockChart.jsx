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

const StockChart = ({ stock }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if(!stock) return;

        const socket = new WebSocket('wss://ws.finnhub.io?token=${API_KEY}');

        socket.addEventListener("message", (event: MessageEvent<string>) => {
            const message = JSON.parse(event.data);
            if (message.type === "trade") {
              const tradeData = message.data[0];
              setChartData((prevData) => {
                const newData = [
                  ...prevData,
                  { time: new Date().toLocaleTimeString(), price: tradeData.p },
                ];
                return newData.length > 50 ? newData.slice(1) : newData;
              });
            }
          });
          
    });
}