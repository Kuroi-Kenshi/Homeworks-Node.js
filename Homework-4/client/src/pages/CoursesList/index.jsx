import { Button, Card, Group, Image, SimpleGrid, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EditModal } from "../../components/Modal";
import $api from "../../http";
import { Context } from "../../main";


export function CoursesList () {
  const [editModal, setEditModal] = useState(false)
  const [courses, setCourses] = useState([])
  const { store } = useContext(Context);

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      imageLink: ''
    },
  });

  
  const getCourse = async () => {
    const courses = await $api.get('/course')
    setCourses(courses.data)
  }


  const onEdit = () => {
    setEditModal(true);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const response = await $api.post('/course', {...form.values, author: store.user.id })

    if (response.status === 200) {
      getCourse();
      setEditModal(false);
    }
  }

  const editForm = (
    <form onSubmit={onSubmit}>
      <TextInput
        mt="md"
        placeholder="Название"
        label="Название курса"
        {...form.getInputProps('name')}
      />

      <TextInput
        mt="md"
        placeholder="Ссылка"
        label="Ссылка на картинку"
        {...form.getInputProps('imageLink')}
      />

      <Textarea
        mt="md"
        placeholder="Описание"
        label="Описание курса"
        {...form.getInputProps('description')}
      />

      <Group position="right" mt="md">
        <Button type="submit" color="violet">Готово</Button>
      </Group>
    </form>
  )

  useEffect(() => {
    getCourse()
  }, [])

  const list = courses.map((course, idx) => {
    return (
      <Link key={course._id} to={`/course/${course._id}`}>
        <Card
          shadow="sm" 
          p="lg" 
          radius="md" 
          style={{ height: '100%' }}
          withBorder
        >
          <Card.Section>
            <Image
              src={course.imageLink}
              height={160}
              alt="Norway"
            />
          </Card.Section>

          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>{course.name}</Text>
          </Group>

          <Text size="sm" color="dimmed">
            {course.description}
          </Text>
        </Card>
      </Link>
    )
  })

  return (
    <>
      <Group position="left" mb="lg">
        <Button color="violet" onClick={onEdit}>Добавить новый курс</Button>
      </Group>
      <SimpleGrid cols={4}>
      {
        list
      }
      </SimpleGrid>
      <EditModal opened={editModal} setOpened={setEditModal} content={editForm} />
    </>
  )
}