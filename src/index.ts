import createApp from '@utils/createApp';
import passport from '@utils/passport';

import * as jwt from 'jsonwebtoken';
import config from 'config';
import apollo from '@graphql/apollo';

import { getRefreshToken, addRefreshToken } from 'middlewares/checkJwt';

createApp().then((app) => {
  const sentry = require('@sentry/node');
  sentry.init({ dsn: config.SENTRY_URL });

  app.use(sentry.Handlers.requestHandler());
  app.use(sentry.Handlers.errorHandler());

  app.use((err, req, res, next) => {
    res.statusCode = 400;
    res.end(`${res.sentry}`);
  });

  const port = process.env.PORT || 3000;
  console.log(`App starting on ${port}`);
  app.listen(port);
  apollo.applyMiddleware({ app });
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/google', passport.authenticate('google', {
    scope: 'profile',
  }));

  app.get('/auth/google/callback', passport.authenticate('google'), async (req, res) => {
    const token = jwt.sign({ userId: req.user.id },
                           config.JWT_SECRET, { expiresIn: 600 },
      );
    const refresh = await addRefreshToken(req.user.id);
    res.send({ token, refresh });
  });

  app.get('/auth/google/token', passport.authenticate('google-token'), async (req, res) => {
    const token = jwt.sign({ userId: req.user.id },
                           config.JWT_SECRET, { expiresIn: 600 },
      );
    const refresh = await addRefreshToken(req.user.id);
    res.send({ token, refresh });
  });

  app.post('/auth/token/refresh', async (req, res) => {
    console.log('refreshing');
    console.log(req.body);
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res
        .status(403)
        .send({ status: 403, error: 'No auth token found.' });
    }

    if (refresh_token !== undefined && !Array.isArray(refresh_token) && refresh_token.length > 0) {
      const refreshFound = await getRefreshToken(refresh_token);
      if (refreshFound !== undefined) {
        const newToken = jwt.sign(
          { userId: refreshFound.userId },
          config.JWT_SECRET,
          { expiresIn: 600 },
        );
        const newRefresh = await addRefreshToken(refreshFound.userId);
        return res.send({
          token: newToken,
          refresh: newRefresh,
        });
      }
      return res
        .status(403)
        .send({ status: 403, error: 'Refresh Token verification failed' });
    }
  });
});
