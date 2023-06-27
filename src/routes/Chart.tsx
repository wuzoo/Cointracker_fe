import { useQuery } from "react-query";
import { useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "./api";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

interface CharProps {
  coinId?: string;
}

function Chart() {
  const params = useOutletContext<CharProps>();
  const coinId = params.coinId;
  // console.log(coinId);
  const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], () =>
    fetchCoinHistory(coinId as string)
  );
  console.log(data);
  const isDark = useRecoilValue(isDarkAtom);
  return (
    <div>
      {isLoading ? (
        "Loading Chart ..."
      ) : (
        <ApexChart
          type="line"
          series={[
            {
              name: "Price",
              data: data?.map((price) => price.close) ?? [],
            },
          ]}
          options={{
            theme: {
              mode: isDark ? "dark" : "light",
            },
            chart: {
              height: 500,
              width: 500,
              background: "transparent",
              toolbar: {
                show: false,
              },
            },
            yaxis: {
              show: false,
            },
            fill: {
              type: "gradient",
              gradient: {
                gradientToColors: ["blue"],
                stops: [0, 100],
              },
            },
            colors: ["red"],
            stroke: {
              curve: "smooth",
              width: 6,
            },
            xaxis: {
              axisTicks: {
                show: true,
              },
              axisBorder: { show: false },
              labels: { show: true },
              type: "datetime",
              categories: data?.map((data) =>
                new Date(parseInt(data.time_close) * 1000)
                  .toISOString()
                  .substring(0, 10)
              ),
            },
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
          }}
        />
      )}
    </div>
  );
}
export default Chart;
