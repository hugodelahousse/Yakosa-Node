import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import config from 'config'

export function checkJwt(request: Request, response: Response, next: NextFunction) {
    const token = <string>request.headers.authorization;
    let jwtPayload;
    
    //Verification of token
    try {
        jwtPayload = <any>jwt.verify(token, config.JWT_SECRET);
        response.locals.jwtPayload = jwtPayload;
    } catch (error) {
        response.status(401).send({ status: 401, error: 'Token verification failed'});
        return;
    }
  
    //New token of 1h on every requests
    const { userId, googleId } = jwtPayload;
    const newToken = jwt.sign({ userId, googleId }, config.JWT_SECRET, {
        expiresIn: '1h'
    });
    response.setHeader('token', newToken);
    next();
  };