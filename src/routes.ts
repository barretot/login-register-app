import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';

const routes = Router();

routes.post('/users/signup', UserController.create);
routes.post('/users/signin', SessionController.createSession);

routes.get('/users/search', authMiddleware, UserController.index);
routes.get('/users/search/:id', authMiddleware, UserController.search);

routes.delete('/users/delete/:id', authMiddleware, UserController.delete);

export { routes };
