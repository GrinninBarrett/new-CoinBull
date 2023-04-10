import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import PurchaseModal from "../PurchaseModal";

const SingleCoinCard = ({
  coin,
  handleDeleteCoin,
  handlePurchaseButton,
  handleModalRemoval,
  initializer,
}) => {
  // const [scriptTag, setScriptTag] = useState('');

  // useEffect(() => {
  //   setScriptTag('<script src="https://widgets.coingecko.com/coingecko-coin-ticker-widget.js"></script>')
  // }, [])
  // const isLoaded = useRef(false)
  // const url = "https://widgets.coingecko.com/coingecko-coin-ticker-widget.js";

  // useEffect(() => {
  //   const head = document.querySelector("head");
  //   const script = document.createElement("script");
  //   script.setAttribute("src", url);
  //   head.appendChild(script);

  //   return () => {
  //     head.removeChild(script);
  //   };
  // }, []);

  return (
    <div
      className="card m-3 p-2 widget-card is-flex is-justify-content-center"
      style={{ flexDirection: "column" }}
    >
      <div
        className="card-content"
        style={{ boxShadow: "8px 8px 15px #D9D9DA, -8px -8px 15px #D9D9DA" }}
      >
        {/* <div
          className="nomics-ticker-widget"
          data-name={`${coin.name}`}
          data-base={`${coin.symbol}`}
          data-quote="USD"
        ></div> */}
        <coingecko-coin-ticker-widget
          coin-id={coin.id}
          currency="usd"
          locale="en"
        ></coingecko-coin-ticker-widget>
        <Helmet>
          <script
            src="https://widgets.coingecko.com/coingecko-coin-ticker-widget.js"
            async
          ></script>
        </Helmet>
      </div>
      <footer
        className="card-footer is-flex is-align-self-center"
        style={{ width: "17rem", marginTop: "1rem", gap: ".5rem" }}
      >
        <button
          className="card-footer-item cards-buttons"
          style={{ backgroundColor: "rgb(56, 200, 56)", color: "white" }}
          type="button"
          onClick={() => handleDeleteCoin(coin.name, coin.symbol)}
        >
          Delete
        </button>
        <button
          className="card-footer-item cards-buttons"
          id={coin.symbol}
          type="button"
          style={{ backgroundColor: "rgb(56, 200, 56)", color: "white" }}
          onClick={handlePurchaseButton}
        >
          Calculate
        </button>

        <PurchaseModal
          handleModalRemoval={handleModalRemoval}
          initializer={initializer}
          ticker={coin.symbol}
        />
      </footer>
    </div>
  );
};

export default SingleCoinCard;
