import axios from "axios";

const nomicsURL = `https://api.nomics.com/v1/currencies/ticker?key=001b0fad7295e9be8c2270792dcc4efb3763624e&interval=1d,30d&convert=USD&per-page=100&page=1`;
export async function getAllCoins() {
  const res = await axios.get(nomicsURL);
  const coins = res.data;
  console.log(coins);
  return coins;
}

const coinGeckoURL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en`
export async function newGetAllCoins() {
  const res = await axios.get(coinGeckoURL);
  console.log(res);
  return res.data;
}


const singleLunarURL = `https://api.lunarcrush.com/v2?data=assets&key=axnpldsftoa03n17z75cy5r&symbol=BTC&interval=day&time_series_indicators=open,close,high,volume,low&data_points=90`;
export async function getASingleCoin() {
  const res = await axios.get(singleLunarURL);
  const coin = res.data;
  return coin;
}
// Gets news from Lunarcrush
export async function getNews(symbol) {
  const res = await axios({
    url: `https://lunarcrush.com/api3/feeds?since=1w&symbol=${symbol}&sources=news`,
    headers: {
      'Authorization': `Bearer pfl8o8fkm9llsf89zsle49d8belg11938rhbm70l7`,
    },
  })
  return res.data;
}

export async function getCoin(ticker) {
  if (ticker) {
    const res = await axios.get(
      `https://api.nomics.com/v1/currencies/ticker?key=001b0fad7295e9be8c2270792dcc4efb3763624e&ids=${ticker}&convert=USD&page=1`
    );
    const coin = res.data;
    return coin;
  }
}
