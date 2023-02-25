import { AppShell, Burger, Button, Header, MediaQuery, Navbar, Text, useMantineTheme } from "@mantine/core";
import { useContext, useState } from "react";
import { ImHome } from "react-icons/im";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { MainLinks } from "../MainLinks";

export function Layout () {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { store } = useContext(Context);
  const navigate = useNavigate();
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          <Navbar.Section grow mt="md">
            <MainLinks />
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="xl" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Link to="/"><ImHome size={26} /></Link>
          </div>
          <Button type="button" onClick={() => {
            store.logout()
            navigate('/')
          }}>Выйти</Button>
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  )
}