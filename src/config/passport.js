const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Google mail ile kullanıcı kontrolü
      const existingUser = await User.findOne({ email: profile.emails[0].value });
      
      if (existingUser) {
        // Kullanıcı varsa Google ID'sini güncelle
        existingUser.googleId = profile.id;
        await existingUser.save();
        return done(null, existingUser);
      }
      
      // Yeni kullanıcı oluştur
      const newUser = await User.create({
        email: profile.emails[0].value,
        name: profile.displayName,
        googleId: profile.id,
        // Diğer gerekli alanlar...
      });
      
      done(null, newUser);
    } catch (error) {
      done(error, null);
    }
  }
));

// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (!user) return done(null, false);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
})); 