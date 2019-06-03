import * as jwt from 'jsonwebtoken';
import config from 'config';

function generateAdminJWT() {
  const token = jwt.sign({ admin: true, userId: null }, config.JWT_SECRET, {
    noTimestamp: true,
  });
  console.log(token);
}

generateAdminJWT();
