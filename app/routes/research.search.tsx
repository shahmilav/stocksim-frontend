import {
  Stack,
  Group,
  Button,
  Autocomplete,
  Flex,
  AppShell,
  Box,
} from "@mantine/core";
import { useSearchParams, useOutletContext, Link } from "@remix-run/react";
import { useColorScheme } from "@mantine/hooks";
import { useState, useRef, useEffect } from "react";
export const meta: MetaFunction = ({ location }) => {
  const searchQuery = new URLSearchParams(location.search)
    .get("tvwidgetsymbol")
    .replace("NASDAQ:", "")
    .replace("NYSE:", "")
    .replace("AMEX:", "");
  return [{ title: `Research for ${searchQuery}` }];
};

interface TVProps {
  symbol: string;
}

export default function Data() {
  const [searchParams] = useSearchParams();
  const tvWidgetSymbol = searchParams
    .get("tvwidgetsymbol")
    .replace("NASDAQ:", "")
    .replace("NYSE:", "")
    .replace("AMEX:", "");

  const { open, setSymbol } = useOutletContext();
  const [value, setValue] = useState("");

  return (
    <AppShell.Main>
      <Flex align="center" justify="center">
        <Stack w={"80%"}>
          <Group>
            <Link to={"/research"}>Back</Link>
            <Autocomplete
              placeholder="Search a stock"
              data={[]}
              value={value}
              onChange={setValue}
            />

            {value != "" && (
              <Link to={"/research/search?tvwidgetsymbol=" + value}>
                Search
              </Link>
            )}
            <Button
              onClick={() => {
                setSymbol(tvWidgetSymbol);
                open();
              }}
              color="green"
              size="compact-sm"
              radius="xl"
            >
              Trade {tvWidgetSymbol}
            </Button>
          </Group>

          <Stack h="calc(100vh - 100px)">
            <Overview symbol={tvWidgetSymbol} />
            <SuperChart symbol={tvWidgetSymbol} />
          </Stack>

          <Box h={500}>
            <Financials symbol={tvWidgetSymbol} />
          </Box>
          <Box h={300}>
            <Profile symbol={tvWidgetSymbol} />
          </Box>
        </Stack>
      </Flex>
    </AppShell.Main>
  );
}
function Overview({ symbol }: TVProps) {
  const container = useRef();
  const colorScheme = useColorScheme();
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: "100%",
      locale: "en",
      colorTheme: colorScheme,
      largeChartUrl: "http://localhost:5173/research/search",
      isTransparent: false,
    });
    if (container.current) {
      container.current.innerHTML = ""; // Clear previous widget
      container.current.appendChild(script);
    }
  }, [symbol, colorScheme]);

  return (
    <div ref={container} className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}
function Financials({ symbol }: TVProps) {
  const container = useRef();
  const colorScheme = useColorScheme();
  useEffect(() => {
    // Dynamically inject the TradingView widget script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-financials.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      isTransparent: false,
      largeChartUrl: "",
      displayMode: "compact",
      width: "100%",
      height: "100%",
      colorTheme: colorScheme,
      symbol: symbol,
      locale: "en",

      largeChartUrl: "http://localhost:5173/research/search",
    });
    if (container.current) {
      container.current.innerHTML = ""; // Clear previous widget
      container.current.appendChild(script);
    }
  }, [symbol, colorScheme]);

  return (
    <div ref={container} className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}
function SuperChart({ symbol }: TVProps) {
  const container = useRef();
  const colorScheme = useColorScheme();
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: colorScheme,
      style: "1",
      locale: "en",
      hide_top_toolbar: true,
      allow_symbol_change: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });

    if (container.current) {
      container.current.innerHTML = ""; // Clear previous widget
      container.current.appendChild(script);
    }
  }, [symbol, colorScheme]);

  return (
    <div
      ref={container}
      className="tradingview-widget-container"
      style={{ height: "100%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      ></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

function Profile({ symbol }: TVProps) {
  const container = useRef();
  const colorScheme = useColorScheme();
  useEffect(() => {
    // Dynamically inject the TradingView widget script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "100%",
      isTransparent: false,
      colorTheme: colorScheme,
      symbol: symbol,
      locale: "en",
      largeChartUrl: "http://localhost:5173/research/search",
    });

    if (container.current) {
      container.current.innerHTML = ""; // Clear any previous content
      container.current.appendChild(script);
    }
  }, [symbol, colorScheme]); // Empty dependency array ensures this runs once on mount

  return (
    <div ref={container} className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright"></div>
    </div>
  );
}
