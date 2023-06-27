import axios from "axios";
export async function fetchCoins() {
  const response = await axios
    .get("https://api.coinpaprika.com/v1/coins")
    .then((res) => res.data);
  return response;
}

export async function fetchCoinInfo(coinId: string) {
  return await axios
    .get(`https://api.coinpaprika.com/v1/coins/${coinId}`)
    .then((res) => res.data);
}
export async function fetchCoinPrice(coinId: string) {
  return await axios
    .get(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
    .then((res) => res.data);
}
export async function fetchCoinHistory(coinId: string) {
  const endDate = Math.floor(Date.now() / 1000);
  const startDate = endDate - 60 * 60 * 23 * 7 * 1;
  return await axios
    .get(
      `
  https://ohlcv-api.nomadcoders.workers.dev/?coinId=${coinId}`
    )
    .then((res) => res.data);
}
