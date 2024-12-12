import {
  Title,
  Space,
  Card,
  AppShell,
  Group,
  Button,
  Drawer,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Await, useLoaderData } from "@remix-run/react";
import Navbar from "app/components/Navbar";
import PortfolioTable from "app/components/PortfolioTable";
import TradeHistory from "app/components/TradeHistory";
import AccountData from "app/components/AccountData";
import TradeContainer from "app/components/Trade";
import { Suspense, useState } from "react";
import { defer, redirect } from "@remix-run/node";

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

  const portfolio = fetch(SERVER_URL + "/portfolio", {
    credentials: "include",
    headers: request.headers,
  }).then((res) => res.json());

  const account = fetch(SERVER_URL + "/account", {
    credentials: "include",
    headers: request.headers,
  }).then((res) => res.json());

  const transactions = fetch(SERVER_URL + "/transactions", {
    credentials: "include",
    headers: request.headers,
  }).then((res) => res.json());

  const ENV = new Object();
  ENV.SERVER_URL = SERVER_URL;
  return defer({ portfolio, account, transactions, user,ENV });
};
export default function Home() {
  // Open and close the trade dialog.
  const [opened, { open, close }] = useDisclosure(false);

  // Open and close the trade history drawer.
  const [drawerOpened, setDrawerOpened] = useState(false);

  const { account, portfolio, transactions, user } =
    useLoaderData<typeof loader>();

  const [symbol, setSymbol] = useState<string>("");
  const [action, setAction] = useState<string>("");

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: { mobile: true },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Navbar user={user} open={open} />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={account}>
            {(account) => <AccountData data={account} />}
          </Await>
        </Suspense>
      </AppShell.Navbar>

      <AppShell.Main>
        <Card withBorder radius="md" shadow="md" hiddenFrom="sm">
          <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={account}>
              {(account) => <AccountData data={account} />}
            </Await>
          </Suspense>
        </Card>
        <Space hiddenFrom="sm" h="lg" />
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={portfolio}>
            {(portfolio) => (
              <PortfolioTable
                data={portfolio.holdings}
                openTradeModal={open}
                setTradeAction={setAction}
                setTradeSymbol={setSymbol}
              />
            )}
          </Await>
        </Suspense>

        <TradeContainer
          opened={opened}
          close={close}
          symbol={symbol}
          setSymbol={setSymbol}
          action={action}
          setAction={setAction}
        />

        <Group justify="flex-end">
          <Suspense fallback={<div>Loading...</div>}>
            <Button
              onClick={() => setDrawerOpened(true)}
              variant="filled"
              color="#3861f6"
              mt={20}
              size="compact-md"
              style={{ fontWeight: 500 }}
              radius="lg"
            >
              Trade History
            </Button>
            <Drawer
              position="bottom"
              opened={drawerOpened}
              offset={8}
              radius="md"
              withCloseButton={false}
              onClose={() => setDrawerOpened(false)}
            >
              <Title mb={15} order={2} fw="400">
                Trade History
              </Title>
              <Await resolve={transactions}>
                {(transactions) => <TradeHistory data={transactions} />}
              </Await>
            </Drawer>
          </Suspense>
        </Group>
      </AppShell.Main>
    </AppShell>
  );
}
