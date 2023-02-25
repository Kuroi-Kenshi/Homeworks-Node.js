import { Router } from 'express';

import { authRouter } from './authRouter.js';
import { courseRouter } from './courseRouter.js';
import { lessonRouter } from './lessonRouter.js';
import { userRouter } from './userRouter.js';

let rootRouter = Router();

rootRouter.use('/course', courseRouter);
rootRouter.use('/lesson', lessonRouter);
rootRouter.use('/auth', authRouter);
rootRouter.use('/user', userRouter);

export default rootRouter;