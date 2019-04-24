import createApp from '@utils/createApp';
import passport from '@utils/passport';

createApp().then((app) => {
  const port = process.env.PORT || 3000;
  console.log(`App starting on ${port}`);
  app.listen(port);
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/google', passport.authenticate('google', {
    scope: 'profile',
  }));

  app.get('/auth/google/callback', passport.authenticate('google'),
          (req, res) => res.redirect(`/users/${req.user.id}/`),
  );

  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'profile',
  }));

  app.get('/auth/facebook/callback', passport.authenticate('facebook'),
          (req, res) => res.redirect(`/users/${req.user.id}/`),
  );
});
