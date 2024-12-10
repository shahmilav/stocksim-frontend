import {
  Space,
  Tooltip,
  Title,
  Text,
  Stack,
  useMantineTheme,
} from "@mantine/core";
export default function AccountData({ data }: unknown) {
  const theme = useMantineTheme();
  const value = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(data.value / 100);

  const cash = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(data.cash / 100);

  const change =
    data.change > 0 ? (
      <span
        style={{
          color: theme.colors.green[9],
          display: "flex",
          alignItems: "center",
        }}
      >
        +
        {Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.change / 100)}
      </span>
    ) : (
      <span
        style={{
          color: theme.colors.red[9],
          display: "flex",
          alignItems: "center",
        }}
      >
        {Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(data.change / 100)}
      </span>
    );

  return (
    <Tooltip.Group openDelay={500} closeDelay={100}>
      <Stack spacing="sm">
        <Tooltip
          withArrow
          arrowPosition="side"
          inline
          label="Total value of your cash and investments combined."
        >
          <Text size="xl" mb="-15">
            Account Value
          </Text>
        </Tooltip>
        <Title
          style={{
            fontWeight: "400",
          }}
          order={1}
        >
          {value}
        </Title>

        <Space visibleFrom="sm" h="sm" />

        <Tooltip
          withArrow
          arrowPosition="side"
          inline
          label="Uninvested money available to use."
        >
          <Text size="xl" mb="-15">
            {" "}
            Cash
          </Text>
        </Tooltip>
        <Title
          style={{
            fontWeight: "400",
          }}
          order={1}
        >
          {cash}
        </Title>

        <Space visibleFrom="sm" h="sm" />

        <Tooltip
          withArrow
          inline
          label="Net gain or loss in account value today."
        >
          <Text size="xl" mb="-15">
            {" "}
            Today&apos;s Change
          </Text>
        </Tooltip>
        <Title
          style={{
            fontWeight: "400",
          }}
          order={1}
        >
          {change}
        </Title>
      </Stack>
    </Tooltip.Group>
  );
}
