import {
  Space,
  Card,
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
       +{Intl.NumberFormat("en-US", {
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
    <Card shadow="sm" radius="md" withBorder>
      <Stack spacing="sm">
        <Text size="xl" mb="-15">
          Account Value
        </Text>
        <Title
          style={{
            fontWeight: "400",
          }}
          order={2}
        >
          {value}
        </Title>

        <Space h="sm" />

        <Text size="xl" mb="-15">
          {" "}
          Cash
        </Text>

        <Title
          style={{
            fontWeight: "400",
          }}
          order={2}
        >
          {cash}
        </Title>

        <Space h="sm" />

        <Text size="xl" mb="-15">
          {" "}
          Today&apos;s Change
        </Text>
        <Title
          style={{
            fontWeight: "400",
          }}
          order={2}
        >
          {change}
        </Title>
      </Stack>
    </Card>
  );
}
