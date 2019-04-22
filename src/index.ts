import createApp from '@utils/createApp';
import passport from '@utils/passport';
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

  app.get('/auth/google/callback', passport.authenticate('google'),
          (req, res) => res.redirect(`/users/${req.user.id}/`),
  );
});
