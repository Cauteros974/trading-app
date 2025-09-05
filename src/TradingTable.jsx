import React, {useState, useEffect} from "react";
import { AutoSizer, Table, Column } from "react-virtualized";
import "react-virtualized/styles.css";

const API_KEY = "d2tendpr01qr5a72a7b0d2tendpr01qr5a72a7bg";

const round2 = (n) => Math.round(n * 100) / 100;

const TradingTable = ({ onStockSelect }) => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const socket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);
    const tickers = [
      "AAPL", "GOOGL", "MSFT", "AMZN", "TSLA",
      "BINANCE:BTCUSDT", "BINANCE:ETHUSDT",
      "NVDA", "META", "BABA", "NFLX",
      "SBUX", "UBER", "DIS", "INTC", "CSCO", "PEP"
    ];

    socket.addEventListener("open", () => {
      tickers.forEach((t) =>
        socket.send(JSON.stringify({ type: "subscribe", symbol: t }))
      );
    });

    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
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

        return Object.values(map).sort((a, b) =>
          a.ticker.localeCompare(b.ticker)
        );
      });
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
          height: 600,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <AutoSizer>
          {({ height, width }) => (
            <Table
              width={width}
              height={height}
              headerHeight={40}
              rowHeight={40}
              rowCount={stocks.length}
              rowGetter={({ index }) => stocks[index]}
              onRowClick={({ rowData }) => onStockSelect?.(rowData)}
              rowStyle={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              headerStyle={{
                background: "#007bff",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              <Column label="Тикер" dataKey="ticker" width={width * 0.33} />
              <Column
                label="Цена"
                dataKey="price"
                width={width * 0.33}
                cellRenderer={({ cellData }) => cellData.toFixed(2)}
              />
              <Column
                label="Изменение"
                dataKey="change"
                width={width * 0.34}
                cellRenderer={({ cellData }) => (
                  <span
                    style={{
                      color: cellData > 0 ? "green" : cellData < 0 ? "red" : "black",
                    }}
                  >
                    {cellData.toFixed(2)}
                  </span>
                )}
              />
            </Table>
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

export default TradingTable;