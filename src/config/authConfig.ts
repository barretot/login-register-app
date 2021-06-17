import { v4 as uuid_v4 } from 'uuid';

export default {
  secret: uuid_v4(),
  expiresIn: '30m',
};
