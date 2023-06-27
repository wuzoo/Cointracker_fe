import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLocation, Outlet } from "react-router-dom";
import { BrowserRouter, Routes, Route, Link, useMatch } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinPrice } from "./api";
import { Helmet } from "react-helmet";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;
const Container = styled.div`
  padding: 0px 20px;
  max-width: 600px;
  margin: 0 auto;
`;
const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Loader = styled.span`
  text-align: center;
  display: block;
`;

interface InfoStates {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  contract: string;
  platform: string;
  logo: string;
  description: string;
  message: string;
  open_source: boolean;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}
interface PriceStates {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: IQuotes;
}
interface IQuotes {
  USD: {
    price: number;
  };
}
const Overview = styled.div<{ isDark: boolean }>`
  background-color: ${(props) => (props.isDark ? "#2f3640" : "white")};
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;
const Tabs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 20px 0px;
`;
const Tab = styled.div<{ match: boolean; isDark: boolean }>`
  background-color: ${(props) => (props.isDark ? "#2f3640" : "white")};
  margin: 0px 10px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 20px;
  a {
    display: block;
    width: 100%;
  }
  color: ${(props) =>
    props.match ? props.theme.accentColor : props.theme.textColor};
`;
const BackButon = styled.div`
  position: absolute;
  left: 120px;
  top: 25px;
  font-size: 30px;
  border: none;
  &:hover {
    cursor: pointer;
  }
`;

function Coin() {
  // const [loading, setLoading] = useState(true);
  const { state } = useLocation();
  const { coinId } = useParams();
  const isDark = useRecoilValue(isDarkAtom);
  const chartMatch = useMatch("/:coinId/chart");
  const priceMatch = useMatch("/:coinId/price");

  // console.log(state);

  const { isLoading: infoLoading, data: infoData } = useQuery<InfoStates>(
    ["info", coinId],
    () => fetchCoinInfo(coinId ? coinId : "")
  );
  const { isLoading: tickersLoading, data: tickersData } =
    useQuery<PriceStates>(["tickers", coinId], () =>
      fetchCoinPrice(coinId ? coinId : "")
    );

  console.log(tickersData);

  // const [info, setInfo] = useState<InfoStates>();
  // const [priceInfo, setPriceInfo] = useState<PriceStates>();

  // useEffect(() => {
  //   (async () => {
  //     const infoData = await (
  //       await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
  //     ).json();
  //     const priceData = await (
  //       await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
  //     ).json();
  //     setInfo(infoData);
  //     setPriceInfo(priceData);
  //     setLoading(false);
  //   })();
  // });
  const loading = infoLoading || tickersLoading;
  return (
    <Container>
      <BackButon>
        <Link to={"/"}>
          <AiOutlineArrowLeft />
        </Link>
      </BackButon>
      <Helmet title={coinId}>
        <link
          rel="icon"
          type="image/png"
          href={`https://coinicons-api.vercel.app/api/icon/${state?.symbol}`}
          sizes="16*16"
        />
      </Helmet>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "Loading ..." : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading</Loader>
      ) : (
        <>
          <Overview isDark={isDark}>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>{tickersData?.quotes.USD.price.toFixed(2)}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview isDark={isDark}>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab match={chartMatch !== null} isDark={isDark}>
              <Link to={`/${coinId}/chart`}>CHART</Link>
            </Tab>
            <Tab match={priceMatch !== null} isDark={isDark}>
              <Link to={`/${coinId}/price`}>PRICE</Link>
            </Tab>
          </Tabs>
          <Outlet
            context={{
              coinId: coinId,
            }}
          />
        </>
      )}
    </Container>
  );
}
export default Coin;
