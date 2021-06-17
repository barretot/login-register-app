import { UserModel } from '../../src/app/models/User';
import { app } from '../../src/app';

import request from 'supertest';
import response from 'supertest';
import { generateToken } from '../../src/utils/generateToken';
import { formatBrazilDate } from '../../src/utils/formatDate';

describe('Criar usuário para testes.', () => {
  beforeAll(async () => {
    await UserModel.create({
      name: 'UserTest',
      email: 'test@test.com',
      password: 'testUser2021',
      phones: [{ number: 1234, ddd: 11 }],
    });
  });

  it('Logar e buscar usuário.', async () => {
    const response = await request(app).post('/users/signin').send({
      email: 'test@test.com',
      password: 'testUser2021',
    });
    const tokenRequest = generateToken({ response });

    const responseSearchUser = await request(app)
      .get('/users/search')
      .set({ Authorization: tokenRequest });

    expect(responseSearchUser.status).toBe(200);
  });
});
