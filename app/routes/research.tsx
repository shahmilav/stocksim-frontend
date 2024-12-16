import "@mantine/core/styles.css";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  MetaFunction,
  useLoaderData,
  LoaderFunctionArgs,
} from "@remix-run/react";
import {
  AppShell,
  ColorSchemeScript,
  MantineProvider,
  createTheme,
} from "@mantine/core";
import Navbar from "app/components/Navbar";
import TradeContainer from "app/components/Trade";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { defer, redirect } from "@remix-run/node";

const theme = createTheme({
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
  fontFamilyMonospace: "SFMono Nerd Font, Menlo, monospace",
});

export const meta: MetaFunction = () => {
  return [
    { title: "Stock Research" },
    {
      name: "description",
      content: "Stock simulator app.",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";
  const response = await fetch(SERVER_URL + "/user", {
    headers: request.headers,
    credentials: "include",
  });

  let user = null;
  if (!response.ok) {
    return redirect("/");
    console.log(response);
  } else {
    user = await response.json();
  }

  const ENV = new Object();
  ENV.SERVER_URL = SERVER_URL;
  return defer({ user, ENV });
};

export default function HomeLayout() {
  // Open and close the trade dialog.
  const [opened, { open, close }] = useDisclosure(false);

  const [symbol, setSymbol] = useState<string>("");
  const [action, setAction] = useState<string>("");

  const { user } = useLoaderData();

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
          <AppShell header={{ height: 60 }} padding="md">
            <AppShell.Header>
              <Navbar user={user} open={open} />
            </AppShell.Header>

            <Outlet context={{ open, setAction, setSymbol }} />
          </AppShell>

          <TradeContainer
            opened={opened}
            close={close}
            symbol={symbol}
            setSymbol={setSymbol}
            action={action}
            setAction={setAction}
          />
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
