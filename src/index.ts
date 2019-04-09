import createApp from '@utils/createApp';
import passport from '@utils/passport';

import * as jwt from 'jsonwebtoken';
import config from 'config';

createApp().then((app) => {
  const port = process.env.PORT || 3000;
  console.log(`App starting on ${port}`);
  app.listen(port);
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/google', passport.authenticate('google', {
    scope: 'profile',
  }));

  app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    const token = jwt.sign({ userId: req.user.id, googleId: req.user.googleId },
                           config.JWT_SECRET, { expiresIn: '1h' },
      );

    res.send({ token, googleId: req.user.googleId });
  });
});
