import React, { useState, useEffect, use } from "react";
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

    useEffect( () => {
        if (!stock) return;

        const socket = new WebSocket('wss://ws.finnhub.io?token=${API_KEY}');

        socket.addEventListener("open", () => {
            socket.send(JSON.stringify({ type: "subscribe", symbol: stock.ticker }));
        });
    })
}