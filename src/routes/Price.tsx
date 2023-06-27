import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";
import { fetchCoinPrice } from "./api";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

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
    volume_24h: number;
    volume_24h_change_24h: number;
    market_cap: number;
    market_cap_change_24h: number;
    percent_change_15m: number;
    percent_change_30m: number;
    percent_change_1h: number;
    percent_change_6h: number;
    percent_change_12h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    percent_change_30d: number;
    percent_change_1y: number;
    ath_price: number;
    ath_date: string;
    percent_from_price_ath: number;
  };
}
const CurPrice = styled.div<{ isDark: boolean }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  background-color: ${(props) => (props.isDark ? "#2f3640" : "white")};
  height: 90px;
  margin-bottom: 5px;
  border-radius: 20px;
`;
const UpdateTime = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p:nth-child(1) {
    margin-bottom: 10px;
    width: 60%;
    font-size: 18px;
    font-weight: 600;
    padding-left: 30px;
  }
`;
const CurPricevalue = styled.p<{ isDark: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  text-align: center;
  border-left: 1px groove ${(props) => (props.isDark ? "white" : "#2f3640")};
  p {
    height: 10px;
  }
`;
const CurPricevalueint = styled.p`
  font-size: 30px;
  font-weight: 400;
  height: 10px;
  text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.3);
  margin-bottom: 10px;
`;
const PriceList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 30px;
`;
const PriceByTime = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const TimeBox = styled.div<{ isDark: boolean }>`
  display: flex;
  background-color: ${(props) => (props.isDark ? "#2f3640" : "white")};
  height: 90px;
  width: 49%;
  margin: 5px 0px;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
`;
const TimeAgo = styled.p`
  font-family: "Noto Sans KR", sans-serif;
  font-size: 14px;
  width: 35%;
`;
const PricePercent = styled.p<{ isPositive: boolean }>`
  color: ${(props) => (props.isPositive ? "green" : "red")};
  font-size: 25px;
  width: 40%;
  display: flex;
  justify-content: center;
  margin-left: 10px;
  p {
    margin-left: 7px;
  }
`;

function Price() {
  const params = useOutletContext<{ coinId: string }>();
  const coinId = params.coinId;
  const isDark = useRecoilValue(isDarkAtom);

  const { isLoading, data } = useQuery<PriceStates>(["tickers", coinId], () =>
    fetchCoinPrice(coinId ? coinId : "")
  );

  function IntegerSign(percent: number): boolean {
    if (percent > 0) {
      // 0보다 크면 true
      return true;
    } else {
      return false;
    }
  }

  console.log(data);

  return (
    <div>
      {isLoading ? (
        "Loading Price..."
      ) : (
        <PriceList>
          <CurPrice isDark={isDark}>
            <UpdateTime>
              <p>Last Update</p>
              <p>{data?.last_updated.slice(0, 10)}</p>
              <p>{data?.last_updated.slice(12, 19)}</p>
            </UpdateTime>
            <CurPricevalue isDark={isDark}>
              <CurPricevalueint>
                {data?.quotes.USD.price.toFixed(2)}
              </CurPricevalueint>
              <br />
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                현재가
              </p>
            </CurPricevalue>
          </CurPrice>
          <PriceByTime>
            <TimeBox isDark={isDark}>
              <TimeAgo>30분 전보다</TimeAgo>
              <PricePercent
                isPositive={IntegerSign(
                  data?.quotes.USD.percent_change_30m ?? 0
                )}
              >
                {data?.quotes.USD.percent_change_30m}%
                <p>
                  {IntegerSign(data?.quotes.USD.percent_change_30m ?? 0) ? (
                    <FaArrowTrendUp />
                  ) : (
                    <FaArrowTrendDown />
                  )}
                </p>
              </PricePercent>
            </TimeBox>
            <TimeBox isDark={isDark}>
              <TimeAgo>1시간 전보다</TimeAgo>
              <PricePercent
                isPositive={IntegerSign(
                  data?.quotes.USD.percent_change_1h ?? 0
                )}
              >
                {data?.quotes.USD.percent_change_1h}%
                <p>
                  {IntegerSign(data?.quotes.USD.percent_change_1h ?? 0) ? (
                    <FaArrowTrendUp />
                  ) : (
                    <FaArrowTrendDown />
                  )}
                </p>
              </PricePercent>
            </TimeBox>
          </PriceByTime>
          <PriceByTime>
            <TimeBox isDark={isDark}>
              <TimeAgo>6시간 전보다</TimeAgo>
              <PricePercent
                isPositive={IntegerSign(
                  data?.quotes.USD.percent_change_6h ?? 0
                )}
              >
                {data?.quotes.USD.percent_change_6h}%
                <p>
                  {IntegerSign(data?.quotes.USD.percent_change_6h ?? 0) ? (
                    <FaArrowTrendUp />
                  ) : (
                    <FaArrowTrendDown />
                  )}
                </p>
              </PricePercent>
            </TimeBox>
            <TimeBox isDark={isDark}>
              <TimeAgo>12시간 전보다</TimeAgo>
              <PricePercent
                isPositive={IntegerSign(
                  data?.quotes.USD.percent_change_12h ?? 0
                )}
              >
                {data?.quotes.USD.percent_change_12h}%
                <p>
                  {IntegerSign(data?.quotes.USD.percent_change_12h ?? 0) ? (
                    <FaArrowTrendUp />
                  ) : (
                    <FaArrowTrendDown />
                  )}
                </p>
              </PricePercent>
            </TimeBox>
          </PriceByTime>
          <PriceByTime>
            <TimeBox isDark={isDark}>
              <TimeAgo>1일 전보다</TimeAgo>
              <PricePercent
                isPositive={IntegerSign(
                  data?.quotes.USD.percent_change_24h ?? 0
                )}
              >
                {data?.quotes.USD.percent_change_24h}%
                <p>
                  {IntegerSign(data?.quotes.USD.percent_change_24h ?? 0) ? (
                    <FaArrowTrendUp />
                  ) : (
                    <FaArrowTrendDown />
                  )}
                </p>
              </PricePercent>
            </TimeBox>
            <TimeBox isDark={isDark}>
              <TimeAgo>일주일 전보다</TimeAgo>
              <PricePercent
                isPositive={IntegerSign(
                  data?.quotes.USD.percent_change_7d ?? 0
                )}
              >
                {data?.quotes.USD.percent_change_7d}%
                <p>
                  {IntegerSign(data?.quotes.USD.percent_change_7d ?? 0) ? (
                    <FaArrowTrendUp />
                  ) : (
                    <FaArrowTrendDown />
                  )}
                </p>
              </PricePercent>
            </TimeBox>
          </PriceByTime>
        </PriceList>
      )}
    </div>
  );
}
export default Price;
