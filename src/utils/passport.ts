import * as passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import config from 'config';
import { getRepository } from 'typeorm';
import { User } from '@entities/User';
import { PassportStatic } from 'passport';

passport.use(new GoogleStrategy(
  {
    clientID: config.GOOGLE_CONSUMER_KEY,
    clientSecret: config.GOOGLE_CONSUMER_SECRET,
    callbackURL: `${config.SERVER_URL}/auth/google/callback`,
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
        age: 0,
      });
    }
    return done(null, user);
  },
));

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  getRepository(User).findOneOrFail(id)
    .then(user => done(null, user))
    .catch(err => done(err, undefined));
});

export default passport;
