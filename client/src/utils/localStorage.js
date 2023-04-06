export const getFavoriteCoinIds = () => {
  const favoriteCoinIds = localStorage.getItem("favorite_coins")
    ? JSON.parse(localStorage.getItem("favorite_coins"))
    : [];
    console.log(`favoriteCoinIds from localStorage: ${favoriteCoinIds}`);

  return favoriteCoinIds;
};

export const AddFavoriteCoinIds = (coinIdArr) => {
  // if (coinIdArr.length) {
  //   localStorage.setItem("favorite_coins", JSON.stringify(coinIdArr));
  // } else {
  //   localStorage.removeItem("favorite_coins");
  // }
  localStorage.setItem("favorite_coins", JSON.stringify(coinIdArr));
};

export const removeCoinId = (coinId) => {
  const favoriteCoinIds = localStorage.getItem("favorite_coins")
    ? JSON.parse(localStorage.getItem("favorite_coins"))
    : null;

  if (!favoriteCoinIds) {
    return false;
  }
  console.log(favoriteCoinIds);
  const updatedFavoriteCoinIds = favoriteCoinIds?.filter((favoriteCoinId) => {
    return favoriteCoinId !== coinId;
  });
  console.log(updatedFavoriteCoinIds)
  localStorage.setItem(
    "favorite_coins",
    JSON.stringify(updatedFavoriteCoinIds)
  );

  return true;
};
