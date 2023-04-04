import React from "react";
import ProductList from "../components/ProductList";
import NewsCard from "../components/NewsCard";

const Prices = () => {
  return (
    <div className="container">
      <ProductList />
      <NewsCard symbol="BTC" />
    </div>
  );
};

export default Prices;
