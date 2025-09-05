import React, { useEffect, useState, memo } from "react";
import { FixedSizeList } from "react-window";

const API_KEY = "d2tendpr01qr5a72a7b0d2tendpr01qr5a72a7bg";

const round2 = (n) => Math.round(n * 100) / 100;
const fmtChange = (c) => (c === null || c === undefined ? "—" : c.toFixed(2));
const changeColor = (c) => (c > 0 ? "green" : c < 0 ? "red" : "inherit");

const Header = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1.2fr 0.8fr 0.8fr",
      gap: 0,
      padding: "12px 15px",
      background: "#007bff",
      color: "#fff",
      fontWeight: 600,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    }}
  >
    <div>Тикер</div>
    <div>Цена</div>
    <div>Изменение</div>
  </div>
);

const Row = memo(({ index, style, data }) => {
  const { list, onStockSelect } = data;
  const stock = list[index];
  if (!stock) return null;

  return (
    <div
      onClick={() => onStockSelect?.(stock)}
      style={{
        ...style,
        display: "grid",
        gridTemplateColumns: "1.2fr 0.8fr 0.8fr",
        alignItems: "center",
        padding: "0 15px",
        height: "40px",
        borderBottom: "1px solid #eee",
        cursor: "pointer",
        userSelect: "none",
      }}
      role="row"
    >
      <div>{stock.ticker}</div>
      <div>{stock.price.toFixed(2)}</div>
      <div style={{ color: changeColor(stock.change) }}>{fmtChange(stock.change)}</div>
    </div>
  );
});

const TradingTable = ({ onStockSelect }) => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);
    const tickers = [
      "AAPL", "GOOGL", "MSFT", "AMZN", "TSLA",
      "BINANCE:BTCUSDT", "BINANCE:ETHUSDT",
      "NVDA", "META", "BABA", "NFLX", "SBUX",
      "UBER", "DIS", "INTC", "CSCO", "PEP"
    ];

    const subscribe = () => {
      tickers.forEach((t) =>
        socket.send(JSON.stringify({ type: "subscribe", symbol: t }))
      );
    };

    socket.addEventListener("open", subscribe);

    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "ping") return;
      if (message.type !== "trade" || !Array.isArray(message.data)) return;
      
      setStocks((prev) => {
        const map = Object.create(null);
        for (const s of prev) map[s.ticker] = s;

        for (const t of message.data) {
          const symbol = t.s;
          const price = t.p;
          const prevItem = map[symbol];

          if (prevItem) {
            const change = price - prevItem.price;
            map[symbol] = {
              ...prevItem,
              price: round2(price),
              change: round2(change),
            };
          } else {
            map[symbol] = {
              ticker: symbol,
              price: round2(price),
              change: 0,
            };
          }
        }

        const next = Object.values(map).sort((a, b) =>
          a.ticker.localeCompare(b.ticker)
        );
        return next;
      });
    });

    socket.addEventListener("error", (e) => {
      console.error("WS error:", e);
    });

    socket.addEventListener("close", (e) => {
      console.warn("WS closed:", e.code, e.reason);
    });

    return () => socket.close();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 6 }}>Биржевой стакан</h2>
      <p style={{ marginTop: 0, color: "#555" }}>
        Обновляется в реальном времени (Finnhub)
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: 820,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <Header />

        <FixedSizeList
          height={600}
          itemCount={stocks.length}
          itemSize={40}
          itemData={{ list: stocks, onStockSelect }}
          width={"100%"}
          itemKey={(index, data) => data.list[index].ticker}
        >
          {Row}
        </FixedSizeList>
      </div>
    </div>
  );
};

export default TradingTable;
