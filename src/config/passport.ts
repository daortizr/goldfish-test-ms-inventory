import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Request } from 'express';

// JWT Strategy configuration
const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  passReqToCallback: true
};

// JWT Strategy
passport.use(
  new JwtStrategy(jwtOptions, async (req: Request, payload: any, done: any) => {
    try {
      // Here you can validate the user from the database if needed
      // For now, we'll just pass the payload
      if (payload) {
        return done(null, payload);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;

