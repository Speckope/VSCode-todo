import 'reflect-metadata';
require('dotenv-safe').config();
import express from 'express';
import { createConnection } from 'typeorm';
import { __prod__ } from './constants';
import { join } from 'path';
import { User } from './entities/User';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import jwt from 'jsonwebtoken';

// This is for looking cool. We can use now await in there!
// (async () => {
//   const app = express();
// })();

// This is for looking clean and we achieve the same result xd
const main = async () => {
  // Connect do db
  await createConnection({
    type: 'postgres',
    database: 'vstodo',
    username: 'postgres',
    // dropSchema: true, // this will cause to drop data on load
    password: process.env.DB_PASSWORD,
    // join is a special variable taht will get us absolute path from where we are running index.ts
    entities: [join(__dirname, './entities/*.*')], // *.* will get all files
    // logging actions
    logging: !__prod__,
    //makes sure our database has all the tables in it. Will create based on models we pass
    synchronize: !__prod__,
  });

  // const user = await User.create({ name: 'bob' }).save();

  // console.log(user);

  const app = express();

  // Passport stuff
  passport.serializeUser(function (user: any, done) {
    done(null, user.accessToken);
  });

  app.use(passport.initialize());

  passport.use(
    new GitHubStrategy(
      {
        // We get id and secret when creating new app on github
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        // This should match what we passed when creating an app on gitbuh
        callbackURL: 'http://localhost:3002/auth/github/callback',
      },
      // With accessToken and refresh we can make commands on behalf of the user!
      async (_accessToken, _refreshToken, profile, cb) => {
        // We check if user is in our db
        let user = await User.findOne({ where: { githubId: profile.id } });
        if (user) {
          // If user exists update him(he could have change something)
          user.name = profile.displayName;
          await user.save();
        } else {
          // If he's not in out db, create the user.
          user = await User.create({
            name: profile.displayName,
            githubId: profile.id,
          }).save();
        }
        // We call cb when we're done with this function. 2nd part is what we pass to out callback route
        cb(null, {
          accessToken: jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1y',
          }),
        });
      }
    )
  );

  app.get('/auth/github', passport.authenticate('github', { session: false }));

  app.get(
    '/auth/github/callback',
    // passport.authenticate('github', { failureRedirect: '/login' }),
    passport.authenticate('github', { session: false }),
    function (req: any, res) {
      // It will send back object after null in cb() function!
      // res.send(req.user.accessToken);
      // This wil stay same in the production. Extension will start a server on users computer!
      res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
      // Now we need to set up on the extension side to read that token!
    }
  );

  // Requests
  app.get('/', (_req, res) => {
    res.send('hello');
  });
  app.listen(3002, () => {
    console.log('listening on localhost:3002...');
  });
};

main();
