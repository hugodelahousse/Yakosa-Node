import createApp from '@utils/createApp';
import passport from '@utils/passport';

import * as jwt from 'jsonwebtoken';
import config from 'config';
import { getRefreshToken, addRefreshToken } from 'middlewares/checkJwt';
import apollo from '@graphql/apollo';

createApp().then((app) => {
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
                           config.JWT_SECRET, { expiresIn: 30 },
      );
    const refresh = await addRefreshToken(req.user.id);
    res.send({ token, refresh });
  });

  app.get('/auth/google/token', passport.authenticate('google-token'), async (req, res) => {
    const token = jwt.sign({ userId: req.user.id },
                           config.JWT_SECRET, { expiresIn: 1800 },
      );
    const refresh = await addRefreshToken(req.user.id);
    res.send({ token, refresh });
  });

  app.post('/auth/token/refresh', async (req, res) => {
    const refresh = req.body['token'];
    if (!refresh)
      return res
        .status(403)
        .send({ status: 403, error: 'No auth token found.' });

    if (refresh !== undefined && !Array.isArray(refresh) && refresh.length > 0) {
      const refreshFound = await getRefreshToken(refresh);
      if (refreshFound !== undefined) {
        const newToken = jwt.sign(
          { userId: refreshFound.userId},
          config.JWT_SECRET,
          { expiresIn: 30 },
        );
        const newRefresh = await addRefreshToken(refreshFound.userId);
        return res.send({
          token: newToken,
          refresh: newRefresh,
        });
      } else {
        return res
          .status(403)
          .send({ status: 403, error: 'Refresh Token verification failed' });
      }
    }
  });
});
