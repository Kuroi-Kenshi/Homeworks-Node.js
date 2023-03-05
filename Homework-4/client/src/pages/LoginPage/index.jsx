import { TextInput, Button, Group, Tabs, Flex, PasswordInput, Text } from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';
import { useContext, useState } from 'react';
import { Context } from '../../main';

export function LoginPage () {
  const { store } = useContext(Context)
  const [error, setError] = useState(null);
  const form = useForm({
    initialValues: {
      username: '',
      password: ''
    },

    validate: {
      username: hasLength({ min: 2, max: 10 }, 'Name must be 2-10 characters long'),
      password: hasLength({ min: 2, max: 10 }, 'Password must be 2-10 characters long'),
    },
  });


  const onLogin = async () => {
    const { username, password } = form.values
    const response = await store.login(username, password);

    if (response.status !== 200) {
      setError(response?.data?.message)
    }
  }

  const onRegistration = async () => {
    const { username, password } = form.values
    const response = await store.registration(username, password)

    if (response.status !== 200) {
      setError(response?.data?.message)
    }
  }

  return (
    <Flex 
      gap="md"
      justify="center"
      align="center"
      wrap="wrap"
      style={{ width: '100vw', height: '100vh'}}
    >
      <Tabs defaultValue="login" variant='outline' style={{ width: '20%' }}>
        <Tabs.List>
          <Tabs.Tab value="login">Вход</Tabs.Tab>
          <Tabs.Tab value="signIn">Регистрация</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="login" pt="md">
          <form onSubmit={form.onSubmit(onLogin)}>
            <TextInput label="Name" placeholder="Name" withAsterisk {...form.getInputProps('username')} />
            <PasswordInput
              placeholder="Password"
              label="Password"
              mt="md"
              withAsterisk
              {...form.getInputProps('password')}
            />
            {error && (
              <Text color='red'>{error}</Text>
            )}
            <Group position="right" mt="md">
              <Button type="submit">Войти</Button>
            </Group>
          </form>
        </Tabs.Panel>

        <Tabs.Panel value="signIn" pt="md">
          <form onSubmit={form.onSubmit(onRegistration)}>
            <TextInput label="Name" placeholder="Name" withAsterisk {...form.getInputProps('username')} />
            <PasswordInput
              placeholder="Password"
              label="Password"
              mt="md"
              withAsterisk
              {...form.getInputProps('password')}
            />
            {error && (
              <Text color='red'>{error}</Text>
            )}
            <Group position="right" mt="md">
              <Button type="submit">Зарегистрироваться</Button>
            </Group>
          </form>
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
}