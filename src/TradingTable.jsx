import React from "react";
import { FixedSizeList } from 'react-window';

const API_KEY = "d2rj7v9r01qv11les8i0d2rj7v9r01qv11les8ig";

const Row = ({ index, style, data }) => {
  const { stocks, onStockSelect } = data;
  const stock = stock[index];

  if (!stock) {
    return null;
  }

  return(
    <div style={style}>
      <tr
        onClick={() => onStockSelect(stock)}
        style={{ cursor: 'pointer', display: 'flex' }}
      >
        <td style={{ width: '33.3%', padding: '12px 15px' }}>{stock.ticker}</td>
        <td style={{ width: '33.3%', padding: '12px 15px' }}>{stock.price}</td>
        <td style={{ width: '33.3%', padding: '12px 15px', color: stock.change > 0 ? 'green' : 'red' }}>
          {stock.change.toFixed(2)}
        </td>
      </tr>
    </div>
  )
}