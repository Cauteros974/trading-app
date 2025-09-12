import { create } from 'zustand';

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

export const useStore = create((set, get) => ({
  stocks: [],
  portfolio: [],

  setStocks: (newStocks) => set({ stocks: newStocks }),
  
  buyStock: (stock, quantity) => {
    const { portfolio } = get();
    const existingItem = portfolio.find(item => item.ticker === stock.ticker);

    if (existingItem) {
      const updatedPortfolio = portfolio.map(item =>
        item.ticker === stock.ticker
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      set({ portfolio: updatedPortfolio });
    } else {
      const newItem = {
        ticker: stock.ticker,
        purchase_price: stock.price,
        quantity: quantity,
        currentPrice: stock.price
      };
      set({ portfolio: [...portfolio, newItem] });
    }
  },

  sellStock: (stock, quantity) => {
    const { portfolio } = get();
    const existingItem = portfolio.find(item => item.ticker === stock.ticker);

    if (!existingItem) return;

    if (existingItem.quantity <= quantity) {
      const updatedPortfolio = portfolio.filter(item => item.ticker !== stock.ticker);
      set({ portfolio: updatedPortfolio });
    } else {
      const updatedPortfolio = portfolio.map(item =>
        item.ticker === stock.ticker
          ? { ...item, quantity: item.quantity - quantity }
          : item
      );
      set({ portfolio: updatedPortfolio });
    }
  },

  fetchHistoricalData: async (ticker) => {
    const now = Math.floor(Date.now() / 1000);
    const oneMonthAgo = now - 30 * 24 * 60 * 60;

    const response = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=D&from=${oneMonthAgo}&to=${now}&token=${API_KEY}`
    );
    const data = await response.json();
    
    if (data.c) {
      return data.t.map((timestamp, index) => ({
        time: timestamp,
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index],
      }));
    }
    return [];
  },
}));