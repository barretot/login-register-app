import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';

const routes = Router();

routes.post('/users/auth', SessionController.createSession);
routes.post('/users', UserController.create);

routes.use(authMiddleware);

routes.get('/test', (req, res) => {
  res.send({ test: 'ok' });
});

export { routes };
