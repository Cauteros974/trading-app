import React, { useEffect } from "react";

const API_KEY = "d2u1bg9r01qr5a74d4n0d2u1bg9r01qr5a74d4ng";

export default function SocketTest() {
    useEffect(() => {
        const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

        socket.addEventListener("open", () => {
            console.log("✅ WS connected");

            socket.send(JSON.stringify ({type: "subscribe", Symbol: "AAPL"}));
        });

        socket.addEventListener("message", (event) => {
            console.log("📩 WS message:", event.data);
        });

        socket.addEventListener("error", (err) => {
            console.error("❌ WS error:", err);
        });
    });
}
