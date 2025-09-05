import React from 'react';

const StockDetails = ({ stock }) =>{
    return (
        <div className="stock-details-card" style={{
            marginLeft: '40px',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '400px',
            textAlign: 'center'
        }}>
            
            <h2>Ticker details</h2>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stock.ticker}</p>
            <p>Price: {stock.price}</p>
            <p>Change per session: <span style={{ color: stock.change > 0 ? 'green' : 'red' }}>{stock.change.toFixed(2)}</span></p>
        </div>    
    );
};

export default StockDetails;