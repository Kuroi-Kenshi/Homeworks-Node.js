import { Group, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { TbBoxMultiple } from "react-icons/tb";
import { NavLink } from "react-router-dom";

function NavBarLink({ icon, color, label }) {
  return (
    <NavLink to="/courses">
      <UnstyledButton
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>

          <Text>{label}</Text>
        </Group>
      </UnstyledButton>
      </NavLink>
  );
}

const data = [
  { icon: <TbBoxMultiple size={16} />, color: 'blue', label: 'Курсы' },
];

export function MainLinks() {
  const links = data.map((link) => <NavBarLink {...link} key={link.label} />);
  return <div>{links}</div>;
}