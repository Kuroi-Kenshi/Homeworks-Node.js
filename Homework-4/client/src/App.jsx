import { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { CourseInfo } from "./pages/CoursePage";
import { Layout } from "./components/Layout";
import { LessonInfo } from "./pages/LessonPage";
import { Context } from "./main";
import { CoursesList } from "./pages/CoursesList";
import { LoginPage } from "./pages/LoginPage";
import { Welcome } from "./pages/Welcome";
import { observer } from 'mobx-react-lite';
import { Loader, Paper } from "@mantine/core";


function App() {
  const { store } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])
  
  if (store.isLoading) return (
    <Paper 
      shadow="xs" 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
    >
      <Loader size='xl' variant="bars" />
    </Paper>
  )

  const Wrapper = store.isAuth ? Layout : LoginPage

  return (
   <Routes>
    <Route path="/" element={<Wrapper />}> 
      <Route index element={<Welcome />} />
      <Route path="courses" element={<CoursesList />} />
      <Route path="course/:courseId" element={<CourseInfo />} />
      <Route path="course/:courseId/:lessonId" element={<LessonInfo />} />
      <Route path="/notAccessPage" element={<div>У вас нет доступа к этому курсу</div>} />
      <Route path="*" element={<div>Page not found</div>} />
    </Route>
   </Routes>
  );
}

export default observer(App)