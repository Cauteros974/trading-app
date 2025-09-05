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

        socket.addEventListener("message", (e) => {
            const message = JSON.parse(e.data);
            if (message.type === "trade") {
                message.data.forEach((tradeData) =>{
                    setChartData((prevData) =>{
                        const newData = [
                            ...prevData,
                            { time: new Date().toLocaleTimeString(), price: tradeData.p },
                        ];
                        return newData.length > 50 ? newData.slice(1) : newData;
                    });
                });
            }
        });

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: "unsubscrible", symbol: stock.ticker}));
            }
            socket.close();
        };
    }, [stock]);

    const data = {
        labels: chartData.map((item) => item.time),
        datasets: [
            {
                label: "Price",
                data: chartData.map((item) => item.price),
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
                PointRadius: 0,
            },
        ],
    };

    
}