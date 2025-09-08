import React, { useEffect, useState, memo } from "react";
import { FixedSizeList } from "react-window";

const API_KEY = "d2u1bg9r01qr5a74d4n0d2u1bg9r01qr5a74d4ng";

const round2 = (n) => Math.round(n * 100) / 100;
const fmtChange = (c) => (c === null || c === undefined ? "—" : c.toFixed(2));
const changeColor = (c) => (c > 0 ? "green" : c < 0 ? "red" : "inherit");

const Header () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1.2fr 0.8fr 0.8fr",
      padding: "12px 15px",
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