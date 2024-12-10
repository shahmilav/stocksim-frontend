import { useEffect, useRef } from "react";
import { useColorScheme } from "@mantine/hooks";

interface Props {
  symbol: string;
}

// TVChart component is used to display a TradingView chart for a given symbol.
export default function TVChart({ symbol }: Props) {
  const container = useRef();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;

    const settings = {
      symbols: [[`${symbol}|1D`]],
      chartOnly: false,
      width: "100%",
      height: "100%",
      locale: "en",
      colorTheme: colorScheme,
      autosize: true,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: true,
      hideSymbolLogo: false,
      scalePosition: "right",
      scaleMode: "Normal",
      fontFamily:
        "system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      maLineColor: "rgb(41,98,255)",
      maLineWidth: 1,
      maLength: 9,
      lineWidth: 2,
      backgroundColor: colorScheme === "light" ? "#ffffff" : "rgb(36, 36, 36)",
      lineType: 0,
      dateRanges: [
        "1d|1",
        "5d|5",
        "1m|30",
        "3m|60",
        "6m|1D",
        "12m|1D",
        "60m|1W",
        "all|1M",
      ],
    };

    script.innerHTML = JSON.stringify(settings);

    if (container.current) {
      container.current.innerHTML = ""; // Clear previous widget
      container.current.appendChild(script);
    }
  }, [symbol, colorScheme]);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow noreferrer"
          target="_blank"
        >
          <span className="blue-text">Track all markets</span>
        </a>{" "}
        on TradingView
      </div>
    </div>
  );
}
