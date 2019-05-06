import createApp from '@utils/createApp';
import passport from '@utils/passport';
import crypto = require('crypto');

import * as jwt from 'jsonwebtoken';
import config from 'config';
import { refreshTokens, addRefreshToken } from 'middlewares/checkJwt';
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
    const token = jwt.sign({ userId: req.user.id, googleId: req.user.googleId },
                           config.JWT_SECRET, { expiresIn: 1800 },
      );
    const refresh = await addRefreshToken(req.user.id);
    res.send({ token, refresh, googleId: req.user.googleId });
  });

  app.get('/auth/google/token', passport.authenticate('google-token'), async (req, res) => {
    const token = jwt.sign({ userId: req.user.id, googleId: req.user.googleId },
                           config.JWT_SECRET, { expiresIn: 1800 },
      );
    const refresh = await addRefreshToken(req.user.id);
    res.send({ token, refresh, googleId: req.user.googleId });
  });
});
