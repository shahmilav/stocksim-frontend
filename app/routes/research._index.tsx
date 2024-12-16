import { Group, AppShell, Autocomplete, Stack } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useColorScheme } from "@mantine/hooks";
import { Link } from "@remix-run/react";
export default function Research() {
  const [value, setValue] = useState("");
  return (
    <AppShell.Main>
      <Stack h="calc(100vh - 100px)">
        <Group>
          <Autocomplete data={[]} value={value} onChange={setValue} />

          {value != "" && (
            <Link to={"/research/search?tvwidgetsymbol=" + value}>Search</Link>
          )}
        </Group>
        <Screener />
      </Stack>
    </AppShell.Main>
  );
}

function Screener() {
  const container = useRef();
  const colorScheme = useColorScheme();
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "100%",
      defaultColumn: "overview",
      defaultScreen: "most_capitalized",
      market: "america",
      showToolbar: true,
      colorTheme: colorScheme,
      locale: "en",
      //  largeChartUrl: "http://stocksimulator.xyz/research/"
      largeChartUrl: "http://localhost:5173/research/search",
    });

    if (container.current) {
      container.current.innerHTML = ""; // Clear previous widget
      container.current.appendChild(script);
    }

    document
      .querySelector(".tradingview-widget-container__widget")
      ?.appendChild(script);
  }, [colorScheme]);

  return <div ref={container} className="tradingview-widget-container"></div>;
}
