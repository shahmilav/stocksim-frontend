import {
  Space,
  Group,
  Button,
  Select,
  Autocomplete,
  Stack,
  NumberInput,
  Title,
  Progress,
} from "@mantine/core";
import { useState } from "react";
import { useRevalidator } from "@remix-run/react";

interface TradeProps {
  close: () => void;
  symbol: string;
  setSymbol: (symbol: string) => void;
  action: string;
  setAction: (action: string) => void;
}

export default function Trade({
  close,
  symbol,
  setSymbol,
  action,
  setAction,
}: TradeProps) {
  const [qty, setQty] = useState<string | number>("");
  const [progressValue, setProgressValue] = useState(0);

  const [showBar, setShowBar] = useState(false);

  const revalidator = useRevalidator();

  async function onCancel() {
    setQty("");
    setSymbol("");
    setAction("");
    close();
  }
  function onSubmit() {
    setShowBar(true);

    setTimeout(() => {
      // Send POST request to server
      fetch("http://localhost:3000/" + action.toLowerCase(), {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          stock_symbol: symbol,
          quantity: qty,
        }),
      });

      setProgressValue(100);
    }, 100);

    setTimeout(() => {
      // Reset form
      setQty("");
      setSymbol("");
      setAction("");
      setProgressValue(0);
      setShowBar(false);

      // Close modal
      close();
    }, 600);

    setTimeout(() => {
      revalidator.revalidate();
    }, 1000);
  }

  return (
    <Stack>
      <Title order={3}>Make a Trade</Title>
      <Select
        data={["Buy", "Sell"]}
        value={action}
        onChange={setAction}
        radius="md"
        label="Action"
        withAsterisk
      />
      <Autocomplete
        //        data={["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"]}
        value={symbol}
        onChange={setSymbol}
        label="Symbol"
        radius="md"
        onBlur={() => {
          if (!options.includes(value)) {
            setValue("");
          }
        }}
        withAsterisk
      />
      <NumberInput
        value={qty}
        radius="md"
        onChange={setQty}
        label="Quantity"
        withAsterisk
      />
      <Space h="md" />
      <Group justify="space-between" grow>
        <Button variant="default" radius="md" onClick={onSubmit}>
          Submit
        </Button>
        <Button variant="default" radius="md" onClick={onCancel}>
          Cancel
        </Button>
      </Group>
      {showBar && (
        <Progress
          value={progressValue}
          striped
          animated
          transitionDuration={500}
        />
      )}
    </Stack>
  );
}
