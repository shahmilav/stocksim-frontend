import "@mantine/core/styles.css";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  MetaFunction,
} from "@remix-run/react";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
  fontFamilyMonospace: "SFMono Nerd Font, Menlo, monospace",
});

export const meta: MetaFunction = () => {
  return [
    { title: "Milav's Stock Simulator" },
    {
      name: "description",
      content: "Stock simulator app.",
    },
  ];
};
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          {children}
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
