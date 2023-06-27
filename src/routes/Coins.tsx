import styled from "styled-components";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCoins } from "./api";
import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";

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
const CoinsList = styled.ul`
  margin-top: 40px;
`;
const Coin = styled.li<{ isDark: boolean }>`
  background-color: ${(props) => (props.isDark ? "#2f3640" : "white")};
  color: ${(props) => props.theme.textColor};
  margin-bottom: 20px;
  border-radius: 15px;
  transition: all 0.2s ease-in-out;
  a {
    display: flex;
    align-items: center;
    transition: color 0.2s ease-in;
    display: block;
    padding: 20px;
  }
  &:hover {
    transform: scale(1.12);
    box-shadow: 0px 0px 5px ${(props) => props.theme.accentColor};
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;
const Title = styled.h1`
  font-size: 60px;
  margin-top: 10px;
  color: ${(props) => props.theme.accentColor};
`;
const Loader = styled.span`
  text-align: center;
  display: block;
`;
const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
`;

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  const { isLoading, data } = useQuery<ICoin[]>(["allCoins"], fetchCoins, {
    select: (data) => data.slice(0, 10),
  });
  const isDark = useRecoilValue(isDarkAtom);

  // const [coins, setCoins] = useState<ICoin[]>([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   getCoins();
  // }, []);
  // const getCoins = async () => {
  //   const json = await (
  //     await fetch("https://api.coinpaprika.com/v1/coins")
  //   ).json();
  //   setCoins(json.slice(0, 10));
  //   setLoading(false);
  // };
  return (
    <Container>
      <Helmet>
        <title>코인</title>
      </Helmet>
      <Header>
        <Title>Coins</Title>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {data?.slice(0, 100).map((coin) => (
            <Coin isDark={isDark} key={coin.id}>
              <Link
                to={`/${coin.id}`}
                state={{
                  name: coin?.name,
                  symbol: coin?.symbol.toLowerCase(),
                }}
              >
                <Img
                  src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                ></Img>
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}
export default Coins;
