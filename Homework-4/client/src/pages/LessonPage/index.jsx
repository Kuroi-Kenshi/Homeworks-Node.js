import { Box, Button, Divider, Group, Paper, Text, Textarea, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Comments } from "../../components/Comments";
import { EditModal } from "../../components/Modal";
import $api from "../../http";
import { Context } from "../../main";

export function LessonInfo () {
  const { courseId, lessonId } = useParams();
  const { store } = useContext(Context);
  const [author, setAuthor] = useState('')
  const [edit, setEdit] = useState(false)
  const [deleteLessonDialog, setDeleteLessonDialog] = useState(false)
  const navigate = useNavigate()
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      videoLink: '',
      comments: [],
      course: courseId
    }
  });

  const onEdit = () => {
    setEdit(true);
  }

  const onDelete = () => {
    setDeleteLessonDialog(true);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const { comments, ...withoutComments } = form.values
    const response = $api.patch(`/lesson/${lessonId}`, withoutComments)
    form.setValues(response.data)
    setEdit(false)
  }

  const addComment = async (comment) => {
    const newComment = { author: store.user.id, text: comment };
    const response = await $api.patch(`/lesson/${lessonId}/addComment`, { comment: newComment });

    form.setFieldValue('comments', response.data.comments)
  }

  const deleteLesson = async (e) => {
    e.preventDefault();
    const response = await $api.delete(`/lesson/${courseId}`);
    if (response.status === 200) {
      setDeleteLessonDialog(false);
      navigate(`/course/${courseId}`)
    }
  }


  const deleteDialogContent = () => {
    return (
      <>
        <Button onClick={deleteLesson}>Да</Button>
        <Button onClick={() => setDeleteLessonDialog(false)}>Нет</Button>
      </>
    )
  }

  const editForm = (
    <form onSubmit={onSubmit}>
      <TextInput
        mt="md"
        placeholder="Название"
        label="Название урока"
        {...form.getInputProps('name')}
      />
      <TextInput
        mt="md"
        placeholder="Ссылка"
        label="Ссылка на видео c youtube"
        {...form.getInputProps('videoLink')}
        onChange={(e) => {
          if (e.target.value.includes('=')) {
            const splittedLink = e.target.value.split('=');
            const correctLink = `https://www.youtube.com/embed/${splittedLink.at(-1)}`
            form.getInputProps('videoLink').onChange(correctLink)
          } else {
            form.getInputProps('videoLink').onChange(e)
          }
        }}
      />

      <Textarea
        mt="md"
        placeholder="Описание"
        label="Описание урока"
        {...form.getInputProps('description')}
      />

      <Group position="right" mt="md">
        <Button type="submit" color="violet">Готово</Button>
      </Group>
    </form>
  )

  const getCourseData = async () => {
    const response = await $api.get(`/course/${courseId}`);
    if (response.status === 200) {
      setAuthor(response.data.author)
    }
  }

  useEffect(() => {
    if (lessonId) {
      const getLesson = async () => {
        try {
          const response = await $api.get(`/lesson/${lessonId}`)
          const { name, description, videoLink, comments } = response.data;

          if (response.status === 200) {
            form.setValues({
              name,
              description,
              videoLink,
              comments
            })
          }
        } catch (error) {
          if (error.response.status === 403) {
            navigate('/notAccessPage')
          }
        }
      }
      getCourseData()
      getLesson()
    }
  }, [])

  const { name, description, videoLink, comments } = form.values;

  return (
    <Paper p="lg">
      <Link to={`/course/${courseId}`}>
        <Button>Назад</Button>
      </Link>

      <Title mt="lg">{name}</Title>
      {(author === store.user.id || store.user.roles.includes('ADMIN')) && (
        <Group position="left" mt="lg" mb="lg">
          <Button onClick={onEdit} color="violet">Редактировать урок</Button>
          <Button onClick={onDelete} color="violet">Удалить урок</Button>
        </Group>
      )}

      {videoLink && (
        <iframe
          width="70%"
          height="600px"
          title='Youtube player'
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          src={videoLink}
        />
      )}

      <Box>
        <Title mt="md" order={3}>Описание урока</Title>
        <Text>{description}</Text>
      </Box>
      <Divider mt="xl" />

      <Title mt="md" order={4}>Комментарии</Title>
      <Comments comments={comments} addComment={addComment}/>
      <EditModal opened={edit} setOpened={setEdit} content={editForm} />
      <EditModal 
        title="Вы действительно хотите удалить этот урок?"
        opened={deleteLessonDialog} 
        setOpened={setDeleteLessonDialog} 
        content={deleteDialogContent()} 
      />
    </Paper>
  )
}