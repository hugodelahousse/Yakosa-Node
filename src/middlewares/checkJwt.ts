import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import config from 'config'
import crypto = require('crypto');

export var refreshTokens = {};

interface JWT {
    userId: string;
    googleId: string;
    exp: number;
}

export function checkJwt(request: Request, response: Response, next: NextFunction) {
    const token = request.headers.authorization;
    const refresh = request.headers['refresh'];
    if (!token)
        return response.status(403).send({ status: 403, error: 'No auth token found.'});

    try {
        jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
        if (error.name !== 'TokenExpiredError')
            return response.status(403).send({ status: 403, error: error.message});
    }

    const jwtDecoded = jwt.decode(token) as JWT;

    if (!jwtDecoded)
        return response.status(403).send({ status: 403, error: 'Token verification failed.'});

    if (refresh !== undefined && !Array.isArray(refresh) && refresh.length > 0) {
        if((refresh in refreshTokens) && (refreshTokens[refresh] == jwtDecoded.userId)) {
            const newToken = jwt.sign({ userId: jwtDecoded.userId, googleId: jwtDecoded.googleId },
                config.JWT_SECRET, { expiresIn: 1800 },
            );
            const newRefresh = crypto.randomBytes(Math.ceil(128 / 2)).toString('hex').slice(0, 128);
            delete refreshTokens[refresh];
            refreshTokens[newRefresh] = jwtDecoded.userId;
            return response.send({ token: newToken, refresh: newRefresh, googleId: jwtDecoded.googleId });
        }
        else {
            return response.status(403).send({ status: 403, error: 'Refresh Token verification failed'});
        }
    }
    const expirationDate = new Date(jwtDecoded.exp * 1000);
    if (expirationDate < new Date())
        return response.status(403).send({ status: 403, error: 'Token expired. Use refresh token to generate a new one.'});
  
    next();
  };
