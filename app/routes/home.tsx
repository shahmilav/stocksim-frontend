import {
  Table,
  Title,
  Text,
  AppShell,
  Group,
  Burger,
  Modal,
  Button,
  Drawer,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import PortfolioTable from "app/components/PortfolioTable";
import AccountData from "app/components/AccountData";
import Trade from "app/components/Trade";
import { Suspense, useState } from "react";
import { Await, useLoaderData } from "@remix-run/react";
import { redirect, data} from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
 
  const response = await fetch("http://localhost:3000/user", {
    headers: request.headers,
    credentials: "include",
  });


  let user = null;
  if (!response.ok) {
    return redirect("/");
    console.log(response)
  } else {
    user = await response.json();
  }

 const portfolio = fetch("http://localhost:3000/portfolio", {
    credentials: "include",
    headers: request.headers,
  }).then((res) => res.json());

  const account = fetch("http://localhost:3000/account", {
    credentials: "include",
    headers: request.headers,
  }).then((res) => res.json());

  const transactions = fetch("http://localhost:3000/transactions", {
    credentials: "include",
    headers: request.headers,
  }).then((res) => res.json());

  return data({ portfolio, account, transactions, user });
};

interface TransactionHistoryProps {
  data: {
    id: string;
    timestamp: string;
    stock_symbol: string;
    quantity: number;
    transaction_type: string;
    price: number;
  }[];
}
function TransactionHistory({ data }: TransactionHistoryProps) {
  const formatDate = (utcString) => {
    const utcDate = new Date(utcString + "Z");

    const options = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    return utcDate.toLocaleString("en-US", options);
  };

  const rows = data.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{formatDate(element.timestamp)}</Table.Td>
      <Table.Td>{element.stock_symbol}</Table.Td>
      <Table.Td>{element.transaction_type}</Table.Td>
      <Table.Td>{element.quantity}</Table.Td>
      <Table.Td>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(element.price / 100)}
      </Table.Td>
      <Table.Td>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format((element.quantity * element.price) / 100)}
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Table withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Timestamp</Table.Th>
          <Table.Th>Symbol</Table.Th>
          <Table.Th>Trade Type</Table.Th>
          <Table.Th>Quantity</Table.Th>
          <Table.Th>Purchase Price</Table.Th>
          <Table.Th>Cash Value</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}

export default function Home() {
  const [openedBurger, { toggle }] = useDisclosure();
  const [opened, { open, close }] = useDisclosure(false);

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
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Burger
          opened={openedBurger}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
        />

        <Group m={10}>
          <Button radius="md" variant="default" onClick={open}>
            Trade
          </Button>
          <Text order={1} fw="400">
            Welcome, {user.name}
          </Text>

          <a href="http://localhost:3000/logout">Logout</a>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={account}>
            {(account) => <AccountData data={account} />}
          </Await>
        </Suspense>
      </AppShell.Navbar>

      <AppShell.Main>
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

        <Modal
          opened={opened}
          radius="md"
          onClose={close}
          withCloseButton={false}
        >
          <Trade
            close={close}
            symbol={symbol}
            setSymbol={setSymbol}
            action={action}
            setAction={setAction}
          />
        </Modal>

        <Suspense fallback={<div>Loading...</div>}>
          <Button
            onClick={() => setDrawerOpened(true)}
            variant="default"
            mt={20}
            radius="md"
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
              {(transactions) => <TransactionHistory data={transactions} />}
            </Await>
          </Drawer>
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
}
