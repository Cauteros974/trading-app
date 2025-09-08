import React, { useEffect, useState, memo, useRef } from "react";
import { FixedSizeList } from "react-window";

const API_KEY = "d2vhq11r01qm5lo8cotgd2vhq11r01qm5lo8cou0";

const round2 = (n) => Math.round(n * 100) / 100;
const fmtChange = (c) => (c === null || c === undefined ? "—" : c.toFixed(2));
const changeColor = (c) => (c > 0 ? "green" : c < 0 ? "red" : "inherit");

const Header = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1.2fr 0.8fr 0.8fr",
      padding: "20px 300px",
      background: "#007bff",
      color: "#fff",
      fontWeight: 600,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    }}
  >
    <div>Ticker</div>
    <div>Price</div>
    <div>Change</div>
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
        borderBottom: "1px solid #eee",
        cursor: "pointer",
      }}
    >
      <div>{stock.ticker}</div>
      <div>{stock.price.toFixed(2)}</div>
      <div style={{ color: changeColor(stock.change) }}>{fmtChange(stock.change)}</div>
    </div>
  );
});

const TradingTable = ({ onStockSelect }) => {
  const [stocks, setStocks] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const tickers = [
      "AAPL", "GOOGL", "MSFT", "AMZN", "TSLA",
      "BINANCE:BTCUSDT", "BINANCE:ETHUSDT",
      "NVDA", "META", "BABA", "NFLX", "SBUX",
      "UBER", "DIS", "INTC", "CSCO", "PEP"
    ];
   
    const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);
    socketRef.current = socket;
    
    const subscribe = () => {
      
      if (socket.readyState === WebSocket.OPEN) {
        tickers.forEach((t) =>
          socket.send(JSON.stringify({ type: "subscribe", symbol: t }))
        );
      }
    };
    
    socket.addEventListener("open", subscribe);
    
    socket.addEventListener("message", (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type !== "trade" || !Array.isArray(msg.data)) return;

      setStocks((prev) => {
        const prevMap = new Map(prev.map(s => [s.ticker, s]));
        let hasNewData = false;
        
        for (const t of msg.data) {
          const symbol = t.s;
          const price = round2(t.p);
          const prevItem = prevMap.get(symbol);
          
          const change = prevItem ? round2(price - prevItem.price) : 0;
          
          if (prevItem?.price !== price) {
            hasNewData = true;
            prevMap.set(symbol, {
                ticker: symbol,
                price: price,
                change: change,
            });
          }
        }
        
        if (!hasNewData) return prev;

        return Array.from(prevMap.values()).sort((a, b) =>
          a.ticker.localeCompare(b.ticker)
        );
      });
    });
  
    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        tickers.forEach((t) =>
          socketRef.current.send(JSON.stringify({ type: "unsubscribe", symbol: t }))
        );
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Exchange glass</h2>
      <p style={{ marginTop: 0, color: "#555" }}>
        Updated in real time (Finnhub)
      </p>

      <div
        style={{
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
          width="100%"
          itemKey={(index, data) => data.list[index]?.ticker ?? index}
        >
          {Row}
        </FixedSizeList>
      </div>
    </div>
  );
};

export default TradingTable;