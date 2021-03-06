import * as passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import config from 'config';
import { getRepository } from 'typeorm';
import { User } from '@entities/User';
import { Strategy as GoogleTokenStrategy } from 'passport-token-google';

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CONSUMER_KEY,
      clientSecret: config.GOOGLE_CONSUMER_SECRET,
      callbackURL: `/auth/google/callback`,
    },
    async (token, tokenSecret, profile, done) => {
      const userRepository = getRepository(User);
      let user = await userRepository.findOne({ googleId: profile.id });
      if (user === undefined) {
        if (profile.name === undefined) {
          return done(new Error('No name information'), null);
        }
        user = await userRepository.save({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          googleId: profile.id,
        });
      }
      return done(null, user);
    },
  ),
);

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: config.GOOGLE_CONSUMER_KEY,
      clientSecret: config.GOOGLE_CONSUMER_SECRET,
    },
    async function(accessToken, refreshToken, profile, done) {
      const userRepository = getRepository(User);
      let user = await userRepository.findOne({ googleId: profile._json.sub });
      if (user === undefined) {
        if (profile.name === undefined) {
          return done(new Error('No name information'), null);
        }
        user = await userRepository.save({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          googleId: profile._json.sub,
        });
      }
      return done(null, user);
    },
  ),
);

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  getRepository(User)
    .findOneOrFail(id)
    .then(user => done(null, user))
    .catch(err => done(err, undefined));
});

export default passport;
