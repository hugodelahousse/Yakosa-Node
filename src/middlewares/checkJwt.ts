import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { RefreshToken } from '../entities/RefreshToken';
import * as jwt from 'jsonwebtoken';
import config from 'config';
import crypto = require('crypto');

export interface JWT {
  userId: string;
  exp: number;
}

export async function checkJwt(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const token = request.headers.authorization;
  if (!token)
    return response
      .status(403)
      .send({ status: 403, error: 'No auth token found.' });

  try {
    const jwtDecoded = jwt.verify(
      token.split(' ')[1],
      config.JWT_SECRET,
    ) as JWT;

    if (!jwtDecoded)
      return response
        .status(403)
        .send({ status: 403, error: 'Token verification failed.' });
  } catch (error) {
    return response
      .status(403)
      .send({status: 403, error: error.message});
  }

  next();
}

export async function getRefreshToken(token: string) {
  const repository = getRepository(RefreshToken);
  return repository.findOne({ token });
}

export async function addRefreshToken(userId: number) {
  const repository = getRepository(RefreshToken);
  const toRemove = await repository.findOne({ userId });
  if (toRemove) {
    await repository.remove(toRemove);
  }
  const rt = new RefreshToken();
  const token = crypto
    .randomBytes(Math.ceil(128 / 2))
    .toString('hex')
    .slice(0, 128);
  rt.token = token;
  rt.userId = userId;
  repository.save(rt);
  return token;
}
