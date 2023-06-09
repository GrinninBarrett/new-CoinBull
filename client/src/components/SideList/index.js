import React, { useEffect, useState } from "react";
import CoinSideTab from "../CoinSideTab";
// import Pagination from "../Pagination";
import { getAllCoins, newGetAllCoins } from "../../utils/API";



function SideList() {
  // const [state, dispatch] = useStoreContext();

  // const { currentCategory } = state;
  const [coinsState, setCoinsState] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage] = useState(100);

  // const { loading, data } = useQuery(QUERY_PRODUCTS);
  

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const coins = await newGetAllCoins();
        const newCurrentCoins = coins.map(coin => {
          coin.oneDay = coin["1d"]
          return coin;
        })
        setCoinsState(newCurrentCoins);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCoins();
  }, []);

  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = coinsState.slice(indexOfFirstCoin, indexOfLastCoin);

  console.log(currentCoins);

  // const paginate = (pageNumber) => setCurrentPage(pageNumber);
  

  return (
    <div className="" style={{ marginTop: ".5rem" }}>
      <div
        style={{ height: "740px", overflow: "scroll" }}
        className="is-flex is-justify-content-center"
      >
        <div className="is-flex-direction-row is-justify-content-center">
          <div className="is-capitalized is-size-3 has-text-left">Explore</div>
          <table className="table mt-1">
            <thead>
              <tr>
                <th></th>
                <th>Coin</th>
                <th>Name</th>
                <th>Price</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {currentCoins.map((coin) => (
                <CoinSideTab
                  key={coin.id}
                  id={coin.symbol}
                  name={coin.name}
                  logo_url={coin.image}
                  price={coin.current_price}
                  change={coin.price_change_percentage_24h}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SideList;
