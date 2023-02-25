import { Avatar, Button, Flex, Group, Text, Textarea } from "@mantine/core"
import { useState } from "react"

export function Comments ({ addComment, comments }) {
  const [comment, setComment] = useState('')

  return (
    <div>
      <Textarea
        placeholder="Ваш комментарий"
        radius="md"
        size="md"
        mt="xl"
        onChange={(e) => setComment(e.target.value)}
      />
      <Button mt="md" color="violet" onClick={() => addComment(comment)}>Добавить</Button>
      {comments && comments.map(comment => {
        return (
          <Group key={comment.id} mt="lg" style={{
            backgroundColor: '#25262b',
            padding: '15px',
            borderRadius: '10px',
            gap: '40px'
          }}>
            <Flex direction="column" align="center">
              <Avatar radius="xl" />
              {comment.author.name}
            </Flex>
            <Text>{comment.text}</Text>
          </Group>
        )
      })}
    </div>
  )
}