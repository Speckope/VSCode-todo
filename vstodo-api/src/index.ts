import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { __prod__ } from './constants';
import { join } from 'path';

// This is for looking cool. We can use now await in there!
// (async () => {
//   const app = express();
// })();

// This is for looking clean and we achieve the same result xd
const main = async () => {
  await createConnection({
    type: 'postgres',
    database: 'vstodo',
    username: 'postgres',
    password: 'HalucynogennyWieloryb',
    // join is a special variable taht will get us absolute path from where we are running index.ts
    entities: [join(__dirname, './entities/*.*')], // *.* will get all files
    // logging actions
    logging: !__prod__,
    //makes sure our database has all the tables in it. Will create based on models we pass
    synchronize: !__prod__,
  });

  const app = express();
  app.get('/', (_req, res) => {
    res.send('hello');
  });
  app.listen(3002, () => {
    console.log('listening on localhost:3002...');
  });
};

main();
