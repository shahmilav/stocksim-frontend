import { Table } from "@mantine/core";

interface TradeHistoryProps {
  data: {
    id: string;
    timestamp: string;
    stock_symbol: string;
    quantity: number;
    transaction_type: string;
    price: number;
  }[];
}
export default function TradeHistory({ data }: TradeHistoryProps) {
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
    <Table.ScrollContainer minWidth={1200}>
      <Table withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Timestamp</Table.Th>
            <Table.Th>Symbol</Table.Th>
            <Table.Th>Trade Type</Table.Th>
            <Table.Th>Quantity</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Cash Value</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
