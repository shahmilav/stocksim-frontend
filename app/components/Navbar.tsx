import {
  Title,
  Space,
  Popover,
  Burger,
  Avatar,
  Text,
  Group,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "@remix-run/react";

interface NavbarProps {
  user: { name: string };
  open: () => void;
}
export default function Navbar({ user, open }: NavbarProps) {
  return (
    <Group m={10} grow>
      <Group justify="flex-start">
        <Popover shadow="md" position="bottom" withArrow>
          <Popover.Target>
            <Avatar name={user.name} color="initials"></Avatar>
          </Popover.Target>
          <Popover.Dropdown>
            <Link to="http://localhost:3000/logout">Sign out</Link>
          </Popover.Dropdown>
        </Popover>
        <Title visibleFrom="sm" order={2} fw={500}>
          Milav&apos;s Stock Simulator
        </Title>
      </Group>
      <Group justify="flex-end">
        <Space w={20} />
        <Text visibleFrom="sm" order={1} fw="400">
          Welcome, {user.name.split(" ")[0]}
        </Text>
        <Button
          radius="lg"
          style={{ fontWeight: 500 }}
          size="compact-lg"
          variant="filled"
          color="#3861f6"
          onClick={open}
        >
          Trade
        </Button>
      </Group>
    </Group>
  );
}
