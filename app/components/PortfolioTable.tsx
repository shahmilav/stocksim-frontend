import {
  Title,
  Button,
  Table,
  Card,
  useMantineTheme,
  UnstyledButton,
  Group,
  Center,
  Text,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconSelector,
  IconArrowUp,
  IconArrowDown,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface PortfolioTableProps {
  data: {
    stock_symbol: string;
    stock_name: string;
    quantity: number;
    current_price: number;
    total_value: number;
    day_change: number;
    day_change_percent: number;
    purchase_price: number;
  }[];
  openTradeModal: () => void;
  setTradeAction: (action: string) => void;
  setTradeSymbol: (symbol: string) => void;
}

interface ThProps {
  children: React.ReactNode;
  sorted: boolean;
  reversed: boolean;
  onSort: () => void;
}

function Th({ children, sorted, reversed, onSort }: ThProps) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th>
      <UnstyledButton onClick={onSort} style={{ width: "100%" }}>
        <Group position="apart">
          <Text fw={600} fz="sm">
            {children}
          </Text>
          <Center>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

export default function PortfolioTable({
  data,
  openTradeModal,
  setTradeAction,
  setTradeSymbol,
}: PortfolioTableProps) {
  const theme = useMantineTheme();
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<
    keyof PortfolioTableProps["data"][0] | null
  >(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const handleSort = (field: keyof PortfolioTableProps["data"][0]) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(
      [...data].sort((a, b) => {
        if (reversed) {
          return b[field] > a[field] ? 1 : -1;
        }
        return a[field] > b[field] ? 1 : -1;
      }),
    );
  };

  const rows = sortedData.map((datum) => (
    <Table.Tr key={datum.stock_symbol} style={{ fontSize: "1.2em" }}>
      <Table.Td style={{ fontSize: "1.5em" }}>{datum.stock_symbol}</Table.Td>
      <Table.Td>
        {datum.stock_name
          .replace("Inc", "")
          .replace("Corp", "")
          .replace("Corporation", "")}
      </Table.Td>
      <Table.Td align="right">{datum.quantity}</Table.Td>
      <Table.Td align="right">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(datum.current_price / 100)}
      </Table.Td>
      <Table.Td align="right">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(datum.purchase_price / 100)}
      </Table.Td>
      <Table.Td>
        <div style={{ float: "right", textAlign: "right" }}>
          {datum.day_change_percent === 0 ? (
            <span style={{ color: theme.colors.gray[6] }}>
              {Math.abs(datum.day_change_percent) / 100}%
              <br />
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(0)}
            </span>
          ) : datum.day_change > 0 ? (
            <span
              style={{
                color: theme.colors.green[9],
                display: "flex",
                alignItems: "center",
              }}
            >
              {Math.abs(datum.day_change_percent) / 100}% <br />
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Math.abs(datum.quantity * datum.day_change) / 100)}
              <IconArrowUp size={25} style={{ marginLeft: 5 }} />
            </span>
          ) : (
            <span
              style={{
                color: theme.colors.red[9],
                display: "flex",
                alignItems: "center",
              }}
            >
              {Math.abs(datum.day_change_percent) / 100}% <br />
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(Math.abs(datum.quantity * datum.day_change) / 100)}
              <IconArrowDown size={25} style={{ marginLeft: 5 }} />
            </span>
          )}
        </div>
      </Table.Td>
      <Table.Td align="right">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(datum.total_value / 100)}
      </Table.Td>
      <Table.Td
        style={{
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
        }}
      >
        <Button
          size="compact-sm"
          variant="transparent"
          onClick={() => {
            setTradeAction("Buy");
            setTradeSymbol(datum.stock_symbol);
            openTradeModal();
          }}
        >
          Buy
        </Button>
        <br />
        <Button
          size="compact-sm"
          variant="transparent"
          onClick={() => {
            setTradeAction("Sell");
            setTradeSymbol(datum.stock_symbol);
            openTradeModal();
          }}
        >
          Sell
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Title order={2} fw="400">
        Your Holdings
      </Title>
      <br />
      <Card shadow="sm" radius="md" withBorder>
        <Card.Section>
          <Table.ScrollContainer minWidth={500}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Th
                    sorted={sortBy === "stock_symbol"}
                    reversed={reverseSortDirection}
                    onSort={() => handleSort("stock_symbol")}
                  >
                    Symbol
                  </Th>
                  <Th
                    sorted={sortBy === "stock_name"}
                    reversed={reverseSortDirection}
                    onSort={() => handleSort("stock_name")}
                  >
                    Description
                  </Th>
                  <Th
                    sorted={sortBy === "quantity"}
                    reversed={reverseSortDirection}
                    onSort={() => handleSort("quantity")}
                  >
                    Quantity
                  </Th>
                  <Th
                    sorted={sortBy === "current_price"}
                    reversed={reverseSortDirection}
                    onSort={() => handleSort("current_price")}
                  >
                    Price
                  </Th>
                  <Th
                    sorted={sortBy === "purchase_price"}
                    reversed={reverseSortDirection}
                    onSort={() => handleSort("purchase_price")}
                  >
                    Purchase
                  </Th>
                  <Th
                    sorted={sortBy === "day_change_percent"}
                    reversed={reverseSortDirection}
                    onSort={() => handleSort("day_change_percent")}
                  >
                    Today&apos;s Change
                  </Th>
                  <Th
                    sorted={sortBy === "total_value"}
                    reversed={reverseSortDirection}
                    onSort={() => handleSort("total_value")}
                  >
                    Total Value
                  </Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>{" "}
          </Table.ScrollContainer>
        </Card.Section>
      </Card>
    </>
  );
}
