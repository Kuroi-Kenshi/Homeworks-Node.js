import { Button, Divider, Group, MultiSelect, Paper, Table, Text, Textarea, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EditModal } from "../../components/Modal";
import $api from "../../http";
import { Context } from "../../main";

export function CourseInfo() {
  const [courseLessons, setCourseLessons] = useState([]);
  const { courseId } = useParams()
  const [lessonModal, setLessonModal] = useState(false)
  const [courseModal, setCourseModal] = useState(false)
  const [deleteCourseDialog, setDeleteCourseDialog] = useState(false)
  const [users, setUsers] = useState([])
  const { store } = useContext(Context);
  const navigate = useNavigate()
  const lessonForm = useForm({
    initialValues: {
      name: '',
      description: '',
      videoLink: '',
      course: courseId
    },
  });

  const courseForm = useForm({
    initialValues: {
      author: '',
      name: '',
      description: '',
      imageLink: '',
      students: []
    },
  });

  const addLesson = () => {
    setLessonModal(true);
  }

  const onEdit = () => {
    setCourseModal(true);
  }

  const onDelete = () => {
    setDeleteCourseDialog(true)
  }

  const getCourseData = async () => {
    const response = await $api.get(`/course/${courseId}`);
    if (response.status === 200) {
      const { author, description, imageLink, name, lessons } = response.data
      courseForm.setValues({
        author,
        description, 
        imageLink, 
        name 
      })

      setCourseLessons(lessons)
    }
  }

  const onSubmitLesson = async (e) => {
    e.preventDefault();
    const response = await $api.post('/lesson', lessonForm.values)

    if (response.status === 200) {
      getCourseData()
      setLessonModal(false);
    }
  }

  const onSubmitCourse = async (e) => {
    e.preventDefault();
    const response = await $api.patch(`/course/${courseId}`, courseForm.values);

    if (response.status === 200) {
      getCourseData()
      setCourseModal(false);
    }
  }

  const deleteCourse = async (e) => {
    e.preventDefault();
    const response = await $api.delete(`/course/${courseId}`);

    if (response.status === 200) {
      setDeleteCourseDialog(false)
      navigate('/courses')
    }
  }

  const deleteDialogContent = () => {
    return (
      <>
        <Button onClick={deleteCourse}>Да</Button>
        <Button onClick={() => setDeleteCourseDialog(false)}>Нет</Button>
      </>
    )
  }
  const getForm = (type) => {
    const form = type === 'lesson' ? lessonForm : courseForm;
    const onConfirm = type === 'lesson' ? onSubmitLesson : onSubmitCourse;
    return (
      <form onSubmit={onConfirm}>
        <TextInput
          mt="md"
          placeholder="Название"
          label="Название"
          {...form.getInputProps('name')}
        />

        <Textarea
          mt="md"
          placeholder="Описание"
          label="Описание"
          {...form.getInputProps('description')}
        />
        {type !== 'lesson' && (
          <MultiSelect
            mt="lg"
            data={users.map(user => ({ value: user.username, label: user.username }))}
            label="Разрешить доступ к курсу для пользователей"
            placeholder="Пользователь"
            nothingFound="Никого не найдено"
            transitionDuration={150}
            transition="pop-top-left"
            transitionTimingFunction="ease"
            searchable
            maxDropdownHeight={160}
            limit={20}
            onChange={(value) => {
              courseForm.setFieldValue('students', value)
            }}
          />
        )}

        <Group position="right" mt="md">
          <Button type="submit" color="violet">Готово</Button>
        </Group>
      </form>
    )
  }

  const getLessonName = (lesson) => {
    if (store.user.courses.includes(courseId) || store.user.roles.includes('ADMIN')) {
      return (
        <Link to={`/course/${courseId}/${lesson._id}`} >
          {lesson.name}
        </Link>
      )
    }

    return <Text>{lesson.name}</Text>;
  }

  const rows = courseLessons.length > 0 && courseLessons.map((element) => {
    return (
      <tr key={element._id}>
        <td>{getLessonName(element)}</td>
        <td>{element.description}</td>
        <td>{element.duration}</td>
      </tr>
    )
  });

  useEffect(() => {
    if (courseId) {
      getCourseData()
    }
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const response = await $api.get(`/user`)
      if (response.status === 200) {
        setUsers(response.data.users);
      }
    }

    getUser()
  }, [])

  return (
    <Paper shadow="xs" p="md">
      <Link to='/courses'>
        <Button>Назад</Button>
      </Link>

      <Title mt="lg">
        {`Страница курса ${courseForm.values.name}`}
      </Title>

      <Divider my="sm" variant="dashed" />

      {!rows.length ? (
        <Text>Ни одного урока еще не добавлено</Text>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Описание</th>
              <th>Длительность</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      )}
      {(store.user.roles.includes('ADMIN') || courseForm.values.author === store.user.id) && (
        <Group position="left" mt="lg">
          <Button color="violet" onClick={addLesson}>Добавить новый урок</Button>
          <Button color="violet" onClick={onEdit}>Редактировать курс</Button>
          <Button color="violet" onClick={onDelete}>Удалить курс</Button>
        </Group>
      )}

      <EditModal 
        title="Добавление урока" 
        opened={lessonModal} 
        setOpened={setLessonModal} 
        content={getForm('lesson')} 
      />
      <EditModal 
        title="Редактирование курса" 
        opened={courseModal} 
        setOpened={setCourseModal} 
        content={getForm()} 
      />
      <EditModal 
        title="Вы действительно хотите удалить этот курс?"
        opened={deleteCourseDialog} 
        setOpened={setDeleteCourseDialog} 
        content={deleteDialogContent()} 
      />
    </Paper>
  )
}