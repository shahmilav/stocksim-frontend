import {
  Space,
  Drawer,
  Modal,
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
import { useLoaderData, useRevalidator } from "@remix-run/react";
import TVChart from "app/components/TradingViewChart";

interface TradeProps {
  close: () => void;
  symbol: string;
  setSymbol: (symbol: string) => void;
  action: string;
  setAction: (action: string) => void;
}

interface TradeContainerProps {
  opened: boolean;
  close: () => void;
  symbol: string;
  setSymbol: (symbol: string) => void;
  action: string;
  setAction: (action: string) => void;
}

export default function TradeContainer({
  opened,
  close,
  symbol,
  setSymbol,
  action,
  setAction,
}: TradeContainerProps) {
  return (
    <>
      <Modal
        visibleFrom="sm"
        opened={opened}
        onClose={close}
        radius="md"
        size="55rem"
        withCloseButton={false}
      >
        <TradeView
          close={close}
          symbol={symbol}
          setSymbol={setSymbol}
          action={action}
          setAction={setAction}
        />
      </Modal>
      <Drawer
        size="100%"
        opened={opened}
        onClose={close}
        position="bottom"
        withCloseButton={false}
        hiddenFrom="sm"
      >
        <TradeView
          close={close}
          symbol={symbol}
          setSymbol={setSymbol}
          action={action}
          setAction={setAction}
        />
      </Drawer>
    </>
  );
}

function TradeView({
  close,
  symbol,
  setSymbol,
  action,
  setAction,
}: TradeProps) {
  const [qty, setQty] = useState<string | number>("");
  const env = useLoaderData().ENV;

  const [progressValue, setProgressValue] = useState(0);

  const [err, setErr] = useState("");
  const [showBar, setShowBar] = useState(false);

  const [loading, setLoading] = useState(false); // New state

  const revalidator = useRevalidator();

  async function onCancel() {
    setQty("");
    setSymbol("");
    setAction("");
    close();
  }

  async function onSubmit() {
    if (loading) return; // Prevent multiple calls
    setLoading(true); // Disable button
    let checker = false;

    // Send POST request to server
    const response = await fetch(env.SERVER_URL + "/" + action.toLowerCase(), {
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

    try {
      if (response.ok) {
        console.log("Trade successful!");
        checker = true;
      } else {
        const text = await response.text();
        console.error(text.replace(/"/g, ""));
        setErr(text.replace(/"/g, ""));
      }
    } catch (error) {
      console.error("Error:", error);
    }

    if (!checker) {
      setLoading(false); // Re-enable button if the call failed
      return;
    }

    setShowBar(true);
    setProgressValue(100);

    setTimeout(() => {
      // Reset form
      setQty("");
      setSymbol("");
      setAction("");
      setProgressValue(0);
      setShowBar(false);
      setErr("");

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
      {symbol !== "" ? (
        <Stack h="250px">
          <TVChart symbol={symbol.split(" ")[0]} />
        </Stack>
      ) : null}

      {err && <div style={{ color: "red" }}>{err}</div>}
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
        min={0}
        allowDecimal={false}
        thousandSeparator=","
        withAsterisk
      />
      <Space h="md" />
      <Group>
        <Button
          style={{ fontWeight: 500 }}
          size="compact-lg"
          color="green"
          variant="filled"
          radius="lg"
          disabled={loading || symbol == "" || qty == 0 || action == ""} // Disable button when loading or when input is invalid.
          onClick={onSubmit}
        >
          Submit
        </Button>
        <Button
          style={{ fontWeight: 500 }}
          size="compact-lg"
          color="red"
          variant="filled"
          radius="lg"
          onClick={onCancel}
        >
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
