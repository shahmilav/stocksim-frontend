import { redirect, json } from "@remix-run/node";
import { LoaderFunctionArgs, useLoaderData } from "@remix-run/react";
import { Stack, Group, Space, Title, Button, Text } from "@mantine/core";
import { IconBrandGoogleFilled } from "@tabler/icons-react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";
  const response = await fetch(SERVER_URL + "/user", {
    headers: request.headers,
    credentials: "include",
  });

  if (response.ok) {
    return redirect("/home");
  }

  return json({ ENV: { SERVER_URL } });
};

export default function Index() {
  const ENV = useLoaderData().ENV;
  return (
    <Stack p={20} justify="center">
      <Group justify="center">
        <Stack style={{ textAlign: "center" }} justify="center">
          <Title fw={500} order={1} size="4.5em">
            Stock Trading,{" "}
            <span style={{ color: "#3861f6" }}>
              <em>Risk-Free</em>
            </span>
          </Title>
          <Title order={2} fw={400} size="2em">
            Practice investing with virtual fake money using our stock market
            simulator
          </Title>
        </Stack>
      </Group>
      <Space h={20} />
      <Group justify="center">
        <Button
          leftSection={<IconBrandGoogleFilled />}
          component="a"
          variant="default"
          radius="lg"
          size="md"
          href={`${ENV.SERVER_URL}/login`}
        >
          Continue with Google
        </Button>
      </Group>
      <Group justify="center">
        <Text align="center" color="red.6">
          <strong>Disclaimer: This site is in beta.</strong> <br />
          You may lose your data at any time.
        </Text>
      </Group>
    </Stack>
  );
}
