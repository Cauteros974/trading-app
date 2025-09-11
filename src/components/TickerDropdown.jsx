import React, { useState, useMemo } from 'react';

const TickerDropdown = ({ stocks, selectedStocks, onStockSelect}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, serIsOpen] = useState('false');

    const filteredStocks = useMemo(() => {
        return stocks.filter(stock =>
          stock.ticker.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [stocks, searchTerm]);
};

export default TickerDropdown;