import { create } from "zustand";

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

export const usestore = create((get, set)=> ({
  stocks: [],
  portfolio: [],

  setStocks: (newStocks) => set({ stocks: newStocks }),

  buyStock: (stock, quantity) => {
    const { portfolio } = get();
    const existingItem = portfolio.find(item => item.ticker === stock.ticker);

    if(existingItem) {
      const updatePortfolio = portfolio.map(item =>
        item.ticker === stock.ticker
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      set({ portfolio: updatePortfolio });
    } else{
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
}));