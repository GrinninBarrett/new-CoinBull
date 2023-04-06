import React, { useEffect, useState, useMemo } from "react";

import CoinTab from "../CoinTab";
import Pagination from "../Pagination";
import { newGetAllCoins } from "../../utils/API";
import { ADD_FAVORITE } from "../../utils/mutations";
import { GET_MY_FAVORITES } from "../../utils/queries";
import { useMutation, useQuery } from "@apollo/client";
import Auth from "../../utils/auth";
import {
  AddFavoriteCoinIds,
  getFavoriteCoinIds,
  removeCoinId,
} from "../../utils/localStorage";

import "./styles/ProductList.css";

import { REMOVE_COIN } from "../../utils/mutations";
import { REMOVE_FROM_FAVORITES } from "../../utils/actions";
import { useStoreContext } from "../../utils/GlobalState";

function ProductList() {
  const [, dispatch] = useStoreContext();

  const [coinsState, setCoinsState] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage] = useState(20);
  const [sortOrder, setSortOrder] = useState({ sortTarget: "", value: false });
  // let currentFavoriteCoinIds = getFavoriteCoinIds();

  const [favoriteCoinIds, setFavoriteCoinIds] = useState([]);
  console.log(favoriteCoinIds)

  const [addFavorite] = useMutation(ADD_FAVORITE);
  const [removeCoinFromFavorite] = useMutation(REMOVE_COIN);
  const { loading, data } = useQuery(GET_MY_FAVORITES);

 
  const userData = useMemo(() => {
    return data?.getFavoriteCoins || [];
  }, [data?.getFavoriteCoins])

  console.log(userData.favorites);


  useEffect(() => {
    const setFavorites = async () => {
      if (userData.favorites) {
        console.log(userData.favorites);
        const uniqueCoins = userData.favorites.map((coin) => coin.ticker);
        console.log(uniqueCoins);
        setFavoriteCoinIds([...uniqueCoins]);
      }
    }
    setFavorites();
  }, [userData]);


  useEffect(() => {
    const fetchCoins = async () => {
      try {
        // const coins = await getAllCoins();
        // setCoinsState(coins);
        const coins = await newGetAllCoins();
        let updatedCoins = coins.map(coin => {
          //done because new API brings symbol back lowercase but the code is set up for uppercase symbols
          coin.symbol = coin.symbol.toUpperCase();
          return coin;
        })
        console.log(updatedCoins);
        setCoinsState(updatedCoins);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCoins();
  }, []);

  useEffect(() => {
    if (sortOrder.sortTarget !== "") {
      let toBeSorted;
      let toBeSortedA;
      let toBeSortedB;

      if (sortOrder.sortTarget === "coin") {
        toBeSorted = "id";
      } else if (sortOrder.sortTarget === "price") {
        toBeSorted = "price";
      } else if (sortOrder.sortTarget === "change") {
        toBeSorted = "change";
      } else if (sortOrder.sortTarget === "circulating_supply") {
        toBeSorted = "circulating_supply";
      } else if (sortOrder.sortTarget === "market_cap") {
        toBeSorted = "market_cap";
      }

      const compare = (a, b) => {
        if (sortOrder.sortTarget === "coin") {
          toBeSortedA = a[toBeSorted].toLowerCase();
          toBeSortedB = b[toBeSorted].toLowerCase();
        } else if (
          sortOrder.sortTarget === "price" ||
          sortOrder.sortTarget === "circulating_supply" ||
          sortOrder.sortTarget === "market_cap"
        ) {
          toBeSortedA = +a[toBeSorted];
          toBeSortedB = +b[toBeSorted];
        } else if (sortOrder.sortTarget === "change") {
          toBeSortedA = a.price_change_percentage_24h;
          toBeSortedB = b.price_change_percentage_24h;
        }

        let comparison = 0;
        if (toBeSortedA > toBeSortedB) {
          comparison = 1;
        } else if (toBeSortedA < toBeSortedB) {
          comparison = -1;
        }
        if (sortOrder.value) {
          return comparison;
        } else {
          return comparison * -1;
        }
      };

      coinsState.sort(compare);
    }
  }, [coinsState, sortOrder]);

  const handleAddFavorite = async (coinId) => {
    const coinToFavorite = coinsState.find((coin) => coin.symbol === coinId);
    console.log(JSON.stringify(coinsState))
    console.log(coinToFavorite);
    const { id, symbol, name, current_price, market_cap, image, price_change_percentage_24h, total_volume } = coinToFavorite;
    console.log(symbol, id);
    // let oneDay;

    // Ensures this works, since variables can't begin with numbers
    // for (const key in coinToFavorite) {
    //   if (key === "1d") {
    //     oneDay = coinToFavorite[key];
    //   }
    // }

    // const { price_change_percentage_24h, volume } = oneDay;

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      console.log(favoriteCoinIds)

      await addFavorite({
        variables: {
          //includes toString() on some values because api returns number types but GraphQL doesn't like that
          input: {
            name: name,
            ticker: symbol,
            price: current_price.toString(),
            volume: total_volume.toString(),
            dayPercentChange: price_change_percentage_24h.toString(),
            marketCap: market_cap.toString(),
            logoURL: image,
          },
        },
      });
      console.log(favoriteCoinIds)
      let updatedFavoriteCoinIds = [...favoriteCoinIds, symbol];
      console.log(updatedFavoriteCoinIds);
      setFavoriteCoinIds(updatedFavoriteCoinIds);
      AddFavoriteCoinIds(updatedFavoriteCoinIds);
    } catch (err) {
      console.error(`here is an error: ${JSON.stringify(err)}`);
    }
  };

  const handleDeleteCoin = async (name, id) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeCoinFromFavorite({
        variables: { name },
      });
      dispatch({
        type: REMOVE_FROM_FAVORITES,
        name: name,
      });
      removeCoinId(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckFavorites = (coin) => {
    const localStorageFavorites = getFavoriteCoinIds();
    // const newFavorites = localStorageFavorites;
    return localStorageFavorites.includes(coin);
    // return favoriteCoinIds.includes(coin);
  }

  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = coinsState.slice(indexOfFirstCoin, indexOfLastCoin);
  

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSortChange = (event) => {
    let invokedTarget = event.target.id;
    setSortOrder({ sortTarget: invokedTarget, value: !sortOrder.value });
  };

  return (
    <>
      <div className="is-flex is-justify-content-center mt-3">
        <table className="table mt-1">
          <thead>
            <tr>
              <th> </th>
              <th>#</th>
              <th>Coin</th>
              <th id="coin" className="tableHead" onClick={handleSortChange}>
                <span className="arrows">&#8661;</span>
                Name
              </th>
              <th id="price" className="tableHead" onClick={handleSortChange}>
                <span className="arrows">&#8661;</span>
                Price
              </th>
              <th id="change" className="tableHead" onClick={handleSortChange}>
                <span className="arrows" onClick={handleSortChange}>
                  &#8661;
                </span>
                Pct  
              </th>
              <th
                id="circulating_supply"
                className="tableHead to-remove"
                onClick={handleSortChange}
              >
                <span className="arrows" onClick={handleSortChange}>
                  &#8661;
                </span>
                Circulating supply
              </th>
              <th
                id="market_cap"
                className="tableHead to-remove"
                onClick={handleSortChange}
              >
                <span className="arrows to-remove" onClick={handleSortChange}>
                  &#8661;
                </span>
                Market Cap
              </th>
              <th className="to-remove">Price Chart</th>
            </tr>
          </thead>
          <tbody>
            {currentCoins.map((coin) => (
              <CoinTab
                key={coin.id}
                id={coin.symbol}
                rank={coin.market_cap_rank}
                name={coin.name}
                logo_url={coin.image}
                price={coin.current_price}
                change={coin.price_change_percentage_24h}
                circulating_supply={coin.circulating_supply}
                market_cap={coin.market_cap}
                handleAddFavorite={handleAddFavorite}
                handleDeleteCoin={handleDeleteCoin}
                favorite={handleCheckFavorites(coin.symbol)}
                // favorite={favoriteCoinIds.includes(coin.symbol)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        coinsPerPage={coinsPerPage}
        totalCoins={coinsState.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </>
  );
}

export default ProductList;
